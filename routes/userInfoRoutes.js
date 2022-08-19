import express from "express";
const router = express.Router();

// import controllers
import { userInfoController } from "../controllers/userInfoController.js";

router.get("/", userInfoController);

export default router;
