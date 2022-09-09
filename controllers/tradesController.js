import Trade from '../models/Trade.js';
import Execution from '../models/Execution.js';

import {StatusCodes} from 'http-status-codes';
import {BadRequestError} from '../errors/index.js';

const createTrade = async (req, res) => {
  // dummy request body for STOCK market
  const reqBodyStock = {
    'market': 'stock',
    'symbol': 'AAPL',
    'executions': [
      {
        'action': 'buy',
        'execDate': new Date(),
        'positionSize': 3,
        'price': 100,
        'commissions': 0,
        'fees': 0,
      },
      {
        'action': 'sell',
        'execDate': new Date(),
        'positionSize': 2,
        'price': 110,
        'commissions': 0,
        'fees': 0,
      },
      {
        'action': 'sell',
        'execDate': new Date(),
        'positionSize': 1,
        'price': 120,
        'commissions': 0,
        'fees': 0,
      }
    ]
  }

  // dummy request body for OPTIONS market (additional expiration date property for execution)
  const reqBodyOptions = {
    'market': 'options',
    'symbol': 'AAPL',
    'executions': [
      {
        'action': 'buy',
        'execDate': new Date(),
        'positionSize': 3,
        'price': 1,
        'commissions': 0,
        'fees': 0,
        'expDate': new Date(),
      },
      {
        'action': 'sell',
        'execDate': new Date(),
        'positionSize': 2,
        'price': 1.1,
        'commissions': 0,
        'fees': 0,
        'expDate': new Date(),
      },
      {
        'action': 'sell',
        'execDate': new Date(),
        'positionSize': 1,
        'price': 1.2,
        'commissions': 0,
        'fees': 0,
        'expDate': new Date(),
      }
    ]
  }

  // dummy request body for FUTURES market (additional expiration date AND lot size property for execution)
  const reqBodyFutures = {
    'market': 'futures',
    'symbol': 'NQ',
    'executions': [
      {
        'action': 'buy',
        'execDate': new Date(),
        'positionSize': 3,
        'price': 100,
        'commissions': 0,
        'fees': 0,
        'lotsize': 10,
        'expDate': new Date(),
      },
      {
        'action': 'sell',
        'execDate': new Date(),
        'positionSize': 2,
        'price': 110,
        'commissions': 0,
        'fees': 0,
        'lotsize': 10,
        'expDate': new Date(),
      },
      {
        'action': 'sell',
        'execDate': new Date(),
        'positionSize': 1,
        'price': 120,
        'commissions': 0,
        'fees': 0,
        'lotsize': 10,
        'expDate': new Date(),
      }
    ]
  }

  // get user id
  const {userId} = req.user;

  // -- PARSE REQUEST BODY (make sure all necessary values are provided) -- 

  // destructure request body
  const {market, symbol, executions} = reqBodyFutures;

  // if the user did not provide a market, symbol, or execution
  if (!market || !symbol || !executions) {
    throw new BadRequestError('Please provide Market, Symbol, and at least one Execution')
  }

  // check each execution object in executions array
  executions.forEach((execution) => {
    // destructure execution object
    const {action, execDate, positionSize, price, commissions, fees, lotsize, expDate} = execution;
    console.log(action, execDate, positionSize, price, commissions, fees, lotsize, expDate)

    // for any market
    if (!action || !execDate || !positionSize || !price || commissions === undefined || commissions === undefined) {
      throw new BadRequestError('Missing required fields for execution(s)');
    }

    // for options and futures markets
    if (market === 'options' || market === 'futures') {
      // if the user did not provide expiration date
      if (!expDate) {
        throw new BadRequestError('Expiration date required');
      }

      // for just futures market, if the user did not provide lotsize
      if (market === 'futures' && !lotsize) {
        throw new BadRequestError('Lot size required');
      }
    }
  })

  res.status(StatusCodes.CREATED).json({market, symbol});
};

const getAllTrades = (req, res) => {
  res.send("get all trades");
};

const updateTrade = (req, res) => {
  res.send("update trade");
};

const deleteTrade = (req, res) => {
  res.send("delete trade");
};

export { createTrade, getAllTrades, updateTrade, deleteTrade };
