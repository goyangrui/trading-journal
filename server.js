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

// import custom middleware
import errorHandlerMiddleware from "./middleware/error-handler.js";

// authentication middleware
import authMiddleware from "./middleware/auth.js";

// -- INITIALIZE APPLICATION --
const app = express();

// -- MIDDLEWARE --

// if the application is development mode, use morgan middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// request body parser middleware
app.use(express.json());

// -- ROUTING --

// authentication route
app.use("/api/v1/auth", authRouter);

// -- protected routes --
// trades routes
app.use("/api/v1/trades", authMiddleware, tradesRouter);

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
