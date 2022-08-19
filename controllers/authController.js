import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

import User from "../models/User.js";

// REGISTER CONTROLLER
const register = async (req, res, next) => {
  // get request body
  const { username, email, password } = req.body;

  // check if the user provided all necessary information
  if (!username || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  // check if the email the user provided already exists
  const userAlreadyExists = await User.findOne({ email });

  if (userAlreadyExists) {
    throw new BadRequestError("Email already has an account");
  }

  // create the user (add the user to the database)
  const user = await User.create({ username, email, password });

  // create a JWT token to send back in the response
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      userId: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  });
};

// LOGIN CONTROLLER
const login = async (req, res) => {
  // get request body
  const { email, password } = req.body;

  // check if all user provided all necessary information
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  // get the user with the provided email
  const user = await User.findOne({ email }).select("+password");

  // if the user doesn't exist
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  // check if the user provided password matches
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  // create a JWT token to send back in response
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: { userId: user._id, username: user.username, email: user.email },
    token,
  });
};

export { register, login };
