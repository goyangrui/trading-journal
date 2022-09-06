import express from "express";
const router = express.Router();

// import controllers
import {
  getProducts,
  createSession,
  getSubscription,
  createSubscription,
} from "../controllers/stripeController.js";

import authMiddleware from "../middleware/auth.js";

// router to get products via stripe API
router.get("/products", getProducts);

// router to create a payment session using stripe API
router.post("/session", authMiddleware, createSession);

// router to manage subscriptions of a particular customer
router
  .route("/subscription")
  .get(authMiddleware, getSubscription)
  .post(createSubscription);

export default router;
