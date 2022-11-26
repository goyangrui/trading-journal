import express from "express";
const router = express.Router();

// import controllers
import {
  getExecutions,
  createExecution,
  editExecution,
  deleteExecution,
} from "../controllers/executionController.js";

router.route("/").post(createExecution).get(getExecutions);
router.route("/:id").patch(editExecution).delete(deleteExecution);

export default router;
