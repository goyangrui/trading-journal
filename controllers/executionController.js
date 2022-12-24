import Execution from "../models/Execution.js";
import Trade from "../models/Trade.js";

import { StatusCodes } from "http-status-codes";

const getExecutions = async (req, res) => {
  // res.send("get executions");

  // get the userId from the req.user object
  const { userId } = req.user;

  // get the tradeId from the request body
  const { tradeId } = req.query;

  // get the executions with the given userId and tradeId
  const executions = await Execution.find({ createdBy: userId, tradeId });

  res.status(StatusCodes.OK).json({ executions });
};

const getExecution = async (req, res) => {
  const { userId } = req.user;

  const { executionId } = req.body;

  const execution = await Execution.findOne({
    createdBy: userId,
    _id: executionId,
  });

  res.status(StatusCodes.OK).json(execution);
};

const createExecution = async (req, res) => {
  res.send("create execution");
};

const editExecution = async (req, res) => {
  res.send("edit execution");
};

const deleteExecution = async (req, res) => {
  // get the userId from the req.user object
  const { userId } = req.user;

  // get the executionId from the request url parameters
  const executionId = req.params.id;

  // delete the execution from the database, and get the tradeId associated with this delete execution
  const execution = await Execution.findOneAndDelete({
    createdBy: userId,
    _id: executionId,
  });

  const tradeId = execution.tradeId;

  // find the trade associated with the tradeId
  const trade = await Trade.findOne({ createdBy: userId, _id: tradeId });

  // destructure relevant trade properties for computing other trade metrics
  const { market, lotSize } = trade;

  // get all of the executions with the relevant trade id
  const executionDocs = await Execution.find({ tradeId, createdBy: userId });

  // if there are no executionDocs left (user deleted all executions)
  if (executionDocs.length === 0) {
    await Trade.findOneAndDelete({ createdBy: userId, _id: tradeId });

    // send response back to frontend to inform user that the trade has been deleted
    res.status(StatusCodes.OK).json({ msg: "trade removed" });
  }

  // otherwise, if there are still executionDocs left
  else {
    // RECOMPUTE ALL OF THE TRADE METRICS BASED ON UPDATED EXECUTIONS

    // -- SIDE --
    // the side depends on the action of the first execution - buy means long, and sell means short
    if (executionDocs[0].action.toLowerCase() === "buy") {
      var side = "LONG";
    } else {
      var side = "SHORT";
    }

    console.log("side:", side);

    // -- OPEN DATE --
    // the open date is just the execution date of the first execution
    const openDate = executionDocs[0].execDate;

    console.log("openDate:", openDate);

    // -- AVERAGE ENTRY AND EXIT --
    // average entry price is the average of the buy prices if the first execution is a buy action, and average of sell prices if the first execution is a sell action
    // average exit price is the same, but is the average of sell prices if the first execution is a buy action, etc.

    // first, organize all of the total position sizes and total prices for entries and exits
    var sizeAndPriceTotals = executionDocs.reduce(
      (previousValue, currentExecution, currentIndex, executions) => {
        // if the first execution is a buy
        if (executions[0].action.toLowerCase() === "buy") {
          // if the current execution's action is a buy
          if (currentExecution.action.toLowerCase() === "buy") {
            // add its entry position size and price to the previousValue (initially 0)
            previousValue["entry"]["entryPositionTotal"] +=
              currentExecution.positionSize;
            previousValue["entry"]["entryPriceTotal"] +=
              currentExecution.price * currentExecution.positionSize;
          } else {
            // otherwise if the current execution's action is a sell
            previousValue["exit"]["exitPositionTotal"] +=
              currentExecution.positionSize;
            previousValue["exit"]["exitPriceTotal"] +=
              currentExecution.price * currentExecution.positionSize;
          }
        } else {
          // otherwise if the first execution is a sell
          // if the current execution's action is a sell
          if (currentExecution.action.toLowerCase() === "sell") {
            // add its position size to the previousValue (initially 0);
            previousValue["entry"]["entryPositionTotal"] +=
              currentExecution.positionSize;
            previousValue["entry"]["entryPriceTotal"] +=
              currentExecution.price * currentExecution.positionSize;
          } else {
            // otherwise if the current execution's action is a buy
            previousValue["exit"]["exitPositionTotal"] +=
              currentExecution.positionSize;
            previousValue["exit"]["exitPriceTotal"] +=
              currentExecution.price * currentExecution.positionSize;
          }
        }
        return previousValue;
      },
      {
        entry: { entryPositionTotal: 0, entryPriceTotal: 0 },
        exit: { exitPositionTotal: 0, exitPriceTotal: 0 },
      }
    );

    console.log(sizeAndPriceTotals);

    // calculate averageEntry and averageExit
    let averageEntry =
      sizeAndPriceTotals["entry"]["entryPriceTotal"] /
      sizeAndPriceTotals["entry"]["entryPositionTotal"];

    // if exitPositionTotal is NOT 0
    if (sizeAndPriceTotals["exit"]["exitPositionTotal"] !== 0) {
      // calculate averageExit
      var averageExit =
        sizeAndPriceTotals["exit"]["exitPriceTotal"] /
        sizeAndPriceTotals["exit"]["exitPositionTotal"];
    } else {
      // otherwise just set averageExit to 0
      var averageExit = 0;
    }

    console.log("averageEntry:", averageEntry);
    console.log("averageExit:", averageExit);

    // -- POSITION SIZE --
    // position size is just the total position size of the entry
    const positionSize = sizeAndPriceTotals["entry"]["entryPositionTotal"];

    console.log("positionSize:", positionSize);

    // -- DOLLAR RETURN --
    // dollar return is the difference between the average exit price and average entry price times the exit position total
    let dollarReturn =
      sizeAndPriceTotals["exit"]["exitPositionTotal"] *
      (averageExit - averageEntry);

    // if the first execution was a sell (short position)
    if (executionDocs[0].action.toLowerCase() === "sell") {
      // multiply the dollar return buy -1 because to make money in short selling, the exit price needs to be lower than the entry price!
      dollarReturn *= -1;
    }

    // if the market is options
    // multiply the dollar return by 100
    if (market.toLowerCase() === "options") {
      dollarReturn *= 100;
    }

    // if the market is futures
    // multiply the dollar return by lot size
    if (market.toLowerCase() === "futures") {
      dollarReturn *= lotSize;
    }

    console.log("dollarReturn:", dollarReturn);

    // -- STATUS --

    // if entry and exit positions are NOT equal
    if (
      sizeAndPriceTotals["entry"]["entryPositionTotal"] !==
      sizeAndPriceTotals["exit"]["exitPositionTotal"]
    ) {
      // position is still open
      var status = "OPEN";
    } else {
      // otherwise, the position must be closed
      // if the dollar return is positive
      if (dollarReturn > 0) {
        var status = "WIN";
      } else if (dollarReturn < 0) {
        // otherwise if the dollar return is negative
        var status = "LOSS";
      } else {
        // otherwise, if the dollar return is 0
        var status = "BREAKEVEN";
      }
    }

    console.log("status:", status);

    // -- PERCENT RETURN --
    // percent return is the quotient between the dollar return and the total entry price
    // if the position is closed
    if (status === "WIN" || status === "LOSS" || status === "BREAKEVEN") {
      // calculate the percent return accordingly
      var percentReturn =
        (dollarReturn / sizeAndPriceTotals["entry"]["entryPriceTotal"]) * 100;

      // if the market is options
      if (market.toLowerCase() === "options") {
        // divide percent return by 100 to neglect the 100x factor of the dollar return calculation
        percentReturn /= 100;
      }

      // if the market is futures
      if (market.toLowerCase() === "futures") {
        // divide percent return by lotSize to neglect the lotSize multiplier factor of the dollar return calculation
        percentReturn /= lotSize;
      }

      percentReturn = parseFloat(percentReturn.toFixed(2)); // round to 2 decimal places
    } else {
      // otherwise, just set percent return at zero
      var percentReturn = 0;
    }

    console.log("percentReturn:", percentReturn);

    // -- NET RETURN --
    // dollar return with fees and commissions deducted
    // if the exit position total is NOT zero
    if (sizeAndPriceTotals["exit"]["exitPositionTotal"] !== 0) {
      // calculate to the total fees and commissions from all executions
      var feesAndComm = executionDocs.reduce(
        (previousValue, currentExecution) => {
          previousValue += currentExecution.commissions + currentExecution.fees;
          return previousValue;
        },
        0
      );
      var netReturn = dollarReturn - feesAndComm;
    } else {
      // otherwise, set the net return to 0
      var netReturn = 0;
    }

    console.log("netReturn:", netReturn);

    // -- UPDATE TRADE DOCUMENT WITH NEWLY UPDATED TRADE METRICS --

    const tradeUpdateMetrics = await Trade.findByIdAndUpdate(
      tradeId,
      {
        side,
        status,
        openDate,
        averageEntry,
        averageExit,
        positionSize,
        dollarReturn,
        percentReturn,
        netReturn,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ tradeUpdateMetrics, executionDocs });
  }
};

export {
  getExecutions,
  getExecution,
  createExecution,
  editExecution,
  deleteExecution,
};
