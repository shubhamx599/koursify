// server/Controllers/purchaseController.js
const razorpay = require("../utils/razorpay");
const Course = require("../Modles/Course.js");
const CoursePurchase = require("../Modles/coursePurchased.js");
const User = require("../Modles/userModel.js");
const Lecture = require("../Modles/lecture.js");
const coursePurchased = require("../Modles/coursePurchased.js");

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.tokenId;
    const { courseId } = req.body;

    // Fetch the course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    // Create the purchase record in the database
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // ✅ FIXED: Shorter receipt ID (under 40 characters)
    const receiptId = `rcpt${Date.now()}`;

    // Create Razorpay Order
    const options = {
      amount: course.coursePrice * 100, // Amount in paise
      currency: "INR",
      receipt: receiptId, // ✅ Now under 40 characters
      notes: {
        courseId: courseId,
        userId: userId,
        courseTitle: course.courseTitle,
      },
    };

    const order = await razorpay.orders.create(options);

    // Save the purchase record with Razorpay order ID
    newPurchase.paymentId = order.id;
    await newPurchase.save();

    // Respond with Razorpay order details
    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

// Verify Razorpay Payment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;
    const userId = req.tokenId;

    // Verify payment signature
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment successful

      // Find and update purchase record
      const purchase = await CoursePurchase.findOne({
        paymentId: razorpay_order_id,
        userId: userId,
        courseId: courseId,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({
          message: "Purchase record not found",
          success: false,
        });
      }

      // Update purchase details
      purchase.status = "completed";
      purchase.paymentId = razorpay_payment_id; // Store final payment ID
      await purchase.save();

      // Make all lectures visible by setting `isPreviewFree` to true
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: userId } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
      });
    } else {
      // Payment verification failed
      const purchase = await CoursePurchase.findOne({
        paymentId: razorpay_order_id,
      });

      if (purchase) {
        purchase.status = "failed";
        await purchase.save();
      }

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

// Get Course Details
const getCourseDetail = async (req, res) => {
  try {
    console.log("Received request to fetch course details");

    const { courseId } = req.params;
    const userId = req.tokenId;

    console.log(
      `Fetching course details for courseId: ${courseId} and userId: ${userId}`
    );

    // Fetch course details with creator and lectures populated
    const course = await Course.findById(courseId)
      .populate({
        path: "creator",
      })
      .populate({
        path: "lectures",
      });

    console.log("Course fetched:", course);

    // Fetch purchase details
    const purchase = await coursePurchased.findOne({ userId, courseId });
    console.log("Purchase details:", purchase);

    // If course is not found, return 404
    if (!course) {
      console.log("Course not found");
      return res.status(404).json({
        message: "course not found",
        success: false,
      });
    }

    // Return course details along with purchase status
    console.log("Sending course details response");
    return res.status(200).json({
      course,
      purchased: !!purchase, // Convert to boolean
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({
      message: "Failed to fetch",
      success: false,
    });
  }
};

// Get All Purchased Courses
const getAllPurchaseCourse = async (req, res) => {
  try {
    const purchaseCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    if (!purchaseCourse) {
      return res.status(404).json({
        message: "Nothing purchased yet",
        success: false,
        purchaseCourse: [],
      });
    }
    return res.status(200).json({
      message: "found courses",
      purchaseCourse,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get Admin Created and Purchased Courses
const getAdminCreatedAndPurchasedCourses = async (req, res) => {
  try {
    const adminId = req.tokenId;
    console.log("Admin ID from token: ", adminId);

    // First, get courses created by the admin
    const adminCourses = await Course.find({ creator: adminId });
    console.log(`Found ${adminCourses.length} courses created by admin.`);

    if (adminCourses.length === 0) {
      console.log("No courses found for this admin.");
    }

    // Get the courseIds of admin-created courses
    const adminCourseIds = adminCourses.map((course) => course._id);
    console.log("Admin course IDs: ", adminCourseIds);

    // Then, find the purchases where the courseId is from admin-created courses
    const purchasedCourses = await CoursePurchase.find({
      courseId: { $in: adminCourseIds },
      status: "completed",
    })
      .populate("courseId")
      .populate("userId");

    console.log(`Found ${purchasedCourses.length} purchased courses.`);

    if (purchasedCourses.length === 0) {
      console.log("No purchases found for admin-created courses.");
    }

    return res.status(200).json({
      message: "found",
      success: true,
      purchasedCourses,
    });
  } catch (error) {
    console.error("Error fetching admin-created and purchased courses:", error);
    return res.status(500).json({
      message: "Error fetching purchased courses",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getAdminCreatedAndPurchasedCourses,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getCourseDetail,
  getAllPurchaseCourse,
};
