const prisma = require("../Config/prisma.js");
const { uploadMedia, deleteMedia, deleteVideo } = require("../utils/cloudinary.js");

const mapCourse = (c) => {
  if (!c) return null;
  return {
    ...c,
    _id: c.id,
    creator: c.creator ? { ...c.creator, _id: c.creator.id } : null,
    lectures: c.lectures ? c.lectures.map(l => ({ ...l, _id: l.id })) : []
  };
};

const mapLecture = (l) => {
  if (!l) return null;
  return {
    ...l,
    _id: l.id,
    course: l.course ? mapCourse(l.course) : null
  };
};

const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    const userId = req.userId;

    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Course title and category are required.",
        success: false,
      });
    }

    const course = await prisma.course.create({
      data: {
        courseTitle,
        category,
        creatorId: userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      course: mapCourse(course),
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      message: "Failed to create course",
      success: false,
    });
  }
};

const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await prisma.course.findMany({
      where: { creatorId: userId },
      include: {
        creator: {
          select: { id: true, name: true, email: true, photoUrl: true }
        }
      }
    });

    return res.status(200).json({
      success: true,
      courses: courses.map(mapCourse),
    });
  } catch (error) {
    console.error("Error fetching creator courses:", error);
    return res.status(500).json({
      message: "Failed to fetch courses",
      success: false,
    });
  }
};

const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
    const thumbnail = req.file;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    const updateData = {};
    if (courseTitle) updateData.courseTitle = courseTitle;
    if (subTitle) updateData.subTitle = subTitle;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (courseLevel) updateData.courseLevel = courseLevel;
    if (coursePrice !== undefined) {
      updateData.coursePrice = coursePrice === "" ? null : parseFloat(coursePrice);
    }

    if (thumbnail) {
      if (course.courseThumbnail) {
        try {
          const urlParts = course.courseThumbnail.split('/');
          const filename = urlParts[urlParts.length - 1];
          const publicId = filename.split('.')[0];
          await deleteMedia(publicId);
        } catch (err) {
          console.error("Failed to delete old thumbnail:", err);
        }
      }
      const uploadResponse = await uploadMedia(thumbnail.buffer);
      updateData.courseThumbnail = uploadResponse.secure_url;
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: updateData,
      include: {
        creator: {
          select: { id: true, name: true, email: true, photoUrl: true }
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      course: mapCourse(updatedCourse),
    });
  } catch (error) {
    console.error("Error editing course:", error);
    return res.status(500).json({
      message: "Failed to edit course",
      success: false,
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        creator: {
          select: { id: true, name: true, email: true, photoUrl: true }
        },
        lectures: true
      }
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      course: mapCourse(course),
    });
  } catch (error) {
    console.error("Error getting course by id:", error);
    return res.status(500).json({
      message: "Failed to fetch course",
      success: false,
    });
  }
};

const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: true }
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    if (course.courseThumbnail) {
      try {
        const urlParts = course.courseThumbnail.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = filename.split('.')[0];
        await deleteMedia(publicId);
      } catch (err) {
        console.error("Failed to delete thumbnail:", err);
      }
    }

    for (const lecture of course.lectures) {
      if (lecture.publicId) {
        try {
          await deleteVideo(lecture.publicId);
        } catch (err) {
          console.error("Failed to delete lecture video:", err);
        }
      }
    }

    await prisma.course.delete({ where: { id: courseId } });

    return res.status(200).json({
      success: true,
      message: "Course removed successfully.",
    });
  } catch (error) {
    console.error("Error removing course:", error);
    return res.status(500).json({
      message: "Failed to remove course",
      success: false,
    });
  }
};

const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle) {
      return res.status(400).json({
        message: "Lecture title is required",
        success: false,
      });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    const lecture = await prisma.lecture.create({
      data: {
        lectureTitle,
        courseId
      }
    });

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully.",
      lecture: mapLecture(lecture)
    });
  } catch (error) {
    console.error("Error creating lecture:", error);
    return res.status(500).json({
      message: "Failed to create lecture",
      success: false,
    });
  }
};

const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lectures: true }
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      lectures: course.lectures.map(mapLecture)
    });
  } catch (error) {
    console.error("Error fetching course lectures:", error);
    return res.status(500).json({
      message: "Failed to fetch lectures",
      success: false,
    });
  }
};

const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;

    const lecture = await prisma.lecture.findUnique({ where: { id: lectureId } });
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
        success: false,
      });
    }

    const updateData = {};
    if (lectureTitle) updateData.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) updateData.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) updateData.publicId = videoInfo.publicId;
    if (isPreviewFree !== undefined) updateData.isPreviewFree = isPreviewFree;

    if (videoInfo?.videoUrl && lecture.publicId) {
      try {
        await deleteVideo(lecture.publicId);
      } catch (err) {
        console.error("Failed to delete old video:", err);
      }
    }

    const updatedLecture = await prisma.lecture.update({
      where: { id: lectureId },
      data: updateData
    });

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully.",
      lecture: mapLecture(updatedLecture)
    });
  } catch (error) {
    console.error("Error editing lecture:", error);
    return res.status(500).json({
      message: "Failed to edit lecture",
      success: false,
    });
  }
};

const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await prisma.lecture.findUnique({ where: { id: lectureId } });
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
        success: false,
      });
    }

    if (lecture.publicId) {
      try {
        await deleteVideo(lecture.publicId);
      } catch (err) {
        console.error("Failed to delete video:", err);
      }
    }

    await prisma.lecture.delete({ where: { id: lectureId } });

    return res.status(200).json({
      success: true,
      message: "Lecture removed successfully."
    });
  } catch (error) {
    console.error("Error removing lecture:", error);
    return res.status(500).json({
      message: "Failed to remove lecture",
      success: false,
    });
  }
};

const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId }
    });

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      lecture: mapLecture(lecture)
    });
  } catch (error) {
    console.error("Error getting lecture by id:", error);
    return res.status(500).json({
      message: "Failed to fetch lecture",
      success: false,
    });
  }
};

const publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    const isPublished = publish === "true";
    await prisma.course.update({
      where: { id: courseId },
      data: { isPublished }
    });

    return res.status(200).json({
      success: true,
      message: isPublished ? "Course published successfully." : "Course unpublished successfully."
    });
  } catch (error) {
    console.error("Error publishing course:", error);
    return res.status(500).json({
      message: "Failed to update publish status",
      success: false,
    });
  }
};

const getPublishedCourse = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: {
        creator: {
          select: { id: true, name: true, email: true, photoUrl: true }
        },
        lectures: true
      }
    });

    return res.status(200).json({
      success: true,
      courses: courses.map(mapCourse),
    });
  } catch (error) {
    console.error("Error getting published courses:", error);
    return res.status(500).json({
      message: "Failed to fetch published courses",
      success: false,
    });
  }
};

const searchCourse = async (req, res) => {
  try {
    const { query = "", sortByPrice = "low" } = req.query;
    const categories = Array.isArray(req.query.categories)
      ? req.query.categories
      : (req.query.categories || "").split(",").filter(Boolean);

    const whereClause = {
      isPublished: true,
      OR: [
        { courseTitle: { contains: query, mode: 'insensitive' } },
        { subTitle: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } }
      ]
    };

    if (categories.length > 0) {
      whereClause.category = { in: categories };
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        creator: {
          select: { id: true, name: true, email: true, photoUrl: true }
        },
        lectures: true
      },
      orderBy: {
        coursePrice: sortByPrice === "low" ? "asc" : "desc"
      }
    });

    return res.status(200).json({
      success: true,
      courses: courses.map(mapCourse)
    });
  } catch (error) {
    console.error("Error searching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search courses"
    });
  }
};

module.exports = {
  createCourse,
  getCreatorCourses,
  fetchCourse: getCreatorCourses,
  editCourse,
  getCourseById,
  removeCourse,
  createLecture,
  getCourseLecture,
  getLectures: getCourseLecture,
  editLecture,
  updateLecture: editLecture,
  removeLecture,
  getLectureById,
  publishCourse,
  getPublishedCourse,
  getPublishCourse: getPublishedCourse,
  searchCourse,
};
