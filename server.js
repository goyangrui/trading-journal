// configure dotenv
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";

// passes errors to error handler without try-catch block
import "express-async-errors";

// import routers
import authRouter from "./routes/authRoutes.js";
import tradesRouter from "./routes/tradesRoutes.js";
import userInfoRouter from "./routes/userInfoRoutes.js";

// import custom middleware
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";

// authentication middleware
import authMiddleware from "./middleware/auth.js";

import bodyParser from "body-parser";

// multipart form bodyparser for file uploading
import multer from "multer";
const upload = multer();

// -- INITIALIZE APPLICATION --
const app = express();

// -- MIDDLEWARE --

// if the application is development mode, use morgan middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// request body parser middleware for json data
app.use(bodyParser.json());

// request body parser for url encoded requests
app.use(bodyParser.urlencoded({ extended: true }));

// request body parser for multipart/form-data
app.use(upload.any());

// -- ROUTING --

// authentication route
app.use("/api/v1/auth", authRouter);

// -- protected routes --

// get user info route (gets fetched everytime a protected resource/route is accessed on frontend)
app.use("/api/v1/me", authMiddleware, userInfoRouter);

// trades routes
app.use("/api/v1/trades", authMiddleware, tradesRouter);

// -- ROUTE NOT FOUND MIDDLEWARE --
app.use(notFoundMiddleware);

// -- ERROR HANDLING MIDDLEWARE --
app.use(errorHandlerMiddleware);

// -- START SERVER --

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    // try and connect to mongoDB atlas
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
