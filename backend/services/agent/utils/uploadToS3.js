import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.js";

export const uploadToS3 = async (filename, buffer, contentType) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    return response;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};
