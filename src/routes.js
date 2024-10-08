import express from 'express';  // Importiere das Express-Framework
import { pool } from './db.js';  // Importiere den Datenbankpool aus der db.js-Datei

// Erstelle einen neuen Router für Feedback-bezogene Routen
const feedbackRouter = express.Router();

// POST-Endpunkt zum Erstellen eines neuen Feedbacks
feedbackRouter.post('/feedback', async (req, res) => {
    try {
        const { title, text } = req.body;  // Extrahiere 'title' und 'text' aus dem Anfrage-Body

        // Überprüfe, ob die erforderlichen Felder vorhanden sind
        if (!title || !text) {
            return res.status(400).json({ message: "title und text sind im body erforderlich." });
        }

        // SQL-Abfrage zum Einfügen eines neuen Feedback-Eintrags
        const query = `INSERT INTO feedback (title, text) VALUES ($1, $2);`;
        await pool.query(query, [title, text]);  // Führe die Abfrage mit den übergebenen Werten aus

        // Sende eine Erfolgsantwort, wenn das Feedback erfolgreich gespeichert wurde
        res.status(201).json({ message: "Toll!!! Feedback erfolgreich gespeichert." });
    } catch (error) {
        // Fehlerbehandlung und Loggen des Fehlers auf der Konsole
        console.error("Fehler beim Speichern des Feedbacks: " + error);
        res.status(500).json({ message: "Fehler beim Speichern des Feedbacks." });
    }
});

// GET-Endpunkt zum Abrufen aller Feedbacks
feedbackRouter.get('/feedback', async (req, res) => {
    try {
        // SQL-Abfrage, um alle Feedbacks aus der Datenbank abzurufen
        const query = `SELECT * FROM feedback;`;
        const result = await pool.query(query);  // Führe die Abfrage aus und erhalte das Ergebnis

        // Sende das Ergebnis als JSON-Antwort
        res.status(200).json(result.rows);
    } catch (error) {
        // Fehlerbehandlung und Loggen des Fehlers auf der Konsole
        console.error("Fehler beim Abrufen des Feedbacks: " + error);
        res.status(500).json({ message: "Fehler beim Abrufen des Feedbacks." });
    }
});

// DELETE-Endpunkt zum Löschen eines Feedbacks anhand des Titels
feedbackRouter.delete('/feedback/:title', async (req, res) => {
    try {
        const { title } = req.params;  // Extrahiere den 'title'-Parameter aus der URL

        // SQL-Abfrage, um ein Feedback anhand des Titels zu löschen
        const query = `DELETE FROM feedback WHERE title = $1;`;
        const result = await pool.query(query, [title]);  // Führe die Abfrage mit dem Titel aus

        // Überprüfe, ob das Feedback tatsächlich gelöscht wurde (wenn nicht gefunden, 404 zurückgeben)
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Feedback nicht gefunden." });
        }

        // Sende eine Erfolgsantwort, wenn das Feedback erfolgreich gelöscht wurde
        res.status(200).json({ message: "Feedback erfolgreich geloescht." });
    } catch (error) {
        // Fehlerbehandlung und Loggen des Fehlers auf der Konsole
        console.error("Fehler beim Loeschen des Feedbacks: " + error);
        res.status(500).json({ message: "Fehler beim Loeschen des Feedbacks." });
    }
});

export default feedbackRouter;  // Exportiere den Router, damit er in anderen Teilen der Anwendung verwendet werden kann
