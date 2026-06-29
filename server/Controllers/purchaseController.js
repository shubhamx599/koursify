const razorpay = require("../utils/razorpay");
const prisma = require("../Config/prisma.js");
const crypto = require("crypto");

const mapCourse = (c) => {
  if (!c) return null;
  return {
    ...c,
    _id: c.id,
    creator: c.creator ? { ...c.creator, _id: c.creator.id } : null,
    lectures: c.lectures ? c.lectures.map(l => ({ ...l, _id: l.id })) : []
  };
};

const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.body;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }
    if (!course.isPublished || !Number.isFinite(course.coursePrice) || course.coursePrice < 0) {
      return res.status(400).json({
        message: "This course is not currently available for purchase",
        success: false,
      });
    }

    const completedPurchase = await prisma.coursePurchase.findFirst({
      where: {
        courseId,
        userId,
        status: "completed",
      }
    });
    if (completedPurchase) {
      return res.status(409).json({
        message: "You already own this course",
        success: false,
      });
    }

    const receiptId = `rcpt${Date.now()}`;

    const options = {
      amount: Math.round(course.coursePrice * 100),
      currency: "INR",
      receipt: receiptId,
      notes: {
        courseId: courseId,
        userId: userId,
        courseTitle: course.courseTitle,
      },
    };

    const order = await razorpay.orders.create(options);

    await prisma.coursePurchase.create({
      data: {
        courseId,
        userId,
        amount: course.coursePrice,
        status: "pending",
        orderId: order.id,
      }
    });

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

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;
    const userId = req.userId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature);
    const providedBuffer = Buffer.from(razorpay_signature || "");
    const signatureIsValid =
      expectedBuffer.length === providedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, providedBuffer);

    if (signatureIsValid) {
      const purchase = await prisma.coursePurchase.findFirst({
        where: {
          OR: [
            { orderId: razorpay_order_id },
            { paymentId: razorpay_order_id },
          ],
          userId,
          courseId,
        }
      });

      if (!purchase) {
        return res.status(404).json({
          message: "Purchase record not found",
          success: false,
        });
      }

      await prisma.$transaction([
        prisma.coursePurchase.update({
          where: { id: purchase.id },
          data: {
            status: "completed",
            paymentId: razorpay_payment_id
          }
        }),
        prisma.user.update({
          where: { id: userId },
          data: {
            enrolledCourses: {
              connect: { id: courseId }
            }
          }
        })
      ]);

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
      });
    } else {
      const purchase = await prisma.coursePurchase.findFirst({
        where: {
          OR: [
            { orderId: razorpay_order_id },
            { paymentId: razorpay_order_id },
          ],
          userId,
          courseId,
        }
      });

      if (purchase) {
        await prisma.coursePurchase.update({
          where: { id: purchase.id },
          data: { status: "failed" }
        });
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

const getCourseDetail = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        creator: {
          select: { id: true, name: true, email: true, photoUrl: true }
        },
        lectures: true
      }
    });

    if (!course || !course.isPublished) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    const purchase = await prisma.coursePurchase.findFirst({
      where: {
        userId,
        courseId,
        status: "completed",
      }
    });
    const purchased = Boolean(purchase);
    const safeCourse = mapCourse(course);

    if (!purchased) {
      safeCourse.lectures = safeCourse.lectures.map((lecture) => {
        if (lecture.isPreviewFree) {
          return lecture;
        }
        const { videoUrl, publicId, ...safeLecture } = lecture;
        return safeLecture;
      });
    }

    return res.status(200).json({
      course: safeCourse,
      purchased,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({
      message: "Failed to fetch",
      success: false,
    });
  }
};

const getAllPurchaseCourse = async (req, res) => {
  try {
    const purchases = await prisma.coursePurchase.findMany({
      where: {
        userId: req.userId,
        status: "completed",
      },
      include: {
        course: {
          include: {
            creator: {
              select: { id: true, name: true, email: true, photoUrl: true }
            }
          }
        }
      }
    });

    const mappedPurchases = purchases.map(p => ({
      ...p,
      _id: p.id,
      courseId: p.course ? {
        ...p.course,
        _id: p.course.id,
        creator: p.course.creator ? { ...p.course.creator, _id: p.course.creator.id } : null
      } : null
    }));

    return res.status(200).json({
      message: "found courses",
      purchaseCourse: mappedPurchases,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    return res.status(500).json({
      message: "Error fetching purchased courses",
      success: false,
    });
  }
};

const getAdminCreatedAndPurchasedCourses = async (req, res) => {
  try {
    const adminId = req.userId;
    console.log("Admin ID from token: ", adminId);

    const adminCourses = await prisma.course.findMany({
      where: { creatorId: adminId }
    });
    console.log(`Found ${adminCourses.length} courses created by admin.`);

    const adminCourseIds = adminCourses.map((course) => course.id);

    const purchasedCourses = await prisma.coursePurchase.findMany({
      where: {
        courseId: { in: adminCourseIds },
        status: "completed",
      },
      include: {
        course: true,
        user: {
          select: { id: true, name: true, email: true, photoUrl: true }
        }
      }
    });

    const mappedPurchased = purchasedCourses.map(p => ({
      ...p,
      _id: p.id,
      courseId: p.course ? {
        ...p.course,
        _id: p.course.id
      } : null,
      userId: p.user ? {
        ...p.user,
        _id: p.user.id
      } : null
    }));

    console.log(`Found ${mappedPurchased.length} purchased courses.`);

    return res.status(200).json({
      message: "found",
      success: true,
      purchasedCourses: mappedPurchased,
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
