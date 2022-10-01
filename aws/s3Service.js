import { v4 as uuidv4 } from "uuid";

// import AWS S3 service
// import S3 from "aws-sdk/clients/s3.js";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// import instance of s3client with region
import { s3client } from "./s3client.js";

// function for uploading profile picture file to S3
const s3UploadProfile = async (file, userId) => {
  // create key for the object (where it is stored in the bucket and how to reference it)
  const key = `profile-pictures/${userId}-${file.originalname}`;

  // set up parameters for uploading object to profile pictures bucket
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME_PROFILE,
    Key: key,
    Body: file.buffer,
  };

  // upload the image to S3 using param object
  await s3client.send(new PutObjectCommand(param));

  // create and return the URL of the stored image
  const imageURL = process.env.AWS_PROFILE_URL + `${key}`;

  return imageURL;
};

// function for deleting profile picture file from S3
const s3DeleteProfile = async (key) => {
  // set up parameters for deleting object from profile pictures bucket
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME_PROFILE,
    Key: key,
  };

  // delete the image from S3 using param object
  await s3client.send(new DeleteObjectCommand(param));
};

// function for uploading screenshot files to S3
const s3UploadScreenshot = async (file) => {
  // create key for the screenshot object (where it is stored in the bucket and how to reference it)
  const key = `screenshots/${uuidv4()}:${file.originalname}`;

  // set up parameters for uploading object to screenshots bucket
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME_SCREENSHOT,
    Key: key,
    Body: file.buffer,
  };

  // upload image to S3 using param object
  await s3client.send(new PutObjectCommand(param));

  // create image url
  const imageURL = process.env.AWS_SCREENSHOT_URL + `${key}`;

  return { key, imageURL };
};

const s3DeleteScreenshot = async (key) => {
  // set up parameters for deleting object from profile pictures bucket
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME_SCREENSHOT,
    Key: key,
  };

  // delete the image from S3 using param object
  await s3client.send(new DeleteObjectCommand(param));
};

export {
  s3UploadProfile,
  s3DeleteProfile,
  s3UploadScreenshot,
  s3DeleteScreenshot,
};
