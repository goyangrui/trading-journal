import Trade from "../models/Trade.js";
import Execution from "../models/Execution.js";

import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";

import createExecutions from "../helpers/createExecutions.js";

const createTrade = async (req, res) => {
  // get user id
  const { userId } = req.user;

  // -- PARSE REQUEST BODY (make sure all necessary values are provided) --

  console.log(req.body);
  // destructure request body
  const { market, symbol, executions } = req.body;

  // if the user did not provide a market, symbol, or execution
  if (!market) {
    throw new BadRequestError("Please provide a market");
  }
  if (!symbol) {
    throw new BadRequestError("Please provide a symbol");
  }
  if (!executions) {
    throw new BadRequestError("Please provide at least 1 execution");
  }

  // check each execution object in executions array
  executions.forEach((execution) => {
    // destructure execution object
    const {
      action,
      execDate,
      positionSize,
      price,
      commissions,
      fees,
      lotSize,
      expDate,
    } = execution;

    // for any market
    if (
      !action ||
      !execDate ||
      !positionSize ||
      price === undefined ||
      commissions === undefined ||
      fees === undefined
    ) {
      throw new BadRequestError("Missing required fields for execution(s)");
    }

    // for options and futures markets
    if (
      market.toLowerCase() === "options" ||
      market.toLowerCase() === "futures"
    ) {
      // if the user did not provide expiration date
      if (!expDate) {
        throw new BadRequestError("Expiration date required");
      }

      // for just futures market, if the user did not provide lotsize
      if (market.toLowerCase() === "futures" && !lotSize) {
        throw new BadRequestError("Lot size required");
      }
    }
  });

  // -- CREATE INITIAL TRADE DOCUMENT --
  const trade = await Trade.create({ market, symbol, createdBy: userId });

  // get the trade id
  const tradeId = trade._id;

  // -- CREATE EXECUTION DOCUMENTS FOR EACH EXECUTION --
  const executionDocs = await createExecutions(
    executions,
    market,
    tradeId,
    userId
  );

  console.log("executionDocs: ", executionDocs);

  // -- CALCULATE TRADE METRICS BASED ON EXECUTION DOCUMENTS --

  // -- SIDE --
  // the side depends on the action of the first execution - buy means long, and sell means short
  if (executionDocs[0].action.toLowerCase() === "buy") {
    var side = "long";
  } else {
    var side = "short";
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
  if (executionDocs[0].action === "sell") {
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
    dollarReturn *= executionDocs[0].lotSize;
  }

  console.log("dollarReturn:", dollarReturn);

  // -- STATUS --

  // if entry and exit positions are NOT equal
  if (
    sizeAndPriceTotals["entry"]["entryPositionTotal"] !==
    sizeAndPriceTotals["exit"]["exitPositionTotal"]
  ) {
    // position is still open
    var status = "open";
  } else {
    // otherwise, the position must be closed
    // if the dollar return is positive
    if (dollarReturn > 0) {
      var status = "win";
    } else if (dollarReturn < 0) {
      // otherwise if the dollar return is negative
      var status = "loss";
    } else {
      // otherwise, if the dollar return is 0
      var status = "breakeven";
    }
  }

  console.log("status:", status);

  // -- PERCENT RETURN --
  // percent return is the quotient between the dollar return and the total entry price
  // if the position is closed
  if (status === "win" || status === "loss" || status === "breakeven") {
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
      percentReturn /= executionDocs[0].lotSize;
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

  const tradeFinal = await Trade.findByIdAndUpdate(
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

  res.status(StatusCodes.CREATED).json(tradeFinal);
};

const getAllTrades = async (req, res) => {
  // get userId from authentication middleware
  const { userId } = req.user;

  // get all trades with the userId
  const trades = await Trade.find({ createdBy: userId });
  console.log();

  res.status(StatusCodes.OK).json({ trades });
};

const updateTrade = async (req, res) => {
  res.send("update trade");
  // TO-DO
};

const deleteTrade = async (req, res) => {
  // get array of trade id(s) from request body
  const tradeIdList = req.body;
  console.log(tradeIdList);

  // delete all executions correlated to the given trade ids in request body
  const executions = await Execution.deleteMany({
    tradeId: {
      $in: tradeIdList,
    },
  });

  // // delete all trades correlated to the following trade ids in request body
  const trades = await Trade.deleteMany({
    _id: {
      $in: tradeIdList,
    },
  });

  res.status(StatusCodes.OK).json({ executions, trades });
};

export { createTrade, getAllTrades, updateTrade, deleteTrade };
