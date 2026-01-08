import { Request, Response } from 'express';
import { PrismaClient, EventStatus, PaymentStatus } from '@prisma/client';
import { sendEmail } from '../utils/email';
import { sendSMS } from '../utils/sms';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: any;
}

// 1. IMPROVED: Admin Approves Cancellation (Triggers Refunds & Notifications)
export const approveCancellation = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        // Authorize: Check if user is ADMIN (Middleware should handle this, but double check)
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Only Admins can approve cancellations' });
        }

        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: { tickets: true }
        });

        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.status === EventStatus.CANCELLED) {
            return res.status(400).json({ message: 'Event is already cancelled' });
        }

        // Get organizer details for contact info
        const organizer = await prisma.user.findFirst({
            where: {
                OR: [{ name: event.organizer }, { email: event.organizer }]
            }
        });

        // Transaction: Process Refunds and Cancel Tickets/Event
        const result = await prisma.$transaction(async (tx) => {
            // Find valid tickets
            const validTickets = await tx.ticket.findMany({
                where: { eventId: parseInt(id), status: 'VALID' },
                include: { user: true }
            });

            // Update Payments -> REFUNDED
            await tx.payment.updateMany({
                where: { ticket: { eventId: parseInt(id) }, status: PaymentStatus.COMPLETED },
                data: { status: PaymentStatus.REFUNDED }
            });

            // Update Tickets -> CANCELLED
            await tx.ticket.updateMany({
                where: { eventId: parseInt(id) },
                data: { status: 'CANCELLED' }
            });

            // Update Event -> CANCELLED
            const updatedEvent = await tx.event.update({
                where: { id: parseInt(id) },
                data: { status: EventStatus.CANCELLED }
            });

            return { updatedEvent, validTickets };
        });

        // Notify Users
        const organizerContact = `
        --------------------
        Contact Promoteur:
        Nom: ${organizer?.name || 'Nom non disponible'}
        Email: ${organizer?.email || 'Email non disponible'}
        Tel: ${organizer?.phoneNumber || 'Numéro non disponible'}
        --------------------`;

        result.validTickets.forEach(ticket => {
            if (ticket.user.email) {
                sendEmail(ticket.user.email, `Annulation: ${event.title}`, `Bonjour,\n\n"${event.title}" est officiellement annulé.\nVotre billet est annulé et remboursé.\n\n${organizerContact}`).catch(console.error);
            }
            if (ticket.user.phoneNumber) {
                sendSMS(ticket.user.phoneNumber, `TogoTickets: "${event.title}" annulé. Remboursement en cours. Contactez l'organisateur pour plus d'infos.`).catch(console.error);
            }
        });

        // Notify Organizer
        if (organizer?.email) {
            sendEmail(organizer.email, `Annulation Validée: ${event.title}`, `Votre demande d'annulation pour "${event.title}" a été validée par l'administrateur. Les remboursements ont été initiés.`).catch(console.error);
        }

        res.json({ message: 'Cancellation approved', refundedCount: result.validTickets.length });

    } catch (error) {
        console.error("Error approving cancellation:", error);
        res.status(500).json({ message: 'Error approving cancellation', error });
    }
};

// 2. NEW: Promoter Requests Cancellation
export const requestCancellation = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user?.userId;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const organizerName = user?.name || user?.email;

        const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });

        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.organizer !== organizerName) return res.status(403).json({ message: 'Not authorized' });

        if (event.status === EventStatus.CANCELLED) return res.status(400).json({ message: 'Already cancelled' });
        if (event.status === EventStatus.CANCELLATION_REQUESTED) return res.status(400).json({ message: 'Request already pending' });

        const updatedEvent = await prisma.event.update({
            where: { id: parseInt(id) },
            data: {
                status: EventStatus.CANCELLATION_REQUESTED,
                cancellationReason: reason
            }
        });

        // Notify Admins
        const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
        admins.forEach(admin => {
            if (admin.email) {
                sendEmail(admin.email, `Demande d'annulation: ${event.title}`, `Le promoteur "${organizerName}" demande l'annulation de "${event.title}".\nMotif: ${reason}\n\nVeuillez valider depuis le dashboard Admin.`).catch(console.error);
            }
        });

        res.json({ message: 'Cancellation requested', event: updatedEvent });

    } catch (error) {
        console.error("Error requesting cancellation:", error);
        res.status(500).json({ message: 'Error requesting cancellation', error });
    }
};
