const axios = require('axios');

const verifyRecaptcha = async (req, res, next) => {
    const recaptchaToken = req.body['g-recaptcha-response'];
    console.log("Received Token (Type):", typeof recaptchaToken);
    console.log("Received Token (Length):", recaptchaToken ? recaptchaToken.length : 0);
    console.log("Received Token (Value requires review):", recaptchaToken);

    if (!recaptchaToken) {
        return res.status(400).json({ success: false, message: 'reCAPTCHA token is required.' });
    }

    try {
        // Hardcode test key to rule out env issues completely
        const secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFujjJ4saVP66';

        console.log("Debug - Using Hardcoded Secret Key");

        // Use URLSearchParams - Axios automatically sets Content-Type
        const formData = new URLSearchParams();
        formData.append('secret', secretKey);
        formData.append('response', recaptchaToken);

        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            formData
        );

        console.log("Google reCAPTCHA API Response:", JSON.stringify(response.data, null, 2));

        if (response.data.success) {
            next();
        } else {
            console.error("reCAPTCHA Verification Failed. Error Codes:", response.data['error-codes']);
            return res.status(400).json({
                success: false,
                message: 'Failed reCAPTCHA verification.',
                'error-codes': response.data['error-codes'] || []
            });
        }
    } catch (error) {
        console.error('reCAPTCHA verification error:', error.message);
        if (error.response) {
            console.error('reCAPTCHA error response:', error.response.data);
        }
        return res.status(500).json({ success: false, message: 'Server error during reCAPTCHA verification.' });
    }
};

module.exports = verifyRecaptcha;