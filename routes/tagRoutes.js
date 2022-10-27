import express from "express";
const router = express.Router();

// import controllers
import { getTags, createTag, deleteTag } from "../controllers/tagController.js";

router.route("/").get(getTags).post(createTag);
router.delete("/:id", deleteTag);

export default router;
