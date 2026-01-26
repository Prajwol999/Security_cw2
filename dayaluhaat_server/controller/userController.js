const User = require("../model/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const { validatePassword } = require("../utils/passwordValidator");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


// Create user (register)
// Create user (register)
exports.registerUser = async (req, res) => {
    const { name, email, disease, description, contact, password } = req.body;
    try {
        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ success: false, message: passwordValidation.message });
        }

        const existingEmail = await User.findOne({
            email: email
        });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        const existingContact = await User.findOne({
            contact: contact
        });
        if (existingContact) {
            return res.status(400).json({ success: false, message: "User with this contact already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            disease,
            description,
            contact,
            password: hashedPassword, // store hashed password
            passwordHistory: [hashedPassword] // Initialize history with first password
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "User registered", data: newUser });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("Backend: Login attempt for email:", email); // Added
    try {
        const user = await User.findOne({ email: email });
        console.log("Backend: User found (or null):", user); // Added

        if (!user) {
            console.log("Backend: User not found for email:", email); // Added
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Backend: Password match result:", isMatch); // Added
        if (!isMatch) {
            console.log("Backend: Invalid credentials for user:", email); // Added

            // Calculate remaining attempts if rate limiter is active
            let attemptsMessage = "Invalid credentials";
            if (req.rateLimit) {
                const attemptsLeft = req.rateLimit.limit - req.rateLimit.current;
                if (attemptsLeft > 0) {
                    attemptsMessage += `. ${attemptsLeft} attempts remaining before 10 min ban.`;
                }
            }

            return res.status(401).json({ success: false, message: attemptsMessage });
        }

        // --- FIX: Include user.name/user.email in JWT payload for display on backend ---
        // 2FA Check
        if (user.isTwoFactorEnabled) {
            // Generate 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.twoFactorOTP = otp;
            user.twoFactorOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

            await user.save();

            // Check for email credentials
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.error("Backend: Missing EMAIL_USER or EMAIL_PASS environment variables.");
                return res.status(500).json({ success: false, message: "2FA service not configured properly (Missing Email Credentials)." });
            }

            // Send OTP Email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Your 2FA Login Code - Raktadan',
                text: `Your login verification code is: ${otp}. It expires in 10 minutes.`
            });

            return res.status(200).json({
                success: true,
                require2FA: true,
                message: 'OTP sent to your email',
                email: user.email
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        console.log("Backend: Generated JWT token (first few chars):", token.substring(0, 50) + "..."); // Added, for security don't log full token

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                contact: user.contact,
                email: user.email,
                role: user.role, // Added role
                isTwoFactorEnabled: user.isTwoFactorEnabled
            }
        });
        console.log("Backend: User data sent in response:", {
            id: user._id,
            name: user.name,
            contact: user.contact,
            email: user.email
        }); // Added

    } catch (error) {
        console.error("Backend: Server error during login:", error); // Changed to error, Added
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Get all approved users (for donor dashboard)
exports.getApprovedUser = async (req, res) => {
    const users = await find({ isApproved: true });
    res.status(200).json({ success: true, data: users });
}

// Admin: Approve user
exports.approveUser = async (req, res) => {
    const user = await findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.isApproved = true;
    await user.save();
    res.json({ success: true, message: "User approved" });
}

// ✅ NEW: Google OAuth Login
exports.googleLogin = async (req, res) => {
    const { token } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '381818830866-smf0ps7geage5ib54sdavnookdqnlgcq.apps.googleusercontent.com');

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID || '381818830866-smf0ps7geage5ib54sdavnookdqnlgcq.apps.googleusercontent.com',
        });
        const { email, name, picture } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            user = new User({
                name,
                email,
                photoUrl: picture,
                password: crypto.randomBytes(16).toString('hex'), // Random password for OAuth users
                role: 'user', // Default role
                description: 'Joined via Google',
                contact: '', // Optional
                disease: 'None' // Default
            });
            await user.save();
        }

        // Generate Token
        const jwtToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: 'Google Login Successful',
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                photoUrl: user.photoUrl,
                role: user.role,
                isTwoFactorEnabled: user.isTwoFactorEnabled
            }
        });

    } catch (error) {
        console.error("Google verify error:", error);
        res.status(401).json({ success: false, message: 'Invalid Google Token' });
    }
};
// Admin: Delete user
exports.deleteUser = async (req, res) => {
    await findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
}
exports.getMe = async (req, res) => {
    try {
        // req.user.id is added by the authorizeToken middleware
        const user = await User.findById(req.user.id).select('-password'); // '-password' excludes the password from the result

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });

    } catch (error) {
        console.error("Error in getMe controller:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.updateMe = async (req, res) => {
    // Add photoUrl to destructure
    const { name, description, contact, disease, photoUrl } = req.body;

    try {
        // Add photoUrl to update object
        const updateData = { name, description, contact, disease };

        // Handle file upload if present
        if (req.file) {
            updateData.photoUrl = `/uploads/profiles/${req.file.filename}`;
        } else if (photoUrl) {
            updateData.photoUrl = photoUrl;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Profile updated successfully!', data: user });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ success: false, message: `An account with this ${field} already exists.` });
        }
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: 'Server error while updating profile' });
    }
};
// ✅ NEW FUNCTION: Change User Password
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // Find user and get their password hash
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect current password' });
        }

        // 1. Validate Password Strength
        const { isValid, message } = validatePassword(newPassword); // Ensure validatePassword is imported
        if (!isValid) {
            return res.status(400).json({ success: false, message });
        }

        // 2. Check Password History (Prevent reuse of last 3 passwords)
        let isReused = false;
        for (const oldHash of user.passwordHistory || []) {
            const match = await bcrypt.compare(newPassword, oldHash.password);
            if (match) {
                isReused = true;
                break;
            }
        }

        if (isReused) {
            return res.status(400).json({
                success: false,
                message: "You cannot reuse any of your last 3 passwords."
            });
        }

        // 3. Update Password History
        if (!user.passwordHistory) user.passwordHistory = [];
        user.passwordHistory.push({ password: user.password, changedAt: Date.now() });

        // Keep only last 3 passwords
        if (user.passwordHistory.length > 3) {
            user.passwordHistory.shift();
        }

        // Hash the new password and save it
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ success: true, message: 'Password changed successfully' });

    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ success: false, message: 'Server error while changing password' });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    let user;

    try {
        user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Hash and store token
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set expiry (1 hour)
        user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

        await user.save();

        // Create reset URL
        // In local dev: http://localhost:5173/reset-password/:token
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const message = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset for your रक्तदान account.</p>
            <p>Please click the link below to reset your password:</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            <p>If you did not make this request, please ignore this email.</p>
        `;
        // Send Email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: "रक्तदान <noreply@raktadan.com>",
            to: user.email,
            subject: "Password Reset Request",
            html: message,
        });

        res.status(200).json({ success: true, message: "Email sent" });

    } catch (error) {
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
        console.error("Forgot Password Error:", error);
        res.status(500).json({ success: false, message: "Email could not be sent" });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    // Get token from URL params
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const { password } = req.body;

        // Validate new password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ success: false, message: passwordValidation.message });
        }

        // Check password history (reuse check)
        // Check if new password matches any of the last 3 passwords
        // user.passwordHistory is an array of hashes
        if (user.passwordHistory && user.passwordHistory.length > 0) {
            for (let i = 0; i < user.passwordHistory.length; i++) {
                const isMatch = await bcrypt.compare(password, user.passwordHistory[i]);
                if (isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "For security, you cannot reuse any of your last 3 passwords."
                    });
                }
            }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        user.password = hashedPassword;

        // Update history
        if (!user.passwordHistory) user.passwordHistory = [];
        user.passwordHistory.push(hashedPassword);

        // Keep only last 3
        if (user.passwordHistory.length > 3) {
            user.passwordHistory.shift(); // Remove oldest
        }

        // Clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.socialLogin = async (req, res) => {
    const { provider, token } = req.body;
    let email, name;
    try {
        if (provider === 'google') {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
        } else if (provider === 'facebook') {
            const fbRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
            const fbData = await fbRes.json();
            email = fbData.email;
            name = fbData.name;
        } else {
            return res.status(400).json({ error: 'Unsupported provider' });
        }
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, name });
            await user.save();
        }
        const appToken = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token: appToken, user });
    } catch (err) {
        res.status(401).json({ error: 'Invalid social login' });
    }
};

//  NEW: Verify 2FA OTP
exports.verify2FA = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.twoFactorOTP || !user.twoFactorOTPExpires) {
            return res.status(400).json({ success: false, message: 'No OTP request found. Please login again.' });
        }

        if (user.twoFactorOTP !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (Date.now() > user.twoFactorOTPExpires) {
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }

        // OTP Valid
        user.twoFactorOTP = undefined;
        user.twoFactorOTPExpires = undefined;
        await user.save();

        const token = jwt.sign(
            {
                id: user._id,
                role: 'user',
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: '2FA Verification Successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                name: user.name,
                contact: user.contact,
                email: user.email,
                role: user.role, // Added role
                isTwoFactorEnabled: user.isTwoFactorEnabled
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

//  NEW: Toggle 2FA
exports.toggle2FA = async (req, res) => {
    const { enable } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.isTwoFactorEnabled = enable;
        await user.save();

        res.status(200).json({
            success: true,
            message: `Two-Factor Authentication ${enable ? 'enabled' : 'disabled'}`,
            isTwoFactorEnabled: user.isTwoFactorEnabled
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ## AUDIT LOG VIEWER (ADMIN ONLY) ##
exports.getAuditLogs = async (req, res) => {
    try {
        const logsDir = path.join(__dirname, '..', 'logs');

        if (!fs.existsSync(logsDir)) {
            return res.status(200).json({ success: true, logs: [] });
        }

        // Find the most recent 'application-YYYY-MM-DD.log' file
        const files = fs.readdirSync(logsDir)
            .filter(file => file.startsWith('application-') && file.endsWith('.log'))
            .sort()
            .reverse(); // Newest first

        if (files.length === 0) {
            return res.status(200).json({ success: true, logs: [] });
        }

        const latestLogFile = files[0];
        const filePath = path.join(logsDir, latestLogFile);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Parse line-by-line using safe split for Windows/Unix
        const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');

        const logs = lines.map(line => {
            const parts = line.match(/^\[(.*?)\] \[(.*?)\]: (.*?) (.*?) (\d{3}) (.*?) - IP: (.*?) - User: (.*)$/);
            if (parts) {
                return {
                    timestamp: parts[1],
                    level: parts[2],
                    method: parts[3],
                    url: parts[4],
                    status: parseInt(parts[5]),
                    duration: parts[6],
                    ip: parts[7],
                    user: parts[8]
                };
            }
            // Fallback for unparseable lines
            return {
                timestamp: 'N/A',
                level: 'INFO',
                method: 'RAW',
                url: line.substring(0, 50) + '...',
                status: 0,
                duration: '-',
                ip: '-',
                user: 'System/Unknown'
            };
        })
            .reverse(); // Show newest logs at top

        res.status(200).json({
            success: true,
            logs
        });

    } catch (error) {
        console.error("Error fetching audit logs:", error);
        res.status(500).json({ success: false, message: "Failed to fetch logs" });
    }
};

