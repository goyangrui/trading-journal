// import AWS S3 service
// import S3 from "aws-sdk/clients/s3.js";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// function for uploading file to S3
const s3Upload = async (file, userId) => {
  // instantiate S3Client class
  const s3client = new S3Client();

  // create key for the object (where it is stored in the bucket)
  const key = `profile-pictures/${userId}-${file.originalname}`;

  // set up parameters for uploading object to bucket
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
  };

  // upload the image to S3 using param object
  await s3client.send(new PutObjectCommand(param));

  // create and return the URL of the stored image
  const imageURL = process.env.AWS_PROFILE_URL + `${key}`;

  return imageURL;
};

// function for deleting file from S3
const s3Delete = async (key) => {
  // instantiate S3Client class
  const s3client = new S3Client();

  // set up parameters for deleting object from bucket
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  // delete the image from S3 using param object
  await s3client.send(new DeleteObjectCommand(param));
};

export { s3Upload, s3Delete };
