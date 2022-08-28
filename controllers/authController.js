import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

import User from "../models/User.js";

// import custom aws s3 functions for uploading and deleting files
import { s3Upload, s3Delete } from "../aws/s3Service.js";

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
    user: {
      userId: user._id,
      username: user.username,
      email: user.email,
      image: user.profile,
    },
    token,
  });
};

// UPDATE USER CONTROLLER
const updateUser = async (req, res, next) => {
  // unpack send userInfo data (as string) and profile picture (file) from multer middleware
  const userInfoJsonString = req.body.userInfo;
  const profilePictureFile = req.file;

  try {
    // try and parse userInfo json string
    const userInfo = JSON.parse(userInfoJsonString);

    // unpack userInfo object
    const { username, email } = userInfo;

    // check if user failed to provide all necessary information
    if (!username || !email) {
      throw new BadRequestError("Please provide all values");
    }

    // find the user document via the userId from the token payload
    const user = await User.findById(req.user.userId);

    // update the user document's information based on user's inputs
    user.username = username;
    user.email = email;

    // -- HANDLE PROFILE PICTURE UPDATING --
    // if user sent profile picture file, upload the profile picture
    if (profilePictureFile) {
      // get the user _id, convert it to string, and pass it into s3Upload function (userId used a key for image)
      const userId = user._id.toString();

      // delete the old image from s3 with the userId if it exists
      if (user.profile) {
        // create the key of the image from the user.profile image url
        const key = user.profile.split(process.env.AWS_PROFILE_URL)[1];
        await s3Delete(key);
      }

      // upload the new file to S3 and retrieve the image location
      const imageLocation = await s3Upload(profilePictureFile, userId);

      // attach imageLocation to the profile property of user
      user.profile = imageLocation;
    }

    // save the user document data
    await user.save();

    // create a new token (with updated user information in payload)
    const token = user.createJWT();

    // send response with updated user information and new token
    res.status(StatusCodes.OK).json({
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        image: user.profile,
      },
      token,
      msg: "User information successfully updated",
    });
  } catch (error) {
    next(error);
  }
};

// CHANGE PASSWORD CONTROLLER
const changePassword = async (req, res) => {
  // get user's new password from the request body
  const { newPassword, confirmation } = req.body;

  // check if the user provided both the new password and the confirmation
  if (!newPassword || !confirmation) {
    throw new BadRequestError("Please provide all values");
  }

  // check if both the new password and confirmation are the same
  if (newPassword !== confirmation) {
    throw new BadRequestError("Passwords do not match");
  }

  // find the user document via the userId from the token
  const user = await User.findById(req.user.userId);

  // change the user's password to the new password
  user.password = newPassword;

  // save the document data (pre-save hook will hash the password)
  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ user, msg: "Password successfully changed" });
};

export { register, login, updateUser, changePassword };
