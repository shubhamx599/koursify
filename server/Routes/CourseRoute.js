const express = require("express");
const { isAuthenticated, requireInstructor } = require("../MIddlewares/isAuthenticated");
const { 
  createCourse, fetchCourse, editCourse, createLecture, getLectures, 
  removeLecture, getLectureById, updateLecture, removeCourse, 
  publishCourse,
  getCourseById,
  getPublishCourse,
  searchCourse
} = require("../Controllers/CourseController");
const { upload } = require("../utils/multer.js");

const router = express.Router();

router.post("/create-course", isAuthenticated, requireInstructor, createCourse);
router.get("/get-all-course", isAuthenticated, requireInstructor, fetchCourse);
router.get("/get-published-course",getPublishCourse)
router.put("/update-course/:courseId", isAuthenticated, requireInstructor, upload.single("courseThumbnail"), editCourse);
router.post("/create-lecture/:courseId", isAuthenticated, requireInstructor, createLecture);
router.get("/get-all-course-lectures/:courseId", isAuthenticated, requireInstructor, getLectures);
router.post("/remove-course/:courseId", isAuthenticated, requireInstructor, removeCourse);
router.put("/update-lecture/:courseId/:lectureId", isAuthenticated, requireInstructor, updateLecture);
router.get("/get-Lecture/:lectureId", isAuthenticated, requireInstructor, getLectureById);
router.post("/remove-lecture/:lectureId", isAuthenticated, requireInstructor, removeLecture);
router.put("/publish-course/:courseId",isAuthenticated,requireInstructor,publishCourse)
router.get("/get-CourseById/:courseId",isAuthenticated,requireInstructor,getCourseById)
router.get("/search",isAuthenticated,searchCourse)
module.exports = router; 
