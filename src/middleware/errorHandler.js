/**
 * Middleware zur Behandlung von Fehlern in der Anwendung.
 * 
 * Diese Middleware fängt Fehler in der Anwendung ab, loggt den Fehler-Stack
 * und sendet eine 500-Fehlermeldung als JSON-Antwort zurück.
 * 
 * @function errorHandler
 * @param {Object} err - Das Fehlerobjekt, das den aufgetretenen Fehler enthält.
 * @param {Object} req - Das Anfrageobjekt, das Informationen zur HTTP-Anfrage enthält.
 * @param {Object} res - Das Antwortobjekt, um eine HTTP-Antwort an den Client zu senden.
 * @param {Function} next - Die nächste Middleware-Funktion im Stapel.
 */
export const errorHandler = (err, req, res, next) => {
    // Logge den Fehler-Stack zur Fehlerbehebung
    console.error(err.stack);

    // Sende eine 500-Fehlermeldung als JSON-Antwort zurück
    res.status(500).json({ error: "Internal Server Error" });
};
