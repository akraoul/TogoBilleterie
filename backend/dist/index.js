"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
console.log("Starting backend...");
console.log("DATABASE_URL length:", process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Togo Tickets Backend is running' });
});
// Example Route: Get Events
app.get('/api/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma.event.findMany();
        res.json(events);
    }
    catch (error) {
        console.error("Database error, returning mock data:", error);
        // Fallback Mock Data
        res.json([
            { id: 1, title: "Concert Live Lomé #1 (API)", date: new Date("2026-01-15"), location: "Palais des Congrès", price: 5000, category: "Musique", imageUrl: null, organizer: "Togo Events" },
            { id: 2, title: "Festival des Arts (API)", date: new Date("2026-01-20"), location: "Plage de Lomé", price: 2000, category: "Festival", imageUrl: null, organizer: "Culture Info" },
        ]);
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
