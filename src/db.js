import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();


const { Pool } = pkg;

/**
 * Erstellt eine Verbindung zur PostgreSQL-Datenbank mit den Umgebungsvariablen.
 * 
 * @const {Pool} pool - Die Verbindungspool-Instanz, die für Abfragen genutzt wird.
 */
const pool = new Pool({
    user: process.env.DB_USER,       // Benutzername für die Datenbank
    host: process.env.DB_HOST,       // Hostname der Datenbank
    database: process.env.DB_NAME,   // Name der Datenbank
    password: process.env.DB_PASSWORD, // Passwort für die Datenbank
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
        require: false
    }        // Portnummer für die Datenbankverbindung
});

/**
 * Erstellt die "feedback"-Tabelle, falls sie nicht existiert.
 * 
 * Diese Funktion führt eine SQL-Abfrage aus, um eine Tabelle für Feedback-Einträge
 * in der Datenbank zu erstellen. Die Tabelle enthält eine `id`, `title` und `text`.
 * 
 * @async
 * @function createTable
 * @throws {Error} Wird ausgelöst, wenn die Abfrage zum Erstellen der Tabelle fehlschlägt.
 */
const createTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS feedback (
                id SERIAL PRIMARY KEY,        -- Primärschlüssel, automatisch inkrementiert
                title VARCHAR(255) NOT NULL,  -- Titel des Feedbacks (Pflichtfeld)
                text TEXT NOT NULL            -- Text des Feedbacks (Pflichtfeld)
            );
        `);
        console.log("Tabelle 'feedback' erfolgreich erstellt (falls nicht vorhanden).");
    } catch (error) {
        console.error('Fehler beim Erstellen der Tabelle: ', error);
    }
}

export { pool, createTable };
