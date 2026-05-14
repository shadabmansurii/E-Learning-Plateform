import Stripe from "stripe";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ---------------- BUY COURSE ---------------- */
export const purchaseCourse = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/course-details/${courseId}`,

      metadata: {
        userId,
        courseId,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------------- WEBHOOK ---------------- */
export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_ENDPOINT_SECRET
    );
  } catch (err) {
    console.log("❌ Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const { userId, courseId } = session.metadata;

    try {
      const newPurchase = new CoursePurchase({
        userId,
        courseId,
        amount: session.amount_total / 100,
        status: "completed",
        paymentIntentId: session.id,
      });

      await newPurchase.save();

      await User.findByIdAndUpdate(userId, {
        $addToSet: { enrolledCourses: courseId },
      });

      await Course.findByIdAndUpdate(courseId, {
        $addToSet: { enrolledStudents: userId },
      });

      console.log("✅ Payment saved in DB");
    } catch (err) {
      console.log("❌ DB Save Error:", err);
    }
  }

  res.status(200).send();
};

/* ---------------- COURSE DETAILS ---------------- */
export const getCourseDetailsWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate("creator")
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
    });

    res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course details" });
  }
};

/* ---------------- ALL PURCHASED ---------------- */
export const getAllPurchasedCourse = async (req, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching purchased courses" });
  }
};
