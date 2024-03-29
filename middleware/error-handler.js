import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };

  // mongoose validation error handling
  if (err.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors)
      .map((item) => {
        // if the item type is maxlength
        if (item.properties.type === "maxlength") {
          return `max length allowed is ${item.properties.maxlength}`;
        }
        return item.message;
      })
      .join(", ");
  }

  // mongoose duplicate key error handling
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  // multer (file uploading middleware) error handling
  if (err.code === "LIMIT_FILE_SIZE") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = "Profile picture file too large";
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = "Too many files";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = "File must be an image";
  }
  // return res.json({ err });
  // res.send(err);

  return res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
