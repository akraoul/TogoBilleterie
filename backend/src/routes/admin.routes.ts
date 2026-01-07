import { Router } from 'express';
import { getStats, getPendingEvents, updateEventStatus, getPromoters, getAllEvents } from '../controllers/admin.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorizeAdmin } from '../middlewares/admin.middleware';

const router = Router();

// Protect all admin routes
router.use(authenticateToken, authorizeAdmin);

router.get('/stats', getStats);
router.get('/promoters', getPromoters);
router.get('/events', getAllEvents);
router.get('/events/pending', getPendingEvents);
router.patch('/events/:id/status', updateEventStatus);

export default router;
