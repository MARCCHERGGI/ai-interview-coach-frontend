import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";

const PaymentModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Use your Stripe publishable key from environment variables or replace with your test key
  const stripeKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_XXXXXXXXXXXXXXXXXXXX";

  // Callback when Stripe returns a token
  const onToken = async (token) => {
    setLoading(true);
    setError("");
    try {
      // Send token and payment details to your backend endpoint
      const response = await fetch("/processPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          // Amount is in cents (e.g., $9.99 for 50% off first month)
          amount: 999,
          description: "Premium Upgrade - 50% off first month",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Payment successful! Enjoy your premium features.");
        onClose();
      } else {
        throw new Error(data.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Payment processing error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-lg z-50 p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upgrade to Premium</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <p className="mb-4 text-gray-700">
          You have reached your free interview limit. Upgrade now to enjoy
          unlimited access and premium features.{" "}
          <span className="font-bold">50% off your first month!</span>
        </p>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <StripeCheckout
          token={onToken}
          stripeKey={stripeKey}
          amount={999} // Amount in cents: $9.99
          name="Premium Upgrade"
          description="50% off first month"
          currency="USD"
          // Optionally, pass user's email if available
          email="user@example.com"
        >
          <button
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            {loading ? "Processing..." : "Upgrade Now"}
          </button>
        </StripeCheckout>
      </div>
    </div>
  );
};

export default PaymentModal;
