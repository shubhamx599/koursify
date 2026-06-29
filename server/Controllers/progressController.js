const prisma = require("../Config/prisma.js");

const mapCourse = (c) => {
  if (!c) return null;
  return {
    ...c,
    _id: c.id,
    lectures: c.lectures ? c.lectures.map(l => ({ ...l, _id: l.id })) : []
  };
};

const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    console.log(`Fetching progress for user: ${userId}, course: ${courseId}`);

    // Step-1: Fetch the user's course progress
    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      },
      include: {
        lectureProgress: true
      }
    });

    // Fetch course details with lectures if user is enrolled
    const courseDetails = await prisma.course.findFirst({
      where: {
        id: courseId,
        enrolledStudents: {
          some: { id: userId }
        }
      },
      include: {
        lectures: true
      }
    });

    if (!courseDetails) {
      return res.status(403).json({ message: "Purchase this course to access its content" });
    }

    // Step-2: If no progress found, return course details with an empty progress
    if (!courseProgress) {
      return res.status(200).json({
        data: {
          courseDetails: mapCourse(courseDetails),
          progress: [],
          completed: false,
        },
      });
    }

    // Step-3: Return the user's course progress along with course details
    const mappedProgress = courseProgress.lectureProgress.map(lp => ({
      lectureId: lp.lectureId,
      viewed: lp.viewed,
      _id: lp.id
    }));

    return res.status(200).json({
      data: {
        courseDetails: mapCourse(courseDetails),
        progress: mappedProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.error("Error in getCourseProgress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.userId;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        enrolledStudents: {
          some: { id: userId }
        }
      },
      include: {
        lectures: true
      }
    });

    if (!course) {
      return res.status(403).json({
        message: "Purchase this course before recording progress",
      });
    }

    if (!course.lectures.some((lecture) => lecture.id === lectureId)) {
      return res.status(400).json({
        message: "Lecture does not belong to this course",
      });
    }

    // Fetch or create course progress
    const courseProgress = await prisma.courseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, completed: false },
      update: {}
    });

    // Record lecture progress
    await prisma.lectureProgress.upsert({
      where: {
        courseProgressId_lectureId: {
          courseProgressId: courseProgress.id,
          lectureId
        }
      },
      create: {
        courseProgressId: courseProgress.id,
        lectureId,
        viewed: true
      },
      update: {
        viewed: true
      }
    });

    // Check if all lectures are completed
    const completedLecturesCount = await prisma.lectureProgress.count({
      where: {
        courseProgressId: courseProgress.id,
        viewed: true
      }
    });

    if (course.lectures.length === completedLecturesCount) {
      await prisma.courseProgress.update({
        where: { id: courseProgress.id },
        data: { completed: true }
      });
    }

    return res.status(200).json({
      message: "Lecture progress updated successfully.",
    });
  } catch (error) {
    console.error("Error updating lecture progress:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const enrolled = await prisma.course.findFirst({
      where: { id: courseId, enrolledStudents: { some: { id: userId } } }
    });
    if (!enrolled) {
      return res.status(403).json({ message: "Purchase this course first" });
    }

    const courseProgress = await prisma.courseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, completed: true },
      update: { completed: true }
    });

    const lectures = await prisma.lecture.findMany({ where: { courseId } });
    for (const lecture of lectures) {
      await prisma.lectureProgress.upsert({
        where: {
          courseProgressId_lectureId: {
            courseProgressId: courseProgress.id,
            lectureId: lecture.id
          }
        },
        create: {
          courseProgressId: courseProgress.id,
          lectureId: lecture.id,
          viewed: true
        },
        update: {
          viewed: true
        }
      });
    }

    return res.status(200).json({ message: "Course marked as completed." });
  } catch (error) {
    console.error("Error in marking course as completed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const enrolled = await prisma.course.findFirst({
      where: { id: courseId, enrolledStudents: { some: { id: userId } } }
    });
    if (!enrolled) {
      return res.status(403).json({ message: "Purchase this course first" });
    }

    const courseProgress = await prisma.courseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, completed: false },
      update: { completed: false }
    });

    const lectures = await prisma.lecture.findMany({ where: { courseId } });
    for (const lecture of lectures) {
      await prisma.lectureProgress.upsert({
        where: {
          courseProgressId_lectureId: {
            courseProgressId: courseProgress.id,
            lectureId: lecture.id
          }
        },
        create: {
          courseProgressId: courseProgress.id,
          lectureId: lecture.id,
          viewed: false
        },
        update: {
          viewed: false
        }
      });
    }

    return res.status(200).json({ message: "Course marked as incompleted." });
  } catch (error) {
    console.error("Error in marking course as incomplete:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getCourseProgress, updateLectureProgress, markAsCompleted, markAsInCompleted };
