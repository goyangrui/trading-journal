import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";

import { UnauthenticatedError } from "../errors/index.js";

const userInfoController = async (req, res, next) => {
  // get the userId from the JWT payload
  const id = req.user.userId;

  // try and find the user in the database with the id
  const user = await User.findById(id);

  // if the user could not be found, throw unauthenticated error
  if (!user) {
    throw new UnauthenticatedError("Unauthorized");
  }

  // respond with user credentials to front end for authentication to protected routes
  res.status(StatusCodes.OK).json({
    userId: user._id,
    username: user.username,
    email: user.email,
    image: user.profile,
  });
};

export { userInfoController };
