import mongoose from "mongoose";

/*
 * Trade properties
 * 1. Market -> STOCK, FUTURES, OPTIONS
 * 2. Option Type -> CALL, PUT
 * 3. Strike Price
 * 4. Lot Size
 * 5. Expiration Date
 * 6. Symbol
 * 7. Side -> LONG, SHORT
 * 8. Status -> OPEN, LOSS, WIN, BREAKEVEN
 * 9. Open date
 * 10. Average Entry Price -> based on FIRST execution (buy or sell). Then find average of all buys or sells
 * 11. Average Exit Price -> based on opposite of first execution. Then find average of all buys or sells
 * 12. Position size -> sum of all position sizes based on FIRST execution (buy or sell)
 * 13. Return $ -> difference between sells and buys times position size
 * 14. Return % -> difference between sells and buys times position size divided by buys times position size
 * 15. Net return $ -> return with fees and commissions deducted
 * 16. createdBy -> ID of user who created this trade
 * 17. tags -> array of tags that are assigned to this trade
 *
 * -- ADD THESE LATER AFTER BASIC CALCULATION FUNCTIONALITIES HAVE BEEN IMPLEMENTED --
 * 11. Strategy
 * 12. Mistakes
 * 13. Confirmations
 * 14. Follow Plan?
 */

// Trade Schema
const TradeSchema = new mongoose.Schema({
  market: {
    type: String,
    required: [true, "Please provide a market for this trade"],
    enum: ["STOCK", "FUTURES", "OPTIONS"],
  },
  // conditional requirement -> if trade market is 'options', require, otherwise don't require
  option: {
    type: String,
    enum: ["CALL", "PUT"],
  },
  // conditional requirement -> if trade market is 'options', require, otherwise don't require
  strikePrice: {
    type: Number,
  },
  // conditional requirement -> if trade market is 'futures', require, otherwise don't require
  lotSize: {
    type: Number,
  },
  // conditional requirement -> if trade market is 'options' || 'futures', require, otherwise don't require
  expDate: {
    type: Date,
  },
  symbol: {
    type: String,
    required: [true, "Please provide symbol"],
  },
  side: {
    type: String,
    enum: ["LONG", "SHORT"],
  },
  status: {
    type: String,
    enum: ["OPEN", "WIN", "LOSS", "BREAKEVEN"],
  },
  openDate: {
    type: Date,
  },
  averageEntry: {
    type: Number,
  },
  averageExit: {
    type: Number,
  },
  positionSize: {
    type: Number,
  },
  dollarReturn: {
    type: Number,
  },
  percentReturn: {
    type: Number,
  },
  netReturn: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: [
      true,
      "Please provide the user ID for which this trade belongs to",
    ],
    ref: "User",
  },
  tags: {
    type: Map,
    of: String,
  },
  notes: {
    type: String,
    default: "",
  },
  screenshots: {
    type: Map,
    of: String,
    validate: {
      validator: mapLimit,
      message: "You can only have 2 screenshots per trade entry",
    },
  },
  height: {
    type: Number,
    default: 40,
  },
});

// custom validator function for making sure the length of the screenshots array is less than or equal to 2
function mapLimit() {
  // if adding the screenshot makes the length of the screenshots array greater than 2, return false (validator failed)
  // otherwise, add the screenshot
  return this.screenshots.size <= 2;
}

export default mongoose.model("Trade", TradeSchema);
