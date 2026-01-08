
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

export const buyTicket = async (req: Request, res: Response) => {
    try {
        const { eventId, ticketTypeId, quantity, paymentMethod, phoneNumber, userDetails } = req.body;
        const { firstName, lastName, email, phone } = userDetails;
        const name = `${firstName} ${lastName}`;

        // 1. Find or Create User
        let user: any = null;
        const loggedInUserId = (req as any).user?.userId;

        if (loggedInUserId) {
            user = await prisma.user.findUnique({ where: { id: loggedInUserId } });
        }

        if (!user) {
            // Check by email or phone.
            user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: email || undefined },
                        { phoneNumber: phone || undefined }
                    ]
                }
            });
        }

        if (!user) {
            // Create new user (Guest)
            // Generate a random password
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await prisma.user.create({
                data: {
                    email: email || null,
                    phoneNumber: phone || null,
                    name: name,
                    password: hashedPassword,
                    role: 'USER'
                }
            });
            console.log(`Created new user for checkout: ${user.id}`);
        } else if (loggedInUserId && user) {
            // Optional: Update missing info (e.g. phone) if logged in?
            // For now, we just trust the found user is the one to link.
        }

        // 2. Verify Event and Ticket Type
        const ticketType = await prisma.ticketType.findUnique({
            where: { id: ticketTypeId }
        });

        if (!ticketType || ticketType.eventId !== eventId) {
            return res.status(400).json({ message: 'Invalid ticket type for this event' });
        }

        if (ticketType.quantity < quantity) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        // 3. Process each ticket (loop if quantity > 1)
        // For simplicity, we'll create 'quantity' tickets.
        const createdTickets = [];

        for (let i = 0; i < quantity; i++) {
            // Create Ticket
            // Generate a unique QR code string (mock)
            const qrCode = `TKT-${eventId}-${ticketTypeId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

            const ticket = await prisma.ticket.create({
                data: {
                    userId: user.id,
                    eventId: eventId,
                    ticketTypeId: ticketTypeId,
                    status: 'VALID',
                    qrCode: qrCode,
                    payment: {
                        create: {
                            amount: ticketType.price,
                            method: paymentMethod || 'TMONEY',
                            status: 'COMPLETED', // Simulating instant success
                            transactionId: `TXN-${Date.now()}`
                        }
                    }
                }
            });
            createdTickets.push(ticket);
        }

        // 4. Update Ticket Type Quantity (?) - The schema has 'quantity' on TicketType, 
        // usually this means total capacity. If we want to track remaining, we should decrement.
        // Assuming 'quantity' is total capacity or remaining? 
        // Let's assume it's remaining for now, or we just track sales via Ticket count.
        // For now, let's decrement to be safe if that's the intent.
        await prisma.ticketType.update({
            where: { id: ticketTypeId },
            data: { quantity: { decrement: quantity } }
        });

        res.json({ message: 'Ticket purchased successfully', tickets: createdTickets });

    } catch (error) {
        console.error("Error buying ticket:", error);
        res.status(500).json({ message: 'Error processing purchase', error });
    }
};

export const getMyTickets = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const tickets = await prisma.ticket.findMany({
            where: { userId: Number(userId) },
            include: {
                event: true,
                ticketType: true,
                payment: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(tickets);
    } catch (error) {
        console.error("Error fetching my tickets:", error);
        res.status(500).json({ message: 'Error fetching tickets', error });
    }
};
