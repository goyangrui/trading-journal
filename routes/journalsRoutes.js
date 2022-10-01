import express from "express";
const router = express.Router();

// multi-form body parser middleware for file uploading (multer)
import { upload } from "../middleware/multer.js";

// import controllers
import {
  createJournal,
  editJournal,
  deleteJournal,
  getJournals,
} from "../controllers/journalsController.js";

router
  .route("/")
  .get(getJournals)
  .post(createJournal)
  .delete(deleteJournal)
  .patch(upload.single("screenshotFile"), editJournal);

export default router;
