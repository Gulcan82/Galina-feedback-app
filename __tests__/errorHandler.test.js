// __tests__/errorHandler.test.js
import { errorHandler } from '../src/middleware/errorHandler';

describe('Error Handler Middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();

        // Mocking console.error to avoid actual logging in the test output
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('soll 500 und "Internal Server Error" zurückgeben und den Fehler loggen', () => {
        const mockError = new Error('Test Error');

        errorHandler(mockError, mockReq, mockRes, mockNext);

        // Überprüfe, ob der Fehler geloggt wurde
        expect(console.error).toHaveBeenCalledWith(mockError.stack);

        // Überprüfe, ob die richtige Antwort gesendet wurde
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
});
