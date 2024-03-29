// configure dotenv for configuring environment variables
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

// get __dirname manually (because we are using ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";

// security packages
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

// passes errors to error handler without try-catch block
import "express-async-errors";

// import routers
import authRouter from "./routes/authRoutes.js";
import tradesRouter from "./routes/tradesRoutes.js";
import executionRouter from "./routes/executionRoutes.js";
import userInfoRouter from "./routes/userInfoRoutes.js";
import journalRouter from "./routes/journalsRoutes.js";
import stripeRouter from "./routes/stripeRoutes.js";
import tagRouter from "./routes/tagRoutes.js";

// import custom middleware
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";

// authentication middleware
import authMiddleware from "./middleware/auth.js";

import bodyParser from "body-parser";

// -- INITIALIZE APPLICATION --
const app = express();

// -- MIDDLEWARE --

// if the application is development mode, use morgan middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// request body parser middleware for json data
app.use(express.json());

// -- USE WHEN READY TO DEPLOY (express.static middleware to serve any static assets from client/build folder)
app.use(express.static(path.resolve(__dirname, "./client/build")));

// request body parser for url encoded requests
app.use(bodyParser.urlencoded({ extended: true }));

// security middleware
app.use(helmet()); // secure HTTP headers
app.use(xss()); // sanitize user input from POST body and GET queries and url params (prevent cross site scripting)
app.use(mongoSanitize()); // prevents MongoDB Operator Injection

// -- ROUTING --

// authentication route
app.use("/api/v1/auth", authRouter);

// stripe routes
app.use("/api/v1/stripe", stripeRouter);

// -- protected routes --

// get user info route (gets fetched everytime a protected resource/route is accessed on frontend)
app.use("/api/v1/me", authMiddleware, userInfoRouter);

// trades routes
app.use("/api/v1/trades", authMiddleware, tradesRouter);

// execution routes
app.use("/api/v1/executions", authMiddleware, executionRouter);

// journals routes
app.use("/api/v1/journals", authMiddleware, journalRouter);

// tag routes
app.use("/api/v1/tags", authMiddleware, tagRouter);

// -- USE WHEN READY TO DEPLOY (send index.html asset from ./client/build folder when no other path is hit, which by default, no other path above will be hit initially) --
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

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
