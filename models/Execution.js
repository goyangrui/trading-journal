import mongoose from 'mongoose';

/*
 * Execution properties
 * 1. Action -> Buy or Sell
 * 2. Date of execution
 * 3. Shares or Contracts (Position size)
 * 4. Price
 * 5. Commissions
 * 6. Fees
 * 7. Lot size (for Futures, how many contracts per lot/positionSize)
 * 8. Expiration date (for Options and Futures)
 * 8. TradeId -> which trade is this execution for
 * 9. createdBy -> ID of user who created this execution
*/

// Execution Schema
const ExecutionSchema = new mongoose.Schema({
  action: {
    type: String,
    required: [true, 'Please indicate if this is a buy or sell'],
    enum: ['buy', 'sell'],
  },
  execDate: {
    type: Date,
    required: [true, 'Please indicate the date of this execution'],
  },
  positionSize: {
    type: Number,
    required: [true, 'Please indicate the position size of this execution'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide the price of this execution'],
  },
  commissions: {
    type: Number,
    required: [true, 'Please provide amount in commissions'],
  },
  fees: {
    type: Number,
    required: [true, 'Please provide amount in fees'],
  },
  // conditional requirement -> if trade market is 'futures', require, otherwise don't require 
  lotSize: {
    type: Number,
  },
  // conditional requirement -> if trade market is 'options' || 'futures', require, otherwise don't require
  expDate: {
    type: Date,
  },
  tradeId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'Please indicate the trade id for this execution'],
    ref: 'Trade',
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: [true, 'Please provide the user ID for which this execution belongs to'],
    ref: 'User'
  }
})

export default mongoose.model('Execution', ExecutionSchema)