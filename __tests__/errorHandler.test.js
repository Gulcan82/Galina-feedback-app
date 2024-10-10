import request from 'supertest';
import express from 'express';
import { errorHandler } from '../src/middleware/errorHandler'; // Adjust path as needed

const app = express();
app.use(express.json());

// A sample route that triggers an error
app.get('/error', (req, res, next) => {
    next(new Error('Test Error'));
});

// Error handler middleware
app.use(errorHandler);

describe('Error Handler Middleware', () => {
    let originalConsoleError;

    // Suppress console.error during the test
    beforeAll(() => {
        originalConsoleError = console.error;
        console.error = jest.fn(); // Mock console.error
    });

    // Restore console.error after the test
    afterAll(() => {
        console.error = originalConsoleError;
    });

    it('should return 500 and "Internal Server Error" when an error occurs', async () => {
        const response = await request(app).get('/error');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal Server Error');
        expect(console.error).toHaveBeenCalled(); // Ensure console.error was called
    });
});
