// server/Routes/purchaseCourseRoute.js
const express = require('express');
const {isAuthenticated} = require("../MIddlewares/isAuthenticated.js");
const { 
  createRazorpayOrder, 
  verifyRazorpayPayment, 
  getCourseDetail, 
  getAllPurchaseCourse, 
  getAdminCreatedAndPurchasedCourses 
} = require("../Controllers/purchaseController.js");

const router = express.Router();

// Razorpay Routes
router.post("/create-razorpay-order", isAuthenticated, createRazorpayOrder);
router.post("/verify-razorpay-payment", isAuthenticated, verifyRazorpayPayment);

// Other Routes (Unchanged)
router.get("/course/:courseId/course-status", isAuthenticated, getCourseDetail);
router.get("/get-all-purchase-course", isAuthenticated, getAllPurchaseCourse);
router.get("/get-purchase-course-admin", isAuthenticated, getAdminCreatedAndPurchasedCourses);

module.exports = router;