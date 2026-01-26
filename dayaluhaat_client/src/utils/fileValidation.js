/**
 * File Validation Utility
 * Provides secure file upload validation with whitelist, null byte protection,
 * double extension prevention, file size limits, and MIME type validation
 */

// Whitelist of allowed extensions
const ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg'];
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

// File size limits (in bytes)
const MAX_PROFILE_PICTURE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates file for security threats
 * @param {File} file - The file to validate
 * @param {string} fileType - Type of file ('profile' or 'document')
 * @returns {Object} - { valid: boolean, error: string }
 */
export function validateFile(file, fileType = 'document') {
    // 1. Check if file exists
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    // 2. Check for null bytes in filename (null byte injection attack)
    if (file.name.includes('\0') || file.name.includes('%00')) {
        return {
            valid: false,
            error: 'Security Error: Invalid filename detected. Null bytes are not allowed.'
        };
    }

    // 3. Extract and validate extension
    const fileName = file.name.toLowerCase();
    const parts = fileName.split('.');

    // 4. Check for double extensions (e.g., image.jpg.php)
    if (parts.length > 2) {
        return {
            valid: false,
            error: 'Security Error: Multiple file extensions detected. Only single extension files are allowed.'
        };
    }

    if (parts.length < 2) {
        return { valid: false, error: 'File must have an extension' };
    }

    const extension = parts[parts.length - 1];

    // 5. Validate extension against whitelist
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
        return {
            valid: false,
            error: `Invalid file type. Only ${ALLOWED_IMAGE_EXTENSIONS.join(', ')} files are allowed`
        };
    }

    // 6. Validate MIME type (prevents renaming .exe to .jpg)
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: 'Security Error: File content does not match extension. Please upload a valid image file.'
        };
    }

    // 7. Validate file size
    const maxSize = fileType === 'profile' ? MAX_PROFILE_PICTURE_SIZE : MAX_DOCUMENT_SIZE;
    if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);
        return {
            valid: false,
            error: `File size exceeds ${maxSizeMB}MB limit`
        };
    }

    // 8. Additional security check: ensure file size is not 0
    if (file.size === 0) {
        return {
            valid: false,
            error: 'File is empty. Please select a valid file.'
        };
    }

    // All validations passed
    return { valid: true, error: null };
}

/**
 * Sanitizes filename by removing special characters
 * @param {string} filename - Original filename
 * @returns {string} - Sanitized filename
 */
export function sanitizeFilename(filename) {
    // Remove path traversal attempts
    filename = filename.replace(/\.\./g, '');
    filename = filename.replace(/\//g, '');
    filename = filename.replace(/\\/g, '');

    // Remove null bytes
    filename = filename.replace(/\0/g, '');
    filename = filename.replace(/%00/g, '');

    // Remove special characters except dot, dash, underscore
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    return filename;
}

/**
 * Gets human-readable file size
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
