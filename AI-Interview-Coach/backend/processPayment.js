// /backend/processPayment.js

/**
 * This file handles premium account upgrades using Stripe Payments.
 * It processes one-time payments for upgrading to unlimited interviews.
 *
 * It uses Stripe's Charges API to create a charge based on the payment token,
 * amount (in cents), and a description provided in the request body.
 *
 * Environment variables:
 *   - STRIPE_SECRET_KEY: Your Stripe secret API key (loaded from .env)
 */

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

/**
 * Express route handler for processing a payment.
 * Expects the following in req.body:
 *   - token: An object containing the Stripe payment token (with token.id)
 *   - amount: The charge amount in cents (e.g., 999 for $9.99)
 *   - description: A description for the charge (e.g., "Premium Upgrade - 50% off first month")
 */
const processPayment = async (req, res) => {
  try {
    const { token, amount, description } = req.body;

    // Validate request payload
    if (!token || !token.id || !amount) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required payment details: token and amount are required.",
      });
    }

    // Create a charge using Stripe's Charges API
    const charge = await stripe.charges.create({
      amount: amount,
      currency: "usd",
      description: description || "Premium Upgrade Payment",
      source: token.id,
    });

    // Here you might also update the user's account status in your database
    // to reflect their premium upgrade.

    res.status(200).json({ success: true, charge });
  } catch (error) {
    console.error("Stripe Payment Error:", error);

    // Handle specific Stripe errors if available
    const errorMessage =
      error.raw && error.raw.message ? error.raw.message : error.message;
    res.status(500).json({
      success: false,
      message: `Payment processing failed: ${errorMessage}`,
    });
  }
};

module.exports = processPayment;
