import DOMPurify from 'dompurify';

/**
 * Sanitizes an HTML string using DOMPurify to prevent XSS attacks.
 * @param {string} dirty - The raw HTML string to sanitize.
 * @returns {string} - The sanitized HTML string.
 */
export const sanitizeHtml = (dirty) => {
    return DOMPurify.sanitize(dirty);
};

/**
 * Safer replacement for dangerouslySetInnerHTML
 * Usage: <div {...sanitize(rawHtml)} />
 */
export const sanitize = (dirty) => ({
    dangerouslySetInnerHTML: {
        __html: sanitizeHtml(dirty)
    }
});
