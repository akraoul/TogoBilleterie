import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { registerSchema, loginSchema } from '../utils/validation';

import fs from 'fs';
import path from 'path';

const logError = (error: any, context: string) => {
    const logDir = path.join(__dirname, '../../logs');
    const logFile = path.join(logDir, 'error.log');
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${context}: ${JSON.stringify(error, null, 2)}\n`;

    try {
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
        fs.appendFileSync(logFile, logMessage);
    } catch (err) {
        console.error("Failed to write to log file:", err);
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, phoneNumber, password, name, role } = registerSchema.parse(req.body);

        // Check for existing user by email OR phone number
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    // @ts-ignore
                    { email: email || undefined },
                    // @ts-ignore
                    { phoneNumber: phoneNumber || undefined }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or phone number' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                // @ts-ignore
                phoneNumber,
                password: hashedPassword,
                name,
                role: role || 'USER',
            },
        });

        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        console.error("Registration Error details:", JSON.stringify(error, null, 2));
        logError(error, "Registration Failed");
        res.status(400).json({ message: 'Registration failed', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { identifier, password } = loginSchema.parse(req.body);

        // Try finding by email or phone
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    // @ts-ignore
                    { phoneNumber: identifier }
                ]
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        // @ts-ignore
        res.json({ token, user: { id: user.id, email: user.email, phoneNumber: user.phoneNumber, name: user.name, role: user.role } });
    } catch (error) {
        logError(error, "Login Failed");
        res.status(500).json({ message: 'Login failed', error });
    }
};

export const me = async (req: Request, res: Response) => {
    try {
        // req.user is populated by the middleware
        const userId = (req as any).user.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // @ts-ignore
        res.json({ id: user.id, email: user.email, phoneNumber: user.phoneNumber, name: user.name, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};
