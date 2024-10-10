import express from 'express';
import { addFeedback, getAllFeedback, deleteFeedbackByTitle } from '../controllers/feedbackController.js';
import { feedbackValidation } from '../middleware/validation.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const feedbackRouter = express.Router();

// POST /feedback - adds new feedback
feedbackRouter.post('/feedback', feedbackValidation, async (req, res) => { 
    try {
        const { title, text } = req.body;
        const newFeedback = await addFeedback(title, text);
        sendSuccess(res, newFeedback, "Feedback successfully saved.", 201);
    } catch (error) {
        sendError(res, "Error saving feedback.", 500);  // Corrected to send an error on failure
    }
});

// GET /feedback - returns all feedback entries
feedbackRouter.get('/feedback', async (req, res) => {
    try {
        const feedback = await getAllFeedback();
        sendSuccess(res, feedback, "Feedback successfully retrieved.");
    } catch (error) {
        sendError(res, "Error retrieving feedback.", 500);
    }
});

// DELETE /feedback/:title - deletes feedback with the given title
feedbackRouter.delete('/feedback/:title', async (req, res) => {
    try {
        const { title } = req.params;

        const result = await deleteFeedbackByTitle(title);
        if (result.rowCount === 0) {
            return sendError(res, "Feedback not found.", 404);
        }
        sendSuccess(res, null, "Feedback successfully deleted.");
    } catch (error) {
        sendError(res, "Error deleting feedback.", 500);
    }
});

export default feedbackRouter;
