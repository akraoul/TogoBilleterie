import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: any;
}

export const authorizeOrganizer = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && (req.user.role === 'ORGANIZER' || req.user.role === 'ADMIN')) {
        next();
    } else {
        res.status(403).json({ message: 'Require Organizer Role' });
    }
};
