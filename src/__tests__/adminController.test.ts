import { Request, Response } from 'express';
import * as adminController from '../controllers/adminController';
import GroceryItem from '../models/groceryItem.model';

jest.mock('../models/groceryItem.model');

describe('Admin Controller', () => {
    describe('addGroceryItem', () => {
        it('should add a new grocery item', async () => {
            // Mock request and response objects
            const req = { body: { name: 'Test Item', price: 10, quantity: 5 } } as Request;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            // Mock create method of GroceryItem model
            const createMock = jest.spyOn(GroceryItem, 'create').mockResolvedValueOnce({
                name: 'Test Item',
                price: 10,
                quantity: 5,
            } as unknown as GroceryItem);

            // Call controller function
            await adminController.addGroceryItem(req, res);

            // Verify response
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'New grocery item added!',
                item: {
                    name: 'Test Item',
                    price: 10,
                    quantity: 5,
                },
            });

            // Verify that create method of GroceryItem model was called with correct arguments
            expect(createMock).toHaveBeenCalledWith({
                name: 'Test Item',
                price: 10,
                quantity: 5,
            });
        });
    });
    describe('Update Grocery Item Controller', () => {
        it('should update an existing grocery item', async () => {
            const mockRequest: Partial<Request> = {
                params: { itemId: '1' },
                body: { name: 'New Item Name', price: 10.99, quantity: 20 },
            };

            const mockResponse: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mocking the findByPk and save methods of GroceryItem model
            const mockFindByPk = jest.spyOn(GroceryItem, 'findByPk');
            mockFindByPk.mockResolvedValueOnce({
                id: 1,
                name: 'Existing Item Name',
                price: 5.99,
                quantity: 10,
                save: jest.fn(),
            } as any);

            // Call the controller function
            await adminController.updateGroceryItem(mockRequest as Request, mockResponse as Response);

            // Verify the response
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Grocery item updated successfully',
                data: expect.objectContaining({
                    id: 1,
                    name: 'New Item Name',
                    price: 10.99,
                    quantity: 20,
                }),
            });

            // Verify that the findByPk method was called with the correct itemId
            expect(mockFindByPk).toHaveBeenCalledWith('1');
        });

    });
    describe('Delete Grocery Item Controller', () => {
        it('should delete an existing grocery item', async () => {
            const mockRequest: Partial<Request> = {
                params: { itemId: '1' },
            };

            const mockResponse: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mocking the findByPk and destroy methods of GroceryItem model
            const mockFindByPk = jest.spyOn(GroceryItem, 'findByPk');
            mockFindByPk.mockResolvedValueOnce({
                id: 1,
                name: 'Existing Item Name',
                price: 5.99,
                quantity: 10,
                destroy: jest.fn(),
            } as any);

            // Call the controller function
            await adminController.deleteGroceryItem(mockRequest as Request, mockResponse as Response);

            // Verify the response
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Grocery item deleted successfully',
            });

            // Verify that the findByPk method was called with the correct itemId
            expect(mockFindByPk).toHaveBeenCalledWith('1');
        });
    });

    describe('View Grocery Items Controller', () => {
        it('should retrieve and return grocery items', async () => {
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
            await adminController.viewGroceryItems(mockRequest as Request, mockResponse as Response);

            // Verify the response
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Grocery items retrieved successfully',
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
                limit: 10,
                offset: 0,
                order: [['createdAt', 'DESC']],
            });
        });
    });

    describe('Manage Inventory Controller', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should increase the quantity', async () => {
            const mockRequest: Partial<Request> = {
                body: { itemId: 1, operation: "increase", quantity: 20 },
            };

            const mockResponse: Partial<Response> = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mocking the findByPk and save methods of GroceryItem model
            const mockFindByPk = jest.spyOn(GroceryItem, 'findByPk');
            mockFindByPk.mockResolvedValueOnce({
                id: 1,
                name: 'Existing Item Name',
                price: 5.99,
                quantity: 10,
                save: jest.fn(),
            } as any);

            // Call the controller function
            await adminController.manageInventory(mockRequest as Request, mockResponse as Response);

            // Verify the response
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Inventory managed successfully',
                data: expect.objectContaining({
                    id: 1,
                    name: 'Existing Item Name',
                    price: 5.99,
                    quantity: 30,
                }),
            });

            // Verify that the findByPk method was called with the correct itemId
            expect(mockFindByPk).toHaveBeenCalledWith(1);
        });

        it('should handle decrease operation', async () => {
            // test case for handling invalid operations
        });
        it('should handle set zero operation', async () => {
            // test case for handling invalid operations
        });
        it('should handle invalid operations', async () => {
            // test case for handling invalid operations
        });

        it('should handle non-existent item', async () => {
            // test case for handling non-existent item
        });

        it('should handle insufficient quantity', async () => {
            // test case for handling insufficient quantity
        });

        it('should handle internal server error', async () => {
            // test case for handling internal server error
        });
    });
});
