import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/coursePurchase.route.js";
import courseProgress from "./routes/courseprogress.route.js";
import path from "path";
import morgan from "morgan";
import { stripeWebhook } from "./controllers/coursePurchase.controller.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const DIRNAME = path.resolve();

/* ---------------- WEBHOOK (MUST BE BEFORE JSON) ---------------- */
app.post(
  "/api/v1/purchase/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

/* ---------------- MIDDLEWARE ---------------- */

// logging
app.use(morgan("dev"));

// parse json
app.use(
  "/api/v1/purchase/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json());

// parse cookies
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* ---------------- API ROUTES ---------------- */

app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/course-progress", courseProgress);

/* ---------------- FRONTEND ---------------- */

app.use(express.static(path.join(DIRNAME, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
