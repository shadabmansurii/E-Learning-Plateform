import express from "express";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getAllCourses,
  getCourseLectures,
  getCreatorCourses,
  getLectureById,
  getSingleCourse,
  removeCourse,
  removeLecture,
  searchCourse,
  togglePublishCourse,
} from "../controllers/course.controller.js";

import isAuthenticated from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

/* ---------------- COURSE ---------------- */

// Create course
router.post("/create", isAuthenticated, createCourse);

// Edit course (thumbnail upload)
router.put(
  "/edit/:courseId",
  isAuthenticated,
  upload.single("courseThumbnail"),
  editCourse
);

// Creator courses
router.get("/creator-course", isAuthenticated, getCreatorCourses);

// Get all published courses
router.get("/", getAllCourses);

// Search courses
router.get("/search", isAuthenticated, searchCourse);

// Get single course
router.get("/:courseId", isAuthenticated, getSingleCourse);

// Delete course
router.delete("/:courseId", isAuthenticated, removeCourse);

/* ---------------- LECTURE ---------------- */

// Get all lectures of a course
router.get(
  "/:courseId/lectures",
  isAuthenticated,
  getCourseLectures
);

// Create lecture (basic)
router.post(
  "/:courseId/lecture",
  isAuthenticated,
  createLecture
);

// Get lecture by ID
router.get(
  "/lecture/:lectureId",
  isAuthenticated,
  getLectureById
);

// ✅ UPDATE lecture with VIDEO + NOTES + ASSIGNMENT
router.post(
  "/:courseId/lecture/:lectureId",
  isAuthenticated,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "notes", maxCount: 1 },
    { name: "assignment", maxCount: 1 },
  ]),
  editLecture
);

// Delete lecture
router.delete(
  "/lecture/:lectureId",
  isAuthenticated,
  removeLecture
);

/* ---------------- PUBLISH ---------------- */

// Publish / Unpublish course
router.put(
  "/:courseId",
  isAuthenticated,
  togglePublishCourse
);

export default router;
