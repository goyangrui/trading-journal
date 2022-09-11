import mongoose from 'mongoose';

/*
 * Trade properties
 * 1. Market -> STOCK, FUTURES, OPTIONS 
 * 2. Symbol 
 * 3. Side -> LONG, SHORT
 * 3. Status -> OPEN, LOSS, WIN, BREAKEVEN
 * 4. Open date
 * 5. Average Entry Price -> based on FIRST execution (buy or sell). Then find average of all buys or sells
 * 6. Average Exit Price -> based on opposite of first execution. Then find average of all buys or sells
 * 7. Position size -> sum of all position sizes based on FIRST execution (buy or sell)
 * 8. Return $ -> difference between sells and buys times position size
 * 9. Return % -> difference between sells and buys times position size divided by buys times position size
 * 10. createdBy -> ID of user who created this trade
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
    required: [true, 'Please provide a market for this trade'],
    enum: ['stock', 'futures', 'options'],
  },
  symbol: {
    type: String,
    required: [true, 'Please provide symbol'],
  },
  side: {
    type: String,
    enum: ['long', 'short'],
  },
  status: {
    type: String,
    enum: ['open', 'win', 'loss', 'breakeven']
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
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: [true, 'Please provide the user ID for which this trade belongs to'],
    ref: 'User'
  }
});

export default mongoose.model('Trade', TradeSchema);