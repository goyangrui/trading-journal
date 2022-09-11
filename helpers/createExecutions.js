import Execution from '../models/Execution.js';

const createExecutions = async (executions, market, tradeId, userId) => {

  // array to store execution documents
  const executionDocs = [];

  // for each execution in executions
  for (const execution of executions) {
    // destructure execution
    const {action, execDate, positionSize, price, commissions, fees, lotSize, expDate} = execution;

    // if the market is Stock
    if (market === 'stock') {
      // create execution with no lot size or expiration date
      var executionDoc = await Execution.create({
        action, execDate, positionSize, price, commissions, fees, tradeId, createdBy: userId
      })
    } else if (market === 'options') {
      // if the market is options
      // create execution with expiration date
      var executionDoc = await Execution.create({
        action, execDate, positionSize, price, commissions, fees, expDate, tradeId, createdBy: userId
      })
    } else {
      // otherwise if the market is futures
      // create execution with expiration date and lot size
      var executionDoc = await Execution.create({
        action, execDate, positionSize, price, commissions, fees, lotSize, expDate, tradeId, createdBy: userId
      })
    }
    executionDocs.push(executionDoc)
  }

  return executionDocs;
}

export default createExecutions;