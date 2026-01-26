const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // 5 attempts
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 10 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Store rate limit info in req.rateLimit
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json(options.message);
    }
});

const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // 3 attempts
    message: {
        success: false,
        message: 'Too many invalid OTP attempts. Please try again after 10 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authLimiter, loginLimiter, otpLimiter };