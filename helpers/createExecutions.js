import Execution from "../models/Execution.js";

const createExecutions = async (executions, market, tradeId, userId) => {
  // array to store execution documents
  const executionDocs = [];

  // for each execution in executions
  for (const execution of executions) {
    // destructure execution
    const { action, execDate, positionSize, price, commissions, fees } =
      execution;

    // create execution document
    var executionDoc = await Execution.create({
      action,
      execDate,
      positionSize,
      price,
      commissions,
      fees,
      tradeId,
      createdBy: userId,
    });

    // add created execution document to the array of execution documents
    executionDocs.push(executionDoc);
  }

  return executionDocs;
};

export default createExecutions;
