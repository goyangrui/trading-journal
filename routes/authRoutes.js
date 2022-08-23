import express from "express";
const router = express.Router();

// import controllers
import {
  register,
  login,
  updateUser,
  changePassword,
} from "../controllers/authController.js";

import authenticateUser from "../middleware/auth.js";

// set up routes

router.route("/register").post(register);
router.route("/login").post(login);

// authenticate user before allowing them to update their information
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/changePassword").patch(authenticateUser, changePassword);

export default router;
