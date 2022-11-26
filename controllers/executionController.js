import Execution from "../models/Execution.js";

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

const createExecution = async (req, res) => {
  res.send("create execution");
};

const editExecution = async (req, res) => {
  res.send("edit execution");
};

const deleteExecution = async (req, res) => {
  res.send("delete execution");
};

export { getExecutions, createExecution, editExecution, deleteExecution };
