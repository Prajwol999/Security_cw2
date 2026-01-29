/**
 * Formats a date object to a readable string (YYYY-MM-DD HH:mm:ss)
 * @param {Date} date 
 * @returns {string}
 */
exports.formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().replace('T', ' ').substring(0, 19);
};

/**
 * Formats a currency amount
 * @param {number} amount 
 * @returns {string}
 */
exports.formatCurrency = (amount) => {
    return new Intl.NumberFormat('ne-NP', { style: 'currency', currency: 'NPR' }).format(amount);
};
