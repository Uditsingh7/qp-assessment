import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model'; 

const checkUserRole = async (req: Request, res: Response, next: NextFunction) => {
    // Assuming we include the user's ID in the request object after authentication
    const userId = (req as any).user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if the user has admin role
        if (user.role !== 'Admin') {
            return res.status(403).json({ message: 'Forbidden: User is not an admin' });
        }        

        // If user has admin role, allow access
        next();
    } catch (error) {
        console.error('Error checking user role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default checkUserRole;
