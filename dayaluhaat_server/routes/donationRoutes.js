const express = require('express');
const axios = require('axios');
const router = express.Router();
const Donation = require('../model/Donation');
const Request = require('../model/Request');
const { sendNotificationToUser } = require('../services/notificationServices');
const { sendMail } = require('../services/emailService');
const donationController = require('../controller/donationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/khalti-payment-initiate', async (req, res) => {
  console.log("hi");
  try {
    const {
      return_url,
      website_url,
      amount,
      purchase_order_id,
      purchase_order_name,
      customer_info
    } = req.body;

    const response = await axios.post(
      'https://dev.khalti.com/api/v2/epayment/initiate/',
      {
        return_url,
        website_url,
        amount,
        purchase_order_id,
        purchase_order_name,
        customer_info
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Khalti API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Khalti payment initiation failed." });
  }
});

// --- eSewa Payment Integration ---
const crypto = require('crypto');

router.post('/esewa-payment-initiate', async (req, res) => {
  try {
    const { amount, purchase_order_id } = req.body;

    // eSewa Config
    const merchantId = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
    const secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
    const successUrl = `${req.body.website_url}/donation/success?q=esewa`;
    const failureUrl = `${req.body.website_url}/donation/failure`;

    // Signature Generation (HMAC-SHA256)
    // Message format: total_amount,transaction_uuid,product_code
    const signatureString = `total_amount=${amount},transaction_uuid=${purchase_order_id},product_code=${merchantId}`;
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(signatureString)
      .digest('base64');

    const paymentData = {
      amount: amount,
      failure_url: failureUrl,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: merchantId,
      signature: signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: successUrl,
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: purchase_order_id,
    };

    const paymentUrl = process.env.ESEWA_PAYMENT_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    res.status(200).json({
      payment_url: paymentUrl,
      params: paymentData
    });

  } catch (error) {
    console.error("eSewa Error:", error);
    res.status(500).json({ error: "eSewa payment initiation failed." });
  }
});



// Admin: List donations
router.get('/admin/list', authMiddleware.authorizeToken, authMiddleware.requireAdmin, donationController.listDonations);
// Admin: Export donations as CSV
router.get('/admin/export', authMiddleware.authorizeToken, authMiddleware.requireAdmin, donationController.exportDonations);

module.exports = router;