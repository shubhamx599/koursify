// server/utils/razorpay.js
const Razorpay = require("razorpay");

// Create Razorpay instance with your credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Test connection function (optional)
razorpay.testConnection = async () => {
  try {
    // Fetch payments to test connection
    const payments = await razorpay.payments.all({
      count: 1,
    });
    console.log("✅ Razorpay connection successful");
    return true;
  } catch (error) {
    console.error("❌ Razorpay connection failed:", error.message);
    return false;
  }
};

// Utility function to fetch payment details
razorpay.getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
};

// Utility function to fetch order details
razorpay.getOrderDetails = async (orderId) => {
  try {
    const order = await razorpay.orders.fetch(orderId);
    return order;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

// Utility function to create refund
razorpay.createRefund = async (paymentId, amount = null) => {
  try {
    const refundData = {
      payment_id: paymentId,
    };

    if (amount) {
      refundData.amount = amount;
    }

    const refund = await razorpay.refunds.create(refundData);
    return refund;
  } catch (error) {
    console.error("Error creating refund:", error);
    throw error;
  }
};

module.exports = razorpay;
