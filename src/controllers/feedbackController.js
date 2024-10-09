import { pool } from '../db.js';  // Importiere den Datenbankpool aus der db.js-Datei

/**
 * Fügt ein neues Feedback in die Datenbank ein.
 * 
 * @async
 * @function addFeedback
 * @param {string} title - Der Titel des Feedbacks.
 * @param {string} text - Der Text des Feedbacks.
 * @returns {Object} Das hinzugefügte Feedback als Datenbankeintrag.
 * @throws {Error} Falls die Abfrage fehlschlägt.
 */
export const addFeedback = async (title, text) => {
    const query = `INSERT INTO feedback (title, text) VALUES ($1, $2) RETURNING *;`;
    
    // Führe die Abfrage aus und erhalte das Ergebnis
    const result = await pool.query(query, [title, text]);

    // Rückgabe des ersten Ergebnisses (der eingefügte Feedback-Eintrag)
    return result.rows[0];
};

/**
 * Ruft alle Feedbacks aus der Datenbank ab.
 * 
 * @async
 * @function getAllFeedback
 * @returns {Array} Eine Liste aller Feedback-Einträge aus der Datenbank.
 * @throws {Error} Falls die Abfrage fehlschlägt.
 */
export const getAllFeedback = async () => {
    const query = `SELECT * FROM feedback;`;
    
    // Führe die Abfrage aus und erhalte das Ergebnis
    const result = await pool.query(query);
    
    // Rückgabe aller Feedback-Einträge
    return result.rows;
};

/**
 * Löscht ein Feedback aus der Datenbank basierend auf dem Titel.
 * 
 * @async
 * @function deleteFeedbackByTitle
 * @param {string} title - Der Titel des zu löschenden Feedbacks.
 * @returns {Object} Der gelöschte Feedback-Eintrag (falls vorhanden) oder null.
 * @throws {Error} Falls die Abfrage fehlschlägt.
 */
export const deleteFeedbackByTitle = async (title) => {
    const query = `DELETE FROM feedback WHERE title = $1 RETURNING *;`;
    
    // Führe die Abfrage aus und erhalte das Ergebnis
    const result = await pool.query(query, [title]);
    
    // Rückgabe des gelöschten Feedback-Eintrags oder null
    return result;
};
