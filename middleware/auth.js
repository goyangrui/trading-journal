import jwt from "jsonwebtoken";

import { UnauthenticatedError } from "../errors/index.js";

const authenticateUser = async (req, res, next) => {
  // get the authorization header from the request
  const authHeader = req.headers.authorization;

  // check if the authorization header exists
  if (!authHeader) {
    throw new UnauthenticatedError("Unauthorized");
  }

  // extract the token from the header
  const token = authHeader.split(" ")[1];

  // try and verify the token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // add jwt payload into response object
    res.user = payload;
  } catch (error) {
    throw new UnauthenticatedError("Unauthorized");
  }

  next();
};

export default authenticateUser;
