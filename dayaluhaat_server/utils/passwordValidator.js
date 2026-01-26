/**
 * Validates password strength enforcement
 * Policy:
 * - Min length: 8 characters
 * - Uppercase letter (A-Z)
 * - Lowercase letter (a-z)
 * - Number (0-9)
 * - Special character (!@#$%^&*)
 * 
 * @param {string} password 
 * @returns {object} { isValid: boolean, message: string }
 */
exports.validatePassword = (password) => {
    if (password.length < 8) {
        return { isValid: false, message: "Password must be at least 8 characters long." };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one uppercase letter." };
    }
    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one lowercase letter." };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one number." };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one special character." };
    }

    return { isValid: true, message: "Password is strong." };
};
