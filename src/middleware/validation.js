import { body, validationResult } from 'express-validator';

/**
 * Middleware zur Validierung von Feedback-Daten.
 * 
 * Diese Middleware prüft, ob die Felder 'title' und 'text' in der Anfrage vorhanden und nicht leer sind.
 * Wenn die Validierung fehlschlägt, wird eine 400-Fehlermeldung mit den Validierungsfehlern zurückgegeben.
 * 
 * @function feedbackValidation
 * @param {Object} req - Das Anfrageobjekt, das die HTTP-Anfrage-Daten enthält.
 * @param {Object} res - Das Antwortobjekt, um die HTTP-Antwort an den Client zu senden.
 * @param {Function} next - Die nächste Middleware-Funktion im Stapel.
 */
export const feedbackValidation = [
    // Validierung für das 'title'-Feld: Es darf nicht leer sein
    body('title').notEmpty().withMessage("Titel ist erforderlich."),
    
    // Validierung für das 'text'-Feld: Es darf nicht leer sein
    body('text').notEmpty().withMessage("Text ist erforderlich."),
    
    // Middleware zur Überprüfung der Validierungsergebnisse
    (req, res, next) => {
        const errors = validationResult(req);
        
        // Wenn Fehler vorhanden sind, sende eine 400-Antwort mit den Fehlern
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Wenn keine Fehler vorhanden sind, gehe zur nächsten Middleware oder Route-Handler
        next();
    }
];
