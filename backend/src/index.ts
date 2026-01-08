import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './lib/prisma';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import eventsRoutes from './routes/events.routes';
import ticketsRoutes from './routes/tickets.routes';
import contactRoutes from './routes/contact.routes';

dotenv.config();

const app = express();
console.log("Starting backend...");
console.log("DATABASE_URL length:", process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);
// Trigger restart

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

console.log("Mounting Auth Routes...");
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/contact', contactRoutes);

// Basic Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Togo Tickets Backend is running' });
});

// Example Route: Get Events
app.get('/api/events', async (req, res) => {
    try {
        const events = await prisma.event.findMany();
        res.json(events);
    } catch (error) {
        console.error("Database error, returning mock data:", error);
        // Fallback Mock Data
        res.json([
            { id: 1, title: "Concert Live Lomé #1 (API)", date: new Date("2026-01-15"), location: "Palais des Congrès", price: 5000, category: "Musique", imageUrl: null, organizer: "Togo Events" },
            { id: 2, title: "Festival des Arts (API)", date: new Date("2026-01-20"), location: "Plage de Lomé", price: 2000, category: "Festival", imageUrl: null, organizer: "Culture Info" },
        ]);
    }
});

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
