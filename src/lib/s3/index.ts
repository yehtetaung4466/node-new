import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";
config()

// Configure the S3 client
const endpoint = process.env.S3_URL!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const credentials = {
  accessKeyId,
  secretAccessKey,
};
const s3Client = new S3Client({
  endpoint, // Replace with your S3 endpoint
  credentials,
  region: process.env.AWS_REGION, // Replace with your AWS region
  forcePathStyle: process.env.NODE_ENV === "local", // Required for local S3 compatibility
});

export const BUCKET_NAME = process.env.S3_BUCKET_NAME || "my-bucket"; // Replace with your S3 bucket name

// Upload a file to S3
async function upload(file:any) {
  const imageBuffer = Buffer.from(file.content, "base64"); // Convert base64 image to buffer

  const s3Params = {
    Bucket: BUCKET_NAME,
    Key: `product-images/${Date.now()}-${file.filename}`, // Unique image name
    Body: imageBuffer,
    ContentType: file.contentType, // Set the appropriate content type
  };

  const command = new PutObjectCommand(s3Params);

  try {
    const uploadResult = await s3Client.send(command);
    return s3Params.Key;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Download a file from S3
async function download(key:string) {
  const s3Params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  const command = new GetObjectCommand(s3Params);

  try {
    const response = await s3Client.send(command);
    return response.Body;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}

// Generate a presigned URL for a file
async function getSignedUrlSync(key:string) {
  const presignedUrlParams = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: 60 * 60, // URL expires in 1 hour
  };

  try {
    const presignedUrl = await getSignedUrl(s3Client, new GetObjectCommand(presignedUrlParams), {
      expiresIn: 60 * 60, // 1 hour
    });
    return process.env.NODE_ENV === "local"
      ? presignedUrl.replace("minio", "localhost")
      : presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}

// Remove a file from S3
async function remove(key:string) {
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  const command = new DeleteObjectCommand(deleteParams);

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

// Export functions
export default {
  upload,
  download,
  getSignedUrlSync,
  remove,
};
