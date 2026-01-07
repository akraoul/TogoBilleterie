import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: any;
}

export const createEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, date, location, category, tmoneyNumber, floozNumber } = req.body;
        const userId = req.user?.userId;
        const ticketTypes = JSON.parse(req.body.ticketTypes || '[]');

        let imageUrl = req.body.imageUrl; // Fallback to URL if provided
        if (req.file) {
            // Assuming server is running on localhost:3001, otherwise use env var
            const baseUrl = process.env.API_URL || 'http://localhost:3001';
            imageUrl = `${baseUrl}/uploads/events/${req.file.filename}`;
        }

        // Fetch user details to get exact name
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const organizerName = user?.name || user?.email || 'Unknown Organizer';

        // Basic validation
        if (!title || !description || !date || !location || !ticketTypes || ticketTypes.length === 0) {
            return res.status(400).json({ message: 'Missing required fields or ticket types' });
        }

        // Calculate legacy fields for compatibility
        const price = Math.min(...ticketTypes.map((t: any) => parseFloat(t.price)));
        const totalTickets = ticketTypes.reduce((acc: number, t: any) => acc + (parseInt(t.quantity) || 0), 0);

        const newEvent = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
                price: price, // Already a number
                category,
                imageUrl,
                organizer: organizerName,
                tmoneyNumber,
                floozNumber,
                totalTickets: totalTickets,
                status: 'PENDING',
                ticketTypes: {
                    create: ticketTypes.map((t: any) => ({
                        name: t.name,
                        price: parseFloat(t.price),
                        quantity: parseInt(t.quantity)
                    }))
                }
            },
            include: {
                ticketTypes: true
            }
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: 'Error creating event', error });
    }
};

export const getMyEvents = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const organizerName = user?.name || user?.email;

        console.log(`[getMyEvents] UserID: ${userId}, Role: ${user?.role}, Name: ${user?.name}, OrganizerName: ${organizerName}`);

        if (!organizerName) {
            console.log('[getMyEvents] No organizer name found, returning empty.');
            return res.json([]);
        }

        // Note: Currently the Event model stores "organizer" as a string. 
        // In a real app we'd filter by user ID. 
        // For now, filtering by the string stored during creation.

        const events = await prisma.event.findMany({
            where: { organizer: organizerName },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { tickets: true }
                }
            }
        });
        console.log(`[getMyEvents] Found ${events.length} events for organizer ${organizerName}`);

        res.json(events);
    } catch (error) {
        console.error("Error fetching my events:", error);
        res.status(500).json({ message: 'Error fetching my events', error });
    }
};

export const getPublicEvents = async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany({
            where: { status: 'APPROVED' },
            orderBy: { date: 'asc' }
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public events', error });
    }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, date, location, category, tmoneyNumber, floozNumber } = req.body;
        const userId = req.user?.userId;

        // Parse ticketTypes if provided (FormData sends as string)
        let ticketTypes: any[] = [];
        if (req.body.ticketTypes) {
            try {
                ticketTypes = JSON.parse(req.body.ticketTypes);
            } catch (e) {
                ticketTypes = [];
            }
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const organizerName = user?.name || user?.email;

        const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.organizer !== organizerName) {
            return res.status(403).json({ message: 'You are not authorized to edit this event' });
        }

        let imageUrl = event.imageUrl;
        if (req.file) {
            const baseUrl = process.env.API_URL || 'http://localhost:3001';
            imageUrl = `${baseUrl}/uploads/events/${req.file.filename}`;
        }

        const updateData: any = {
            title,
            description,
            date: date ? new Date(date) : undefined,
            location,
            category,
            imageUrl,
            tmoneyNumber,
            floozNumber,
            status: 'PENDING',
        };

        if (ticketTypes.length > 0) {
            updateData.price = Math.min(...ticketTypes.map((t: any) => parseFloat(t.price)));
            updateData.totalTickets = ticketTypes.reduce((acc: number, t: any) => acc + (parseInt(t.quantity) || 0), 0);

            await prisma.$transaction([
                prisma.ticketType.deleteMany({ where: { eventId: parseInt(id) } }),
                prisma.event.update({
                    where: { id: parseInt(id) },
                    data: {
                        ...updateData,
                        ticketTypes: {
                            create: ticketTypes.map((t: any) => ({
                                name: t.name,
                                price: parseFloat(t.price),
                                quantity: parseInt(t.quantity)
                            }))
                        }
                    }
                })
            ]);
        } else {
            await prisma.event.update({
                where: { id: parseInt(id) },
                data: updateData
            });
        }

        const updatedEvent = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: { ticketTypes: true }
        });

        res.json(updatedEvent);

    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: 'Error updating event', error });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: { ticketTypes: true }
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event details', error });
    }
};
