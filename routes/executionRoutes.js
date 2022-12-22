import express from "express";
const router = express.Router();

// import controllers
import {
  getExecutions,
  getExecution,
  createExecution,
  editExecution,
  deleteExecution,
} from "../controllers/executionController.js";

router.route("/getone").get(getExecution);
router.route("/").post(createExecution).get(getExecutions);
router.route("/:id").patch(editExecution).delete(deleteExecution);

export default router;
