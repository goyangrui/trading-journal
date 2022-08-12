import express from "express";
const router = express.Router();

// import controllers
import { register, login } from "../controllers/authController.js";

// set up routes

router.route("/register").post(register);
router.route("/login").post(login);

export default router;
