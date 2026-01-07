import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import nodemailer from 'nodemailer';

// Configure transporter (in production, use environment variables)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your SMTP provider
    auth: {
        user: process.env.EMAIL_USER || 'agbonon7@gmail.com', // Using the user's email as sender/receiver for now
        pass: process.env.EMAIL_PASS // User needs to provide this or App Password
    }
});

export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;

        // 1. Save to Database
        const savedMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject,
                message
            }
        });

        // 2. Send Email
        const mailOptions = {
            from: `"${name}" <${email}>`, // Check if the provider allows setting 'from' like this (often overridden)
            to: 'agbonon7@gmail.com',
            subject: `[TogoBilleterie Contact] ${subject}`,
            text: `
                Nouveau message de contact :
                
                Nom : ${name}
                Email : ${email}
                Sujet : ${subject}
                
                Message :
                ${message}
            `,
            html: `
                <h2>Nouveau message de contact</h2>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Sujet :</strong> ${subject}</p>
                <hr />
                <p><strong>Message :</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        // Note: Email sending might fail if no valid auth is provided, but we still saved to DB.
        // We'll wrap it in a try-catch to not block the response
        try {
            if (process.env.EMAIL_PASS) {
                await transporter.sendMail(mailOptions);
                console.log('Contact email sent successfully');
            } else {
                console.log('Skipping email sending: No EMAIL_PASS provided. Message saved to DB.');
                console.log('Email Content Preview:', mailOptions);
            }
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Don't fail the request, just log it. The message is safe in DB.
        }

        res.status(201).json({ message: 'Message sent successfully', data: savedMessage });

    } catch (error) {
        console.error("Error submitting contact form:", error);
        res.status(500).json({ message: 'Error submitting message', error });
    }
};

export const getContactMessages = async (req: Request, res: Response) => {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
};
