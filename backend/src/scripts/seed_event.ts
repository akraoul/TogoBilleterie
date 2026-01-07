
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Create Organizer
    const hashedPassword = await bcrypt.hash('password123', 10);
    const organizer = await prisma.user.create({
        data: {
            email: 'organizer@test.com',
            name: 'Test Organizer',
            password: hashedPassword,
            role: 'ORGANIZER',
            phoneNumber: '90000000'
        }
    });

    // Create Event
    const event = await prisma.event.create({
        data: {
            title: 'Grand Concert Test',
            description: 'Un concert de test avec plusieurs types de billets.',
            date: new Date('2026-02-14T20:00:00Z'),
            location: 'Stade de Kégué',
            price: 2000, // min price
            category: 'Musique',
            organizer: organizer.name!,
            totalTickets: 1000,
            status: 'APPROVED',
            ticketTypes: {
                create: [
                    { name: 'Standard', price: 2000, quantity: 800 },
                    { name: 'VIP', price: 10000, quantity: 150 },
                    { name: 'VVIP', price: 25000, quantity: 50 },
                ]
            }
        },
        include: {
            ticketTypes: true
        }
    });

    console.log(`Created Event: ${event.title} (ID: ${event.id})`);
    console.log('Ticket Types:', event.ticketTypes);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
