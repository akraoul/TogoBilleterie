import { Request, Response } from 'express';
import { PrismaClient, EventStatus, PaymentStatus } from '@prisma/client';
import { sendEmail } from '../utils/email';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: any;
}

export const cancelEvent = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        // 1. Authorize: Check if user is organizer and owner of the event
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const organizerName = user?.name || user?.email;

        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: { tickets: true }
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.organizer !== organizerName) {
            return res.status(403).json({ message: 'You are not authorized to cancel this event' });
        }

        if (event.status === EventStatus.CANCELLED) {
            return res.status(400).json({ message: 'Event is already cancelled' });
        }

        // 2. Transaction: Process Refunds and Cancel Tickets/Event
        const result = await prisma.$transaction(async (tx) => {
            // Find all valid tickets involved
            const validTickets = await tx.ticket.findMany({
                where: {
                    eventId: parseInt(id),
                    status: 'VALID'
                },
                include: { user: true, payment: true }
            });

            // Update Payments to REFUNDED
            await tx.payment.updateMany({
                where: {
                    ticket: { eventId: parseInt(id) },
                    status: PaymentStatus.COMPLETED
                },
                data: { status: PaymentStatus.REFUNDED }
            });

            // Update Tickets to CANCELLED
            await tx.ticket.updateMany({
                where: { eventId: parseInt(id) },
                data: { status: 'CANCELLED' } // TicketStatus.CANCELLED (if exported or string is fine)
            });

            // Update Event to CANCELLED
            const updatedEvent = await tx.event.update({
                where: { id: parseInt(id) },
                data: { status: EventStatus.CANCELLED }
            });

            return { updatedEvent, validTickets };
        });

        // 3. Notify Users (Non-blocking)
        // In a real app, use a queue. Here we just loop.
        result.validTickets.forEach(ticket => {
            if (ticket.user.email) {
                sendEmail(
                    ticket.user.email,
                    `Annulation Événement: ${event.title}`,
                    `Bonjour, \n\nL'événement "${event.title}" a été annulé par l'organisateur. \n\nVotre billet a été annulé et une procédure de remboursement a été initiée pour votre paiement (Référence Ticket: ${ticket.qrCode}).\n\nCordialement,\nL'équipe TogoTickets`
                ).catch(console.error);
            }
        });

        res.json({
            message: 'Event cancelled successfully',
            refundedTickets: result.validTickets.length,
            event: result.updatedEvent
        });

    } catch (error) {
        console.error("Error cancelling event:", error);
        res.status(500).json({ message: 'Error cancelling event', error });
    }
};
