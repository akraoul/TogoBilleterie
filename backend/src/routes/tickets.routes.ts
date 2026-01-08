import { Router } from 'express';
import { buyTicket, getMyTickets } from '../controllers/tickets.controller';
import { authenticateToken, optionalAuthenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public route for buying tickets (but checks for user token if present)
router.post('/buy', optionalAuthenticateToken, buyTicket);

// Protected route to get my tickets
router.get('/my', authenticateToken, getMyTickets);

export default router;
