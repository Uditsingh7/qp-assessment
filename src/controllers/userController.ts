// adminController.ts
import { Request, Response } from 'express';
import GroceryItem from '../models/groceryItem.model';
import { Op } from 'sequelize';
import Order from '../models/order.model';
import OrderItem from '../models/orderItem.model';

interface OrderItemPayload {
    itemId: number;
    quantity: number;
}


// User placing the order
export const placeOrder = async (req: Request, res: Response) => {
    try {
        // Extracting Users Id from the request body
        const userId = req.body.userId as number;

        // Extract order items from the request body
        const items: OrderItemPayload[] = req.body.items;

        // Fetch all items from the database to check availability and calculate total amount
        const fetchedItems = await GroceryItem.findAll({
            where: {
                // Assuming itemId is included in each order item object
                id: { [Op.in]: items.map((item) => item.itemId) }
            }
        });

        // Calculate total amount and check item availability
        let totalAmount = 0;
        const unavailableItems: number[] = [];
        for (const item of items) {
            const fetchedItem = fetchedItems.find((fetchedItem) => fetchedItem.id === item.itemId);
            if (!fetchedItem || fetchedItem.quantity < item.quantity) {
                unavailableItems.push(item.itemId);
            } else {
                totalAmount += fetchedItem.price * item.quantity;
            }
        }

        if (unavailableItems.length > 0) {
            return res.status(400).json({ message: 'One or more items are not available in sufficient quantity', unavailableItems });
        }


        // Create a new order
        const order = await Order.create({
            userId,
            totalAmount,
            status: 'Placed' // Assuming the initial status of the order is 'Placed'
        });

        // Create order items
        const orderItems = await Promise.all(items.map(async (item) => {
            const fetchedItem = fetchedItems.find((fetchedItem) => fetchedItem.id === item.itemId);
            if (!fetchedItem) {
                throw new Error(`Item with ID ${item.itemId} not found`);
            }
            const totalPrice = fetchedItem.price * item.quantity;

            // Create order item
            return OrderItem.create({
                orderId: order.id,
                itemId: item.itemId,
                quantity: item.quantity,
                price: fetchedItem.price,
                totalPrice
            });
        }));

        // Update quantities of items in the grocery_item table
        await Promise.all(items.map(async (item) => {
            const fetchedItem = fetchedItems.find((fetchedItem) => fetchedItem.id === item.itemId);
            if (!fetchedItem) {
                throw new Error(`Item with ID ${item.itemId} not found`);
            }
            fetchedItem.quantity -= item.quantity;
            await fetchedItem.save();
        }));

        // Success response
        return res.status(201).json({
            message: 'Order placed successfully',
            order,
            orderItems
        });
    } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};







// Get all available grocery items
export const getAvailableGroceryItems = async (req: Request, res: Response) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const offset = (page - 1) * pageSize;

        // Sorting and ordering parameters
        const sortBy = req.query.sortBy as string || 'createdAt';
        const sortOrder = req.query.sortOrder as string || 'DESC';

        // Query the database to retrieve available grocery items with pagination, sorting, and ordering
        const { count, rows: groceryItems } = await GroceryItem.findAndCountAll({
            where: {
                quantity: {
                    [Op.gt]: 0 // Check if quantity is greater than 0
                }
            },
            limit: pageSize,
            offset: offset,
            order: [[sortBy, sortOrder]]
        });

        // Check if there are any grocery items
        if (groceryItems.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No available grocery items found',
                data: null
            });
        }

        // If there are grocery items, return them as a response along with total count
        return res.status(200).json({
            status: 'success',
            message: 'Available grocery items retrieved successfully',
            data: {
                totalCount: count,
                currentPage: page,
                pageSize: pageSize,
                groceryItems: groceryItems
            }
        });

    } catch (error) {
        console.error('Error retrieving available grocery items:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            data: null
        });
    }
};


