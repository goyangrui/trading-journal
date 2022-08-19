import user from "../models/User.js";

import { UnauthenticatedError } from "../errors/index.js";

const userInfoController = async (req, res, next) => {
  // get the userId from the JWT payload
  const id = req.user.userId;

  // try and find the user in the database with the id
  const userInfo = await user.findById(id);

  // if the user could not be found, throw unauthenticated error
  if (!userInfo) {
    throw new UnauthenticatedError("Unauthorized");
  }

  // respond with user credentials to front end for authentication to protected routes
  res.json(userInfo);
};

export { userInfoController };
