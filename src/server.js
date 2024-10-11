import express from 'express';
import cors from 'cors';
import feedbackRouter from './routes/feedbackRoutes.js';
import { createTable } from './db.js';
import dotenv from 'dotenv';
dotenv.config();



/**
 * Express-Anwendung zur Verwaltung von Feedback-Daten.
 * 
 * @const {Object} app - Die Express-Anwendung.
 */
const app = express();

/**
 * Der Port, auf dem der Server läuft.
 * 
 * @const {number} PORT - Der Port, auf dem die Anwendung lauscht.
 */
const PORT = 3000;

// Setup CORS (Cross-Origin Resource Sharing) für alle Anfragen
app.use(cors());

/**
 * Middleware zur Verarbeitung von JSON-Anfragen.
 * 
 * Diese Middleware ermöglicht es, JSON-Daten aus Anfragen zu verarbeiten.
 */
app.use(express.json());

/**
 * Erstellt die Feedback-Tabelle in der Datenbank, falls sie nicht existiert.
 * 
 * Dies wird beim Starten der Anwendung aufgerufen, um sicherzustellen,
 * dass die notwendige Tabelle in der Datenbank vorhanden ist.
 */
createTable();

/**
 * Bindet den Feedback-Router ein, um Feedback-bezogene API-Routen zu handhaben.
 * 
 * @name /
 * @function
 */
app.use('/', feedbackRouter); 

/**
 * Startet den Express-Server und lauscht auf dem definierten Port.
 * 
 * @function
 * @param {number} PORT - Der Port, auf dem der Server läuft.
 */
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
