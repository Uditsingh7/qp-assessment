import { Router } from 'express';
import {
    addGroceryItem, viewGroceryItems, updateGroceryItem, manageInventory,
    deleteGroceryItem
} from '../controllers/adminController';

const router = Router();

// Route for adding a new grocery item
router.post('/grocery-items', addGroceryItem);
// Route for adding a viewing grocery items
router.get('/grocery-items', viewGroceryItems);

// Route for updating an existing grocery item
router.put('/grocery-items/:itemId', updateGroceryItem);

// Route for managing inventory (adding or subtracting quantity) of an item
router.post('/grocery-items/manage-inventory', manageInventory);

// Route to delete a specific grocery item by its id
router.delete('/grocery-items/:itemId', deleteGroceryItem);


export { router };
