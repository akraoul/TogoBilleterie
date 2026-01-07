import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
        const totalPromoters = await prisma.user.count({ where: { role: 'ORGANIZER' } });
        const totalEvents = await prisma.event.count();
        const pendingEvents = await prisma.event.count({ where: { status: 'PENDING' } });
        const revenue = 0; // Placeholder for now

        res.json({
            users: totalUsers,
            promoters: totalPromoters,
            events: totalEvents,
            pendingEvents,
            revenue
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

export const getPendingEvents = async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
            include: { tickets: true } // Optional: include ticket info
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending events', error });
    }
};

export const updateEventStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // APPROVED or REJECTED

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const event = await prisma.event.update({
            where: { id: parseInt(id) },
            data: { status },
        });

        res.json({ message: `Event ${status.toLowerCase()}`, event });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event status', error });
    }
};

export const getPromoters = async (req: Request, res: Response) => {
    try {
        const promoters = await prisma.user.findMany({
            where: { role: 'ORGANIZER' },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });
        res.json(promoters);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching promoters', error });
    }
};

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all events', error });
    }
};
