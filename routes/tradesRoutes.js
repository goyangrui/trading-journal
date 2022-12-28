import express from "express";
const router = express.Router();

// multi-form body parser middleware for file uploading (multer)
import { upload } from "../middleware/multer.js";

// import controllers
import {
  createTrade,
  getAllTrades,
  getChartTradeData,
  updateTrade,
  deleteTrade,
} from "../controllers/tradesController.js";

router.route("/").post(createTrade).get(getAllTrades);
router.route("/data").get(getChartTradeData);
router.route("/:id").patch(upload.single("screenshotFile"), updateTrade);
router.route("/delete").post(deleteTrade);

export default router;
