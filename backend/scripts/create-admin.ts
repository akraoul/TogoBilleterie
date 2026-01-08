
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
    const email = 'admin@togotickets.com';
    const password = 'raoul07';
    const name = 'Super Admin';

    try {
        const existingAdmin = await prisma.user.findUnique({ where: { email } });
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingAdmin) {
            console.log('Admin exists, updating password...');
            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            });
            console.log('Admin password updated successfully!');
            return;
        }

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'ADMIN',
                phoneNumber: '+22800000000' // Dummy phone for admin
            }
        });

        console.log('Admin created successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
