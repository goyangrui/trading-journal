import express from "express";
const router = express.Router();

// import controllers
import {
  createJournal,
  editJournal,
  deleteJournal,
} from "../controllers/journalsController.js";

router.route("/").post(createJournal).delete(deleteJournal).patch(editJournal);

export default router;
