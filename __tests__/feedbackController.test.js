import { addFeedback, getAllFeedback, deleteFeedbackByTitle } from '../src/controllers/feedbackController';
import { pool } from '../src/db';

// Mock the pool.query function
jest.mock('../src/db', () => ({
    pool: {
        query: jest.fn()
    }
}));

describe('Feedback Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();  // Clear mocks after each test
    });

    // Test for adding feedback
    it('should save feedback successfully', async () => {
        const mockFeedback = {
            id: 1,
            title: 'Test Feedback',
            text: 'Test text'
        };

        // Mocking the resolved value for the pool.query function
        pool.query.mockResolvedValue({ rows: [mockFeedback] });

        // Calling the addFeedback function
        const result = await addFeedback('Test Feedback', 'Test text');

        // Expect the result to match the mock feedback
        expect(result).toEqual(mockFeedback);

        // Ensure the pool.query is called with the correct SQL and values
        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO feedback (title, text) VALUES ($1, $2) RETURNING *;', 
            ['Test Feedback', 'Test text']
        );
    });

    // Test for retrieving all feedback
    it('should retrieve all feedback successfully', async () => {
        const mockFeedback = [{ id: 1, title: 'Test Feedback', text: 'Test text' }];

        // Mocking the resolved value for the pool.query function
        pool.query.mockResolvedValue({ rows: mockFeedback });

        // Calling the getAllFeedback function
        const result = await getAllFeedback();

        // Expect the result to match the mock feedback array
        expect(result).toEqual(mockFeedback);

        // Ensure the pool.query is called with the correct SQL query
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM feedback;');  // Include the semicolon if your SQL string uses it
    });

    // Test for deleting feedback by title
    it('should delete feedback by title successfully', async () => {
        const mockResponse = {
            message: 'Feedback erfolgreich gelöscht.',
            status: 200,
            data: { id: 1, title: 'Test Feedback', text: 'Test text' }
        };
        const title = 'Test Feedback';
    
        // Mocking the resolved value for the pool.query function
        pool.query.mockResolvedValue({ rows: [mockResponse.data], rowCount: 1 });
    
        // Calling the deleteFeedbackByTitle function
        const result = await deleteFeedbackByTitle(title);
    
        // Expect the result to match the mock response
        expect(result).toEqual(mockResponse);
    
        // Ensure the pool.query is called with the correct SQL query and values
        expect(pool.query).toHaveBeenCalledWith(
            'DELETE FROM feedback WHERE title = $1 RETURNING *;',
            [title]
        );
    });

    // Test for feedback not found when attempting to delete
    it('should return null if feedback not found for deletion', async () => {
        const mockResponse = { rows: [], rowCount: 0 };  // Simulate no feedback found
        const title = 'Nonexistent Feedback';

        // Mocking the resolved value for the pool.query function
        pool.query.mockResolvedValue(mockResponse);

        // Calling the deleteFeedbackByTitle function
        const result = await deleteFeedbackByTitle(title);

        // Expect the result to be null because no rows were deleted
        expect(result).toBeNull();

        // Ensure the pool.query is called with the correct SQL query and values
        expect(pool.query).toHaveBeenCalledWith(
            'DELETE FROM feedback WHERE title = $1 RETURNING *;', 
            [title]
        );
    });
});
