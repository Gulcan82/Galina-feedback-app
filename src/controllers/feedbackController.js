import { pool } from '../db.js';  // Importiere den Datenbankpool aus der db.js-Datei
import { addFeedback, getAllFeedback, deleteFeedbackByTitle } from '../src/controllers/feedbackController';


export const getAllFeedback = async () => {
    // Your existing logic
};



export const deleteFeedbackByTitle = async (title) => {
    try {
        const query = `DELETE FROM feedback WHERE title = $1 RETURNING *;`;
        const result = await pool.query(query, [title]);

        if (result.rowCount === 0) {
            return { message: 'Feedback not found', status: 404 };  // Explicitly return the message and status
        }
        return { message: 'Feedback deleted successfully.', status: 200, data: result.rows[0] };
    } catch (error) {
        throw new Error('Error deleting feedback');
    }
};

export const addFeedback = async (title, text) => {
    try {
        const query = `INSERT INTO feedback (title, text) VALUES ($1, $2) RETURNING *;`;
        const result = await pool.query(query, [title, text]);

        return result.rows[0];  // Return the inserted feedback
    } catch (error) {
        throw new Error('Internal Server Error');
    }
};


