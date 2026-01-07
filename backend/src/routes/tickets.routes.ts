import { Router } from 'express';
import { buyTicket, getMyTickets } from '../controllers/tickets.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public route for buying tickets
router.post('/buy', buyTicket);

// Protected route to get my tickets
router.get('/my', authenticateToken, getMyTickets);

export default router;
