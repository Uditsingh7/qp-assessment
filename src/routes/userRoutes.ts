// In routes/admin.ts or wherever your admin routes are defined
import { Router } from 'express';
import {
    getAvailableGroceryItems, placeOrder
} from '../controllers/userController';

const router = Router();

// Route for getting available items
router.get('/grocery-items/available', getAvailableGroceryItems);

// Route for placing an order
router.post('/grocery-items/order', placeOrder);
export { router };
