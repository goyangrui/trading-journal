import { StatusCodes } from "http-status-codes";

const notFoundMiddleware = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).send("Route does not exist");
};

export default notFoundMiddleware;
