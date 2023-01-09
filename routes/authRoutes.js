import express from "express";
const router = express.Router();

// limit requests from singular IP address (for just login, and register routes)
import rateLimiter from "express-rate-limit";
const apiLimiter = rateLimiter({
  windowMS: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per windowMS
  message:
    "Too many requests from this IP address, please try again after 15 minutes",
});

// file uploading middleware (multer)
import { upload } from "../middleware/multer.js";

// import controllers
import {
  register,
  login,
  updateUser,
  changePassword,
} from "../controllers/authController.js";

import authenticateUser from "../middleware/auth.js";

// set up routes
router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);

// authenticate user before allowing them to update their information
router
  .route("/updateUser")
  .patch(authenticateUser, upload.single("file"), updateUser);
router.route("/changePassword").patch(authenticateUser, changePassword);

export default router;
