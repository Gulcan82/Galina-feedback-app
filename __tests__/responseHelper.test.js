import request from 'supertest';
import express from 'express';
import feedbackRouter from '../src/routes/feedbackRoutes'; 
import { addFeedback, getAllFeedback, deleteFeedbackByTitle } from '../src/controllers/feedbackController';

// Mock the feedbackController functions
jest.mock('../src/controllers/feedbackController', () => ({
    addFeedback: jest.fn(),
    getAllFeedback: jest.fn(),
    deleteFeedbackByTitle: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/', feedbackRouter);

describe('Feedback Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('GET /feedback - should retrieve all feedbacks and return 200 status', async () => {
        const mockFeedbackList = [{ id: 1, title: 'Test Feedback', text: 'Test text' }];
        getAllFeedback.mockResolvedValue(mockFeedbackList); // Mock the function

        const response = await request(app).get('/feedback');
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockFeedbackList);
    });

    it('DELETE /feedback/:title - should delete feedback and return 200 status', async () => {
        const mockResponse = { rowCount: 1 };
        deleteFeedbackByTitle.mockResolvedValue(mockResponse); // Mock the function

        const response = await request(app).delete('/feedback/Test Feedback');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Feedback erfolgreich gelöscht.');  // Adjust language if needed
    });

    it('DELETE /feedback/:title - should return 404 if feedback not found', async () => {
        const mockResponse = { rowCount: 0 };
        deleteFeedbackByTitle.mockResolvedValue(mockResponse); // Mock the function

        const response = await request(app).delete('/feedback/Nonexistent Feedback');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Feedback not found');  // Ensure API returns this message
    });

    it('POST /feedback - should handle error when saving feedback fails', async () => {
        addFeedback.mockRejectedValue(new Error('Database error'));  // Mock the function

        const response = await request(app).post('/feedback').send({ title: 'Test', text: 'Error test' });
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');  // Ensure API returns this message
    });
});
