// index.js (Modified)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const path = require("path");
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');
const adminUserRoute = require("./routes/admin/adminUserRoutes");
const cors = require('cors');
const requestRoutes = require("./routes/requestRoute");
const adminRoute = require("./routes/admin/adminRoute");
const chatRoutes = require('./routes/chatRoutes'); // Adjust path

const uploadRoutes = require('./routes/uploadRoutes')
const notificationRoutes = require('./routes/notificationRoutes');

const socketAuthMiddleware = require('./middleware/socketAuthMiddleware');
const socketController = require('./controller/socketController');
const notificationService = require('./services/notificationServices');
const publicCampaignsRoute = require('./routes/publicCampaigns');
const donationRoutes = require('./routes/donationRoutes');
// const xss = require('xss-clean'); // Disabled
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const auditLogger = require('./middleware/auditLogger');

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ['GET', 'POST', 'PUT']
    }
});

notificationService.setIoInstance(io);

connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(auditLogger);

// Security Middlewares
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "http://localhost:5173", "http://127.0.0.1:5173"]
        }
    }
}));
// Custom XSS Sanitization Middleware (Replaces xss-clean)
const xss = require('xss');
const sanitizeHtml = (req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key]);
            }
        }
    }
    next();
};
app.use(sanitizeHtml);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", userRoute);
app.use("/api/request", requestRoutes);
app.use("/api/auth/admin", adminRoute);
app.use("/api/admin/user", adminUserRoute);
app.use('/api/chat', chatRoutes);
app.use('/api', uploadRoutes);
app.use('/api/campaigns', publicCampaignsRoute);
app.use('/api/donations', donationRoutes);
app.use('/api/notifications', notificationRoutes);


app.get('/', (req, res) => {
    return res.status(200).json({ message: "Server is running", success: true });
});

// Global Error Handler (Must be the last middleware)
app.use((err, req, res, next) => {
    console.error("Global Error:", err.message);

    // Double Extension Attack
    if (err.message === 'Double extension found') {
        return res.status(400).json({
            success: false,
            message: "Double extension found"
        });
    }

    // MIME Type Spoofing
    if (err.message === 'Invalid MIME type detected') {
        return res.status(400).json({
            success: false,
            message: "Invalid MIME type detected"
        });
    }

    // Invalid File Type
    if (err.message === 'Only .png, .jpg and .jpeg format allowed!') {
        return res.status(400).json({ success: false, message: err.message });
    }

    // File Too Large
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: "File too large. Max limit is 5MB." });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Attach Socket.IO middleware
io.use(socketAuthMiddleware);

// WebSocket event handlers
socketController(io);

module.exports = { app, server };