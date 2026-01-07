
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting execution...');

    console.log('Deleting Payments...');
    await prisma.payment.deleteMany({});

    console.log('Deleting Tickets...');
    await prisma.ticket.deleteMany({});

    console.log('Deleting TicketTypes...');
    await prisma.ticketType.deleteMany({});

    console.log('Deleting Events...');
    await prisma.event.deleteMany({});

    console.log('Deleting Users...');
    await prisma.user.deleteMany({});

    console.log('Database cleared (Events, Tickets, Payments, Users).');

    // Clean uploads
    const uploadsDir = path.join(__dirname, '../../uploads/events');
    if (fs.existsSync(uploadsDir)) {
        console.log('Cleaning uploads directory...');
        const files = fs.readdirSync(uploadsDir);
        for (const file of files) {
            if (file !== '.gitkeep') {
                fs.unlinkSync(path.join(uploadsDir, file));
            }
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
