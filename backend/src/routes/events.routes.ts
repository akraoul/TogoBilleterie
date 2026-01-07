import { Router } from 'express';
import { createEvent, getMyEvents, getPublicEvents, updateEvent, getEventById } from '../controllers/events.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorizeOrganizer } from '../middlewares/organizer.middleware';

const router = Router();

// Public Routes
router.get('/public', getPublicEvents);

// Authenticated Routes that conflict with params must come first
// We explicitly add authenticateToken here because we are defining it before the general router.use(authenticateToken)
router.get('/my', authenticateToken, authorizeOrganizer, getMyEvents);

router.get('/:id', getEventById); // Public details page

// Routes for Promoters
import { upload } from '../middlewares/upload.middleware';
router.use(authenticateToken); // Apply auth to all promoter routes below

// Create/Update Event (Organizer only)
router.post('/', authorizeOrganizer, upload.single('image'), createEvent);
router.put('/:id', authorizeOrganizer, upload.single('image'), updateEvent);

export default router;
