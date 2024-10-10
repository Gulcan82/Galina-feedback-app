import { sendSuccess, sendError } from "../src/utils/responseHelper"; 

const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

const mockData = { 
    id: 1, 
    title: 'Test Title', 
    text: 'Test text' 
};

describe('Response Helper', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for sendSuccess with default values
    it('should send success response with default message and status code', () => {
        sendSuccess(mockRes, mockData);

        expect(mockRes.status).toHaveBeenCalledWith(200);  // Default status code
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Request successful.',  // Default message
            data: mockData
        });
    });

    // Test for sendSuccess with custom message and status code
    it('should send success response with custom message and status code', () => {
        sendSuccess(mockRes, mockData, 'Custom success message', 201);

        expect(mockRes.status).toHaveBeenCalledWith(201);  // Custom status code
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Custom success message',  // Custom message
            data: mockData
        });
    });

    // Test for sendError with default status code (500)
    it('should send error response with default status code', () => {
        sendError(mockRes, 'Default error message');

        expect(mockRes.status).toHaveBeenCalledWith(500);  // Default status code
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Default error message' });
    });

    // Test for sendError with custom status code
    it('should send error response with custom status code', () => {
        sendError(mockRes, 'Custom error message', 400);

        expect(mockRes.status).toHaveBeenCalledWith(400);  // Custom status code
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Custom error message' });
    });
});
