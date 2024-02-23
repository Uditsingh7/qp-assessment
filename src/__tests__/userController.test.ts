import { Request, Response } from 'express';
import * as userController from '../controllers/userController';
import GroceryItem from '../models/groceryItem.model';
import Order from '../models/order.model';
import OrderItem from '../models/orderItem.model';
import { Op } from 'sequelize';

jest.mock('../models/groceryItem.model');
jest.mock('../models/order.model');
jest.mock('../models/orderItem.model');


describe('User Controller', () => {
    describe('getAvailableItems', () => {
        it('should retrieve and return available grocery items', async () => {
            const mockRequest: Partial<Request> = {
                query: { page: '1', pageSize: '10', sortBy: 'createdAt', sortOrder: 'DESC' },
            };

            const mockResponse: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mocking the findAndCountAll method of GroceryItem model
            const mockFindAndCountAll = jest.spyOn(GroceryItem, 'findAndCountAll');
            mockFindAndCountAll.mockResolvedValueOnce({
                count: 2,
                rows: [
                    { id: 1, name: 'Item 1', price: 10.99, quantity: 5 },
                    { id: 2, name: 'Item 2', price: 15.99, quantity: 8 },
                ],
            } as any);

            // Call the controller function
            await userController.getAvailableGroceryItems(mockRequest as Request, mockResponse as Response);

            // Verify the response
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Available grocery items retrieved successfully',
                data: {
                    totalCount: 2,
                    currentPage: 1,
                    pageSize: 10,
                    groceryItems: [
                        { id: 1, name: 'Item 1', price: 10.99, quantity: 5 },
                        { id: 2, name: 'Item 2', price: 15.99, quantity: 8 },
                    ],
                },
            });

            // Verify that the findAndCountAll method was called with the correct parameters
            expect(mockFindAndCountAll).toHaveBeenCalledWith({
                where: {
                    quantity: {
                        [Op.gt]: 0,
                    },
                },
                limit: 10,
                offset: 0,
                order: [['createdAt', 'DESC']],
            });
        });
    });

    describe('placeOrder', () => {
        it('should place an order successfully', async () => {
            // Mock request and response objects
            const req = {
                body: {
                    userId: 1,
                    items: [
                        { itemId: 1, quantity: 2 },
                        { itemId: 2, quantity: 3 }
                    ]
                }
            } as Request;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            // Mocking the findAll method of GroceryItem model
            const mockFindAll = jest.spyOn(GroceryItem, 'findAll');
            mockFindAll.mockResolvedValueOnce([
                { id: 1, price: 10, quantity: 5, save: jest.fn() },
                { id: 2, price: 15, quantity: 10, save: jest.fn() }
            ] as any);

            // Mocking the create method of Order and OrderItem models
            const mockOrderCreate = jest.spyOn(Order, 'create');
            mockOrderCreate.mockResolvedValueOnce({ id: 1, totalAmount: 65 } as any);
            const mockOrderItemCreate = jest.spyOn(OrderItem, 'create');
            mockOrderItemCreate.mockResolvedValueOnce({ id: 1, orderId: 1, itemId: 1, quantity: 2, price: 10, totalPrice: 20 } as any);
            mockOrderItemCreate.mockResolvedValueOnce({ id: 2, orderId: 1, itemId: 2, quantity: 3, price: 15, totalPrice: 45 } as any);

            // Call controller function
            await userController.placeOrder(req, res);

            // Verify response and method calls
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Order placed successfully',
                order: { id: 1, totalAmount: 65 },
                orderItems: [
                    { id: 1, orderId: 1, itemId: 1, quantity: 2, price: 10, totalPrice: 20 },
                    { id: 2, orderId: 1, itemId: 2, quantity: 3, price: 15, totalPrice: 45 }
                ]
            });
            expect(mockOrderCreate).toHaveBeenCalledWith({
                userId: 1,
                totalAmount: 65,
                status: 'Placed'
            });
            expect(mockOrderItemCreate).toHaveBeenCalledWith({
                orderId: 1,
                itemId: 1,
                quantity: 2,
                price: 10,
                totalPrice: 20
            });
            expect(mockOrderItemCreate).toHaveBeenCalledWith({
                orderId: 1,
                itemId: 2,
                quantity: 3,
                price: 15,
                totalPrice: 45
            });
            expect(mockFindAll).toHaveBeenCalledWith({
                where: {
                    id: { [Op.in]: [1, 2] }
                }
            });
        });

    })
})