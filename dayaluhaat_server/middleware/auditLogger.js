const logger = require('../utils/logger');

const auditLogger = (req, res, next) => {
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();

    // Listen for response finish to log status and duration
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        const userId = req.user ? req.user.id : 'Unauthenticated'; // Assumes req.user is set by auth middleware if present

        const logMessage = `${method} ${originalUrl} ${statusCode} ${duration}ms - IP: ${ip} - User: ${userId}`;

        if (statusCode >= 400) {
            logger.error(logMessage);
        } else {
            logger.info(logMessage);
        }
    });

    next();
};

module.exports = auditLogger;
