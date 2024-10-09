/**
 * Sendet eine erfolgreiche JSON-Antwort.
 * 
 * @function sendSuccess
 * @param {Object} res - Das Antwortobjekt, um die HTTP-Antwort zu senden.
 * @param {Object|Array|null} data - Die Daten, die in der Antwort enthalten sind (kann ein Objekt, Array oder null sein).
 * @param {string} [message="Anfrage erfolgreich."] - Eine optionale Erfolgsnachricht.
 */
export const sendSuccess = (res, data, message = "Anfrage erfolgreich.", statusCode = 200) => {
    res.status(statusCode).json({ message, data });
};

/**
 * Sendet eine Fehlerantwort im JSON-Format.
 * 
 * @function sendError
 * @param {Object} res - Das Antwortobjekt, um die HTTP-Antwort zu senden.
 * @param {string} error - Die Fehlermeldung, die in der Antwort enthalten ist.
 * @param {number} [statusCode=500] - Der HTTP-Statuscode, der gesendet werden soll (Standard ist 500 für Serverfehler).
 */
export const sendError = (res, error, statusCode = 500) => {
    res.status(statusCode).json({ error });
};
