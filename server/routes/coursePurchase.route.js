import express from "express";
import {
  purchaseCourse,
  getAllPurchasedCourse,
  getCourseDetailsWithPurchaseStatus,
  stripeWebhook, // ✅ ADD THIS
} from "../controllers/coursePurchase.controller.js";
import isAuthenticated from "../middlewares/auth.js";

const router = express.Router();

router.post("/course", isAuthenticated, purchaseCourse);

router.get(
  "/courses/:courseId/details-with-status",
  isAuthenticated,
  getCourseDetailsWithPurchaseStatus
);

router.get("/", isAuthenticated, getAllPurchasedCourse);

// ✅ VERY IMPORTANT
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
