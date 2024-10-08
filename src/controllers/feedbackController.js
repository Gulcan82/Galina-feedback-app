import { pool } from './db.js';  // Importiere den Datenbankpool aus der db.js-Datei


// fuegt neues Feedback hinzu
export const  addFeedback = async (title, text) => {
    const query = `INSERT INTO feedback (title, text) VALUES ($1, $2) RETURNING *;`;
    await pool.query(query, [title, text]);  // Führe die Abfrage mit den übergebenen Werten aus
    const result = await pool.query(query, [title, text]);

    return result.rows[0];

}

export const getAllFeedback = async () => {
    const query = `SELECT * FROM feedback;`;
    const result = await pool.query(query);  // Führe die Abfrage aus und erhalte das Ergebnis

    return result.rows;
}

export const deleteFeedbackByTitle = async (title) => {
    const query = `DELETE FROM feedback WHERE title = $1 RETURNING *;`;
    const result = await pool.query(query, [title]);
    return result;

}