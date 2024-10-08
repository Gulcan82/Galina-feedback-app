import express from 'express';
import { addFeedback, getAllFeedback, deleteFeedbackByTitle } from '../controllers/feedbackController.js';
import { feedbackValidation } from '../middleware/validation.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const feedbackRouter = express.Router();

/**
 * POST /feedback
 * Fügt ein neues Feedback hinzu.
 * 
 * @name POST/feedback
 * @function
 * @memberof module:feedbackRouter
 * @param {Object} req - Das Anfrageobjekt, das die Feedbackdaten enthält (title, text).
 * @param {Object} res - Das Antwortobjekt, um eine HTTP-Antwort an den Client zu senden.
 * @returns {JSON} Erfolgreiche Antwort mit dem gespeicherten Feedback oder Fehlermeldung.
 */
feedbackRouter.post('/feedback', feedbackValidation, async (req, res) => { 
    try {
        const { title, text } = req.body;
        const newFeedback = await addFeedback(title, text);
        sendSuccess(res, newFeedback, "Feedback erfolgreich gespeichert.");
    } catch (error) {
        sendError(res, "Fehler beim Speichern des Feedbacks.");
    }
});

/**
 * GET /feedback
 * Gibt alle Feedback-Einträge zurück.
 * 
 * @name GET/feedback
 * @function
 * @memberof module:feedbackRouter
 * @param {Object} req - Das Anfrageobjekt.
 * @param {Object} res - Das Antwortobjekt, um eine HTTP-Antwort an den Client zu senden.
 * @returns {JSON} Erfolgreiche Antwort mit einer Liste aller Feedback-Einträge oder Fehlermeldung.
 */
feedbackRouter.get('/feedback', async (req, res) => {
    try {
        const feedback = await getAllFeedback();
        sendSuccess(res, feedback, "Feedback erfolgreich abgefragt.");
    } catch (error) {
        sendError(res, "Fehler beim Abruf des Feedbacks.");
    }
});

/**
 * DELETE /feedback/:title
 * Löscht ein Feedback basierend auf dem übergebenen Titel.
 * 
 * @name DELETE/feedback/:title
 * @function
 * @memberof module:feedbackRouter
 * @param {Object} req - Das Anfrageobjekt mit dem zu löschenden Feedback-Titel als Parameter.
 * @param {Object} res - Das Antwortobjekt, um eine HTTP-Antwort an den Client zu senden.
 * @returns {JSON} Erfolgreiche Antwort oder Fehlermeldung, wenn das Feedback nicht gefunden wurde.
 */
feedbackRouter.delete('/feedback/:title', async (req, res) => {
    try {
        const { title } = req.params;

        const result = await deleteFeedbackByTitle(title);
        if (result.rowCount === 0) {
            return sendError(res, "Feedback nicht gefunden", 404);
        }
        sendSuccess(res, null, "Feedback erfolgreich gelöscht.");
    } catch (error) {
        sendError(res, "Fehler beim Löschen des Feedbacks.");
    }
});

export default feedbackRouter;
