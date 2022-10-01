import { S3Client } from "@aws-sdk/client-s3";

const s3client = new S3Client({ region: process.env.AWS_REGION });

export { s3client };
