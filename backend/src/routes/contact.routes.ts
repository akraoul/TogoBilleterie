import { Router } from 'express';
import { submitContactForm, getContactMessages } from '../controllers/contact.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public: Submit form
router.post('/', submitContactForm);

// Protected (Admin): Get all messages
// TODO: Add admin check middleware if available, simple auth for now
router.get('/', authenticateToken, getContactMessages);

export default router;
