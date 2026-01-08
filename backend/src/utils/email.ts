
import nodemailer from 'nodemailer';

// Create a transporter. 
// For production, you would need a real SMTP service (e.g. Gmail, SendGrid, Resend).
// For now, we'll try to use a "test" account if available, or just log if env vars aren't set.
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER || 'ethereal_user',
        pass: process.env.SMTP_PASS || 'ethereal_pass'
    }
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    // If no real SMTP is configured, we might want to just log the message for development
    // to avoid crashing.
    if (!process.env.SMTP_HOST) {
        console.log('--- MOCK EMAIL SEND ---');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${text}`);
        console.log('-----------------------');
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: '"TogoTickets Support" <support@togotickets.com>',
            to,
            subject,
            text,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        // Fallback logging
        console.log('--- FALLBACK EMAIL LOG ---');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${text}`);
    }
};
