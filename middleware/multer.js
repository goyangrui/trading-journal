// multipart form bodyparser middleware for file uploading
import multer from "multer";

// random uuid generator
import { v4 as uuid } from "uuid";

// store file ON DISK
// const storage = multer.diskStorage({
//   // upload file to uploads folder
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   // set name to uuid-originalname
//   filename: (req, file, cb) => {
//     const { originalname } = file;
//     cb(null, `${uuid()}-${originalname}`);
//   },
// });

// store file IN MEMORY
const storage = multer.memoryStorage();

// file filter function (only accept images)
const fileFilter = (req, file, cb) => {
  // destructure mimetype from file object
  const { mimetype } = file;

  // split the mimetype by '/' and get the first one
  const fileType = mimetype.split("/")[0];

  // if the file type is an image
  if (fileType === "image") {
    // accept the file
    cb(null, true);
  } else {
    // if the file type is not an image, throw a multer error and handle it in express error handler
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

// limits
// max number of files is 1
// maximum file size is 3MB
const limits = {
  files: 1,
  fileSize: 3000000,
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

export { upload };
