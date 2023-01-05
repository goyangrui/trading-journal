import Trade from "../models/Trade.js";
import Execution from "../models/Execution.js";
import Tag from "../models/Tag.js";

import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";

import createExecutions from "../helpers/createExecutions.js";

import { s3UploadScreenshot, s3DeleteScreenshot } from "../aws/s3Service.js";

const createTrade = async (req, res) => {
  // get user id
  const { userId } = req.user;

  // -- PARSE REQUEST BODY (make sure all necessary values are provided) --

  // destructure request body
  let { market, symbol, executions, option, strikePrice, lotSize, expDate } =
    req.body.tradeInfo;
  const { selectedTagsId } = req.body;

  // convert symbol to uppercase
  symbol = symbol.toUpperCase();

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

  // if the user provided OPTIONS as the market, make sure they provided the strike price and option type
  if (market.toLowerCase() === "options" && !option) {
    throw new BadRequestError("Please provide option contract type");
  }

  if (market.toLowerCase() === "options" && !strikePrice) {
    throw new BadRequestError("Please provide option strike price");
  }

  if (market.toLowerCase() === "options" && strikePrice <= 0) {
    throw new BadRequestError("Please provide a valid option strike price");
  }

  // if the user provided FUTURES as the market, make sure they provided the lot size multiplier
  if (market.toLowerCase() === "futures" && !lotSize) {
    throw new BadRequestError(
      "Please provide lot size multiplier for futures contract"
    );
  }

  if (market.toLowerCase() === "futures" && lotSize <= 0) {
    throw new BadRequestError(
      "Please provide a valid lot size multiplier for futures contract"
    );
  }

  // if the user provided OPTIONS OR FUTURES as the market, make sure they provided the expiration date
  if (
    (market.toLowerCase() === "futures" ||
      market.toLowerCase() === "options") &&
    !expDate
  ) {
    throw new BadRequestError(
      "Please provide an expiration date for the contract"
    );
  }

  // check each execution object in executions array
  executions.forEach((execution) => {
    // destructure execution object
    const { action, execDate, positionSize, price, commissions, fees } =
      execution;

    // if the user doesn't provide any of the following information for each execution, throw a bad request error
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
  });

  // -- CREATE INITIAL TRADE DOCUMENT --
  let trade = undefined;
  // if the user entered OPTIONS for their market
  if (market.toLowerCase() === "options") {
    // create trade with the addition of option type, strike price, and expiration date
    trade = await Trade.create({
      market,
      symbol,
      createdBy: userId,
      option,
      strikePrice,
      expDate,
    });
  }
  // otherwise if the user entered FUTURES for their market
  else if (market.toLowerCase() === "futures") {
    // create trade with the addition with lot size multiplier, and expiration date
    trade = await Trade.create({
      market,
      symbol,
      createdBy: userId,
      lotSize,
      expDate,
    });
  } else {
    // otherwise (if the market is STOCKS), create trade with only market, symbol, and createdBy property
    trade = await Trade.create({ market, symbol, createdBy: userId });
  }

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
      tags: {},
      screenshots: new Map(),
    },
    { new: true }
  );

  // -- ADD TAGS TO TRADE DOCUMENT --
  // find tag docs with given selectedTagsId
  const tagDocs = await Tag.find({
    _id: {
      $in: selectedTagsId,
    },
  });

  console.log("tags:", tagDocs);

  // for each tag, add tag to the trade query
  const tradeFinal = await Trade.findById(tradeId);
  tagDocs.forEach((tagDoc) => {
    tradeFinal.tags.set(tagDoc._id, tagDoc.text);
  });

  console.log(tradeFinal);

  await tradeFinal.save();

  await res.status(StatusCodes.CREATED).json(tradeFinal);
};

const getAllTrades = async (req, res) => {
  // get userId from authentication middleware
  const { userId } = req.user;

  // get url parameters
  let { header, reverse, filters, page } = req.query;

  let trades = undefined;

  // if filters exists
  if (filters !== undefined) {
    // get the filters object
    const filtersObj = JSON.parse(filters);
    console.log(filtersObj);

    // initialize query object
    const queryObj = { createdBy: userId };

    // -- SYMBOL FILTER --
    const symbol = filtersObj.symbol.trim().toUpperCase();
    // add symbol to query object
    queryObj.symbol = { $regex: symbol, $options: "i" };

    // -- SIDES FILTER --
    const sides = filtersObj.sides;

    // initialize sidesArr to query from
    const sidesArr = [];
    // if sides long or short is true, add them to the sidesArr query array
    if (sides.long) {
      sidesArr.push("LONG");
    }
    if (sides.short) {
      sidesArr.push("SHORT");
    }

    // if the sidesArr is not empty, add it to the query object
    if (sidesArr.length !== 0) {
      queryObj.side = { $in: sidesArr };
    }

    // -- STATUS FILTER --
    const status = filtersObj.status;

    // initialize statusArr to query from
    const statusArr = [];
    // if status open, win, or loss are true, add them to the statusArr query array
    if (status.open) {
      statusArr.push("OPEN");
    }
    if (status.win) {
      statusArr.push("WIN");
    }
    if (status.loss) {
      statusArr.push("LOSS");
    }
    if (status.breakeven) {
      statusArr.push("BREAKEVEN");
    }

    // if the statusArr is not empty, add it to the query object
    if (statusArr.length !== 0) {
      queryObj.status = { $in: statusArr };
    }

    // -- MARKET FILTER --
    const markets = filtersObj.markets;

    // initialize marketsArr to query
    const marketsArr = [];
    // if market is stock, options, or futures, add them to the marketQuery array
    if (markets.stock) {
      marketsArr.push("STOCK");
    }
    if (markets.futures) {
      marketsArr.push("FUTURES");
    }
    if (markets.options) {
      marketsArr.push("OPTIONS");
    }

    // if the statusArr is not empty, add it to the query object
    if (marketsArr.length !== 0) {
      queryObj.market = { $in: marketsArr };
    }

    // -- DATE FILTER --
    const date1 = filtersObj.date1;
    const date2 = filtersObj.date2;

    let date1Obj = undefined;
    let date2Obj = undefined;

    // if both dates exist
    if (date1 && date2) {
      date1Obj = new Date(date1);
      date2Obj = new Date(date2);
    } else if (date1) {
      // otherwise if only date1 exists
      date1Obj = new Date(date1);
      date2Obj = new Date();
      date2Obj.setUTCHours(0, 0, 0, 0);
    } else if (date2) {
      // otherwise if only date2 exists
      date2Obj = new Date(date2);
      date1Obj = new Date();
      date1Obj.setUTCHours(0, 0, 0, 0);
    } else {
      // don't add anything to query parameters
    }

    // if either date exists
    if (date1 || date2) {
      // if date1 is less than date2
      if (date1Obj < date2Obj) {
        console.log("date1 is smaller");
        // add query to find trades that have dates greater than date1, and less than date2
        queryObj.openDate = { $gte: date1Obj, $lte: date2Obj };
      } else if (date2Obj < date1Obj) {
        console.log("date2 is smaller");
        queryObj.openDate = { $lte: date1Obj, $gte: date2Obj };
      } else {
        console.log("they are the same date");
        queryObj.openDate = date1Obj;
      }
    }

    // -- TAG FILTER --
    const tags = filtersObj.tags;
    // filter for only an array of tags that have a value of true
    const tagsArr = Object.entries(tags)
      .filter((tag) => {
        return tag[1];
      })
      .map((tag) => {
        return tag[0];
      });

    // if tags array is not empty
    if (tagsArr.length !== 0) {
      // initialize $and array
      const andArr = [];

      // loop through each tag id in tagsArr
      tagsArr.forEach((tagId) => {
        // for each tagId, push query for trades that have this tagId
        andArr.push({
          [`tags.${tagId}`]: {
            $exists: true,
          },
        });
      });

      // $and query -> filter for trades that have all of the given tagIds in the andArr
      queryObj["$and"] = andArr;
    }

    console.log(queryObj);

    // find trades based on query object
    trades = await Trade.find(queryObj);
  } else {
    // get all trades with the userId
    trades = await Trade.find({ createdBy: userId });
  }

  // sort the trades in chronological order by their open date (default) if the url query parameters don't exist
  if (!header || !reverse) {
    trades.sort((trade1, trade2) => {
      return trade1.openDate > trade2.openDate
        ? -1
        : trade1.openDate < trade2.openDate
        ? 1
        : 0;
    });
  } else {
    // otherwise, if the url parameters do exist
    // sort the trades based on given header to sort by, and whether to sort them in reverse order or not
    // if reverse is false
    if (reverse === "false") {
      // sort trades based on header in normal order
      trades.sort((trade1, trade2) => {
        return trade1[header] > trade2[header]
          ? -1
          : trade1[header] < trade2[header]
          ? 1
          : 0;
      });
    } else {
      // otherwise if reverse is true, sort trades based on header in reverse order
      trades.sort((trade1, trade2) => {
        return trade1[header] < trade2[header]
          ? -1
          : trade1[header] > trade2[header]
          ? 1
          : 0;
      });
    }
  }

  const tradesPerPage = 3;

  // compute the number of pages (for pagination)
  const numPages = Math.ceil(trades.length / tradesPerPage);

  // if the user did not pass in a page value
  if (!page) {
    // set page to 1 by default
    page = 1;
  }

  console.log(page);

  // slice the trades array to only get the trades for the given page
  trades = trades.slice((page - 1) * tradesPerPage, page * tradesPerPage);

  return res.status(StatusCodes.OK).json({ trades, numPages });
};

const updateTrade = async (req, res) => {
  // get userId from req.user
  const { userId } = req.user;

  // get trade id from request url params
  const tradeId = req.params.id;

  // get execution info and value of that execution (to be changed if they exist)
  const { value, executionInfo } = req.body;

  // get the tag info from the request body (to be added/removed if they exist)
  const { tagInfo } = req.body;

  // get screenshot file from req.file from multer (to be added/removed if they exist)
  const screenshotFile = req.file;

  // get screenshot doc key and screenshot link if they exist
  const { screenshotDocKey, screenshotLink } = req.body;

  // get notes from the request body
  const { notes } = req.body;

  var trade = undefined;
  var execution = undefined;

  // If value and executionInfo are not undefined
  if (value !== undefined && executionInfo !== undefined) {
    // otherwise, if tag info doesn't exist, edit execution properties of trade
    // get the executionId from executionInfo
    const executionId = executionInfo.split("-")[1];

    // get execution property name that was changed
    const executionProp = executionInfo.split("-")[2];

    // -- IF THE EXECUTIONPROP IS OPTION --
    if (executionProp === "option") {
      // if the value passed in is "CALL" or "PUT"
      if (value === "CALL" || value === "PUT") {
        // set the market to OPTIONS, and set the option to the value, set strike price to 100 by default, the lot size to undefined,
        // and expiration date to current time by default for the trade
        trade = await Trade.findOneAndUpdate(
          { _id: tradeId, createdBy: userId },
          {
            market: "OPTIONS",
            option: value,
            strikePrice: 100,
            expDate: new Date(new Date().setUTCHours(-24, 0, 0, 0)),
          },
          { returnDocument: "after" }
        );
        trade.lotSize = undefined;
        await trade.save();
      } else if (value === "FUTURES") {
        // otherwise if the value passed in is "FUTURES"
        // set the market to futures, the option to undefined, the strike price to undefined, the lotSize multiplier to 1 by default, and the expiration date to today by default
        trade = await Trade.findOneAndUpdate(
          { _id: tradeId, createdBy: userId },
          {
            market: value,
            lotSize: 1,
            expDate: new Date(new Date().setUTCHours(-24, 0, 0, 0)),
          },
          { returnDocument: "after" }
        );
        trade.option = undefined;
        trade.strikePrice = undefined;
        await trade.save();
      } else {
        // otherwise if the value passed in is "STOCK"
        // set the market to stock, the option to undefined, the strike price to undefined, the lotsize to undefined, the expiration date to undefined for the current trade
        trade = await Trade.findOneAndUpdate(
          { _id: tradeId, createdBy: userId },
          {
            market: value,
          },
          { returnDocument: "after" }
        );
        trade.option = undefined;
        trade.strikePrice = undefined;
        trade.lotSize = undefined;
        trade.expDate = undefined;
        await trade.save();
      }
      console.log(trade);
    }
    // OTHERWISE, IF THE EXECUTIONPROP IS ACTION
    else if (executionProp === "action") {
      // edit execution document using execution info from user
      const query = { _id: executionId, createdBy: userId };
      execution = await Execution.findOneAndUpdate(
        query,
        {
          [executionProp]: value,
        },
        { returnDocument: "after" }
      );

      // get the trade associated with this tradeId
      trade = await Trade.findOne({ _id: tradeId, createdBy: userId });
    }
    // OTHERWISE, IF THE EXECUTIONPROP IS STRIKE
    else if (executionProp === "strike") {
      // change the strikePrice property of the associated trade to the strike price given by the user
      trade = await Trade.findOneAndUpdate(
        { _id: tradeId, createdBy: userId },
        { strikePrice: value },
        { returnDocument: "after" }
      );
    }
    // OTHERWISE, IF THE EXECUTIONPROP IS EXPIRE
    else if (executionProp === "expire") {
      // change the expDate property of the associated trade to the date given by the user
      trade = await Trade.findOneAndUpdate(
        { _id: tradeId, createdBy: userId },
        { expDate: value },
        { returnDocument: "after" }
      );
    }
    // OTHERWISE, IF THE EXECUTIONPROP IS LOT
    else if (executionProp === "lot") {
      // change the expDate property of the associated trade to the date given by the user
      trade = await Trade.findOneAndUpdate(
        { _id: tradeId, createdBy: userId },
        { lotSize: value },
        { returnDocument: "after" }
      );
    }
    // OTHERWISE, IF THE EXECUTIONPROP IS EXECUTION DATE
    else if (executionProp === "exec") {
      // edit execution document using execution info from user
      const query = { _id: executionId, createdBy: userId };
      execution = await Execution.findOneAndUpdate(
        query,
        {
          execDate: value,
        },
        { returnDocument: "after" }
      );

      // get the trade associated with this tradeId
      trade = await Trade.findOne({ _id: tradeId, createdBy: userId });
    }

    // OTHERWISE, IF THE EXECUTIONPROP IS POSITION SIZE
    else if (executionProp === "position") {
      // edit execution document using execution info from user
      const query = { _id: executionId, createdBy: userId };
      execution = await Execution.findOneAndUpdate(
        query,
        {
          positionSize: value,
        },
        { returnDocument: "after" }
      );
    }

    // OTHERWISE, IF THE EXECUTIONPROP IS PRICE
    else if (executionProp === "price") {
      // edit execution document using execution info from user
      const query = { _id: executionId, createdBy: userId };
      execution = await Execution.findOneAndUpdate(
        query,
        {
          price: value,
        },
        { returnDocument: "after" }
      );

      // get the trade associated with this tradeId
      trade = await Trade.findOne({ _id: tradeId, createdBy: userId });
    }

    // OTHERWISE, IF THE EXECUTIONPROP IS COMMISSIONS
    else if (executionProp === "commissions") {
      // edit execution document using execution info from user
      const query = { _id: executionId, createdBy: userId };
      execution = await Execution.findOneAndUpdate(
        query,
        {
          commissions: value,
        },
        { returnDocument: "after" }
      );

      // get the trade associated with this tradeId
      trade = await Trade.findOne({ _id: tradeId, createdBy: userId });
    }

    // OTHERWISE, IF THE EXECUTIONPROP IS FEES
    else {
      // edit execution document using execution info from user
      const query = { _id: executionId, createdBy: userId };
      execution = await Execution.findOneAndUpdate(
        query,
        {
          fees: value,
        },
        { returnDocument: "after" }
      );

      // get the trade associated with this tradeId
      trade = await Trade.findOne({ _id: tradeId, createdBy: userId });
    }

    // destructure relevant trade properties for computing other trade metrics
    const { market, lotSize } = trade;

    // get all of the executions with the relevant trade id
    const executionDocs = await Execution.find({ tradeId, createdBy: userId });

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

    // update trade metrics with newly computed trade metrics

    res.status(StatusCodes.OK).json({
      tradeUpdateMetrics,
      execution,
      executionDocs,
      executionId,
      executionProp,
      value,
    });
  } else if (tagInfo !== undefined) {
    // otherwise if the tagInfo exists
    // get the tagId associated with this tag
    const tagId = Object.keys(tagInfo)[0];

    // if the value of the tagInfo is true
    if (Object.values(tagInfo)[0]) {
      // add this tag to this trade
      // first find the tag associated with this tagId
      const tagDoc = await Tag.findOne({ createdBy: userId, _id: tagId });

      // get the trade associated with this tradeId
      trade = await Trade.findOne({ createdBy: userId, _id: tradeId });

      // add the tag to this trade
      trade.tags.set(tagDoc._id, tagDoc.text);
      await trade.save();
    } else {
      // otherwise if the value of tagInfo is false
      // remove this tag from this trade

      // first find the tag associated with this tagId
      const tagDoc = await Tag.findOne({ createdBy: userId, _id: tagId });

      // then find the trade
      trade = await Trade.findOne({ createdBy: userId, _id: tradeId });

      // remove the tag from this trade
      trade.tags.delete(tagDoc._id);
      await trade.save();
    }
    return res.status(StatusCodes.OK).json({ trade });
  } else if (notes !== undefined) {
    // otherwise if notes is provided
    // update trade document's notes property

    trade = await Trade.findOneAndUpdate(
      { createdBy: userId, _id: tradeId },
      { notes }
    );

    return res.status(StatusCodes.OK).json({ trade });
  } else {
    // get the trade associated with this tradeId
    trade = await Trade.findOne({ _id: tradeId, createdBy: userId });

    // -- ADD SCREENSHOT --
    // only add screenshot to S3 bucket and trade screenshots map
    // if the number of screenshots in the trades is less than 2, and the screenshotFile exists from the user request
    if (trade.screenshots.size < 2 && screenshotFile) {
      // store the file in AWS S3 screenshots bucket
      let { key: screenshotKey, imageURL: screenshotLink } =
        await s3UploadScreenshot(screenshotFile);

      // get the uuid key from the screenshotKey (for Trade document)
      const screenshotDocKey = screenshotKey.split("::")[0];

      // set the screenshot key to the screenshot link in the screenshots map in trade document
      trade.screenshots.set(screenshotDocKey, screenshotLink);

      console.log(trade);
    }

    // -- REMOVE SCREENSHOT --
    // only if the user provided the screenshot link and doc key, delete the screenshot
    if (screenshotLink && screenshotDocKey) {
      // extrapolate the screenshot key for the S3 bucket from the screenshotLink
      const screenshotKey = screenshotLink.split(
        process.env.AWS_SCREENSHOT_URL
      )[1];

      // if the screenshot key (from the link spliting) exists
      if (screenshotKey) {
        // delete the screenshot from S3
        await s3DeleteScreenshot(screenshotKey);

        // remove the screenshot from the journal list of screenshots
        trade.screenshots.delete(screenshotDocKey);
      }
    }

    await trade.save();
    res.status(StatusCodes.OK).json({ trade });
  }
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

// get trades in format that can easily be viewed using chartjs
const getChartTradeData = async (req, res) => {
  // get userId from req.user
  const { userId } = req.user;

  // get url query params (number of days in the past from current time)
  let { days } = req.query;

  let trades = undefined;
  let currentDate = undefined;
  let beginningDate = undefined;
  // if the days is provided
  if (days) {
    // -- FIND TRADES BETWEEN DATE GIVEN DAYS PRIOR AND CURRENT DATE
    // compute date that is the given number of days prior to the current date
    currentDate = new Date(); // current date
    currentDate.setUTCHours(0, 0, 0, 0); // current date at midnight in UTC
    beginningDate = new Date();
    beginningDate.setUTCHours(0, 0, 0, 0);
    beginningDate.setDate(beginningDate.getDate() - days); // date of given days prior at midnight in UTC

    // find trades for the given user and whose dates are in the range of the given dates
    // also, the trades must be closed (WIN, LOSS, OR BREAKEVEN)
    trades = await Trade.find({
      createdBy: userId,
      openDate: { $gte: beginningDate, $lte: currentDate },
      status: { $in: ["WIN", "LOSS", "BREAKEVEN"] },
    });
  } else {
    // -- FIND ALL TRADES FOR THE GIVEN USER --
    trades = await Trade.find({
      createdBy: userId,
      status: { $in: ["WIN", "LOSS", "BREAKEVEN"] },
    });
  }

  // sort the trades in ascending order by date
  trades.sort((a, b) => {
    return a.openDate - b.openDate;
  });

  // -- GET LABELS FOR CUMULATIVE P&L AND DAILY AVERAGE P&L GRAPHS
  // map each trade to an array of dates, and filter dates so there are no duplicates
  // these will be the X-labels for the area chart of the running P&L, average P&L, and Profit factor
  const dates = trades
    .map((trade) => {
      // return the date, but stringified so they can later be compared to eliminate duplicate dates
      return trade.openDate.toJSON();
    })
    .filter((date, index, array) => {
      // indexOf returns the index of the first instance of the current date in the array, so
      // array.indexOf(date) === index will only ever return true once : for the first instance of the date
      return array.indexOf(date) === index;
    });

  // get number of trading days (length of dates array)
  const numDaysTraded = dates.length;

  // -- GET CUMULATIVE P&L AND ARRAY OF RUNNING P&L'S FOR EACH DAY --
  // -- ALSO GET AVERAGE DAILY P&L AND ARRAY OF AVERAGE P&L'S FOR EACH DAY --
  // -- ALSO GET AVERAGE RISK TO REWARD AND ARRAY OF RISK TO REWARDS FOR EACH DAY --

  // -- ALSO GET TOTAL LOSSES AND TOTAL PROFITS --
  // -- ALSO GET TOTAL NUMBER OF WINS AND LOSSES --
  // -- ALSO GET THE LARGEST WIN AND LARGEST LOSS --

  let cumulativePL = 0; // running total of P&L
  let cumulativePLObject = {}; // object to store running total P&L of each day that the user traded
  let averagePLObject = {}; // object to store average P&L for each day
  let profitFactorObject = {}; // object to store profitFactor for each day
  let totalLosses = 0; // running total of losses
  let totalProfits = 0; // running total of profits
  let wins = 0; // total number of winning trades
  let losses = 0; // total number of losing trades
  let largestWin = 0; // largest win
  let largestLoss = 0; // largest loss

  // loop through each date
  dates.forEach((date) => {
    // find trade(s) associated with current date
    var tradesCurrentDate = trades.filter((trade) => {
      return trade.openDate.toJSON() === date;
    });

    // compute the sum of returns of trades for current date
    // also compute the total profits total losses for the current date
    const currentDatePL = tradesCurrentDate.reduce(
      (previousValue, currentTrade) => {
        // add the net returns of the current trade to the total returns of the current date
        previousValue.netReturns += currentTrade.netReturn;
        // if the current trade's net return is positive
        if (currentTrade.netReturn > 0) {
          // add the net return of the current trade to the current date's profits
          previousValue.profits += currentTrade.netReturn;
          // also add one to the win counter in the WLObject
          wins += 1;
        } else {
          // otherwise if the net return is negative, add the net return of the current trade to the current date's losses
          previousValue.losses += currentTrade.netReturn;
          // also add one to the loss counter in the WLObject
          losses += 1;
        }

        // if the current trade's netReturn is greater than the current largest win
        if (currentTrade.netReturn > largestWin) {
          // set the largestWin to the current trade's net return
          largestWin = currentTrade.netReturn;
        }
        // otherwise, if the current trade's net return is less than the current largest loss
        else if (currentTrade.netReturn < largestLoss) {
          // set the largestLoss to the current trade's net return
          largestLoss = currentTrade.netReturn;
        } // otherwise do nothing
        else {
          // do nothing
        }
        return previousValue;
      },
      { netReturns: 0, profits: 0, losses: 0 }
    );

    // sum current running total with the sum of the returns of the trades for the current date
    cumulativePL += currentDatePL.netReturns;
    // sum the total profits to the profits for the current date
    totalProfits += currentDatePL.profits;
    // sum the total losses to the losses for the current date
    totalLosses += currentDatePL.losses;

    // compute average P&L of current date
    const dailyAvgPL = currentDatePL.netReturns / tradesCurrentDate.length;

    // compute profitFactor of the current date
    let currentDateProfitFactor = 0;
    // if the losses for the current date is 0
    if (currentDatePL.losses == 0) {
      // set the profitFactor of the current date to the total profits
      currentDateProfitFactor = currentDatePL.profits;
    } else {
      // otherwise, compute the profitFactor of the current date based on the losses of the current date
      currentDateProfitFactor =
        currentDatePL.profits / (-1 * currentDatePL.losses);
    }

    // assign the current cumulativePL as a property to the current date
    cumulativePLObject[date.slice(0, 10)] = cumulativePL;

    // assign the average P&L of the current date as a property to the current date
    averagePLObject[date.slice(0, 10)] = dailyAvgPL;

    // assign the profitFactor of the current date as a property to the current date
    profitFactorObject[date.slice(0, 10)] = currentDateProfitFactor;
  });

  const dailyAvgPL = cumulativePL / numDaysTraded; // average P&L across all days
  let profitFactor = 0;
  // if the total losses are 0
  if (totalLosses == 0) {
    // set the profitFactor to be equal to the total profits made
    profitFactor = totalProfits;
  } else {
    // otherwise compute profitFactor based on losses
    profitFactor = totalProfits / (-1 * totalLosses); // compute profitFactor for all trades in current period
  }

  // compute win and loss percentage
  const winPercentage = (wins * 100) / (wins + losses);
  const lossPercentage = (losses * 100) / (wins + losses);
  const WLObject = { winPercentage, lossPercentage }; // object to store win and loss percentage

  // create stats object to store all stats
  const stats = {
    cumulativePL,
    dailyAvgPL,
    profitFactor,
    winPercentage,
    totalProfits,
    totalLosses,
    wins,
    losses,
    largestWin,
    largestLoss,
  };

  res.status(StatusCodes.OK).json({
    stats,
    cumulativePLObject,
    averagePLObject,
    profitFactorObject,
    WLObject,
    numDaysTraded,
  });
};

export {
  createTrade,
  getAllTrades,
  updateTrade,
  deleteTrade,
  getChartTradeData,
};
