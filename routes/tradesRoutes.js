import express from "express";
const router = express.Router();

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
router.route("/:id").patch(updateTrade);
router.route("/delete").post(deleteTrade);

export default router;
