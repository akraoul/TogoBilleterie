
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function verifyLogin() {
    const email = 'admin@togotickets.com';
    const password = 'raoul07';

    console.log(`Checking user: ${email}`);
    console.log(`Testing password: ${password}`);

    try {
        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) {
            console.error('❌ User NOT FOUND in the database.');
            return;
        }

        console.log('✅ User found.');
        console.log(`Stored Hash: ${user.password}`);

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log('✅ SUCCESS: Password matches the stored hash!');
        } else {
            console.error('❌ FAILURE: Password does NOT match the stored hash.');

            // Debug: Hash the password now and compare
            const newHash = await bcrypt.hash(password, 10);
            console.log(`Generated New Hash: ${newHash}`);
            console.log('If you verify this hash, it means the stored one was wrong/corrupted/different.');
        }

    } catch (error) {
        console.error('Error during verification:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyLogin();
