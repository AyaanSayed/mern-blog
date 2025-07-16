import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";
import {S3Client, DeleteObjectCommand, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();
const s3Bucket = process.env.AWS_BUCKET_NAME;
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// export const create = async (req, res, next) => {
//   if (!req.user.isAdmin) {
//     return next(errorHandler(403, "You are not authorized to upload images"));
//   }

//   const file = req.files[0];
//   const bucketParams = {
//     Bucket: s3Bucket,
//     Key: file.originalname,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     ACL: 'public-read', 
//   };

//   try {
//     const data = await s3Client.send(new PutObjectCommand(bucketParams));
//     res.json(data);
//   } catch (error)  {
//     console.error("S3 Upload Error:", error);
//     return next(errorHandler(500, `Error uploading image to S3: ${error.message}`));
//   }
// };


export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to upload images"));
  }

  if (!req.files || req.files.length === 0) {
    return next(errorHandler(400, "No file uploaded"));
  }

  const file = req.files[0];
  
  // Generate unique filename to avoid conflicts
  const uniqueFileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
  
  const bucketParams = {
    Bucket: s3Bucket,
    Key: uniqueFileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read' // Make the object publicly readable
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    
    // Construct the direct S3 URL
    const directUrl = `https://${s3Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
    
    res.json({
      message: "Image uploaded successfully",
      imageUrl: directUrl,
      key: uniqueFileName,
      etag: data.ETag
    });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return next(errorHandler(500, `Error uploading image to S3: ${error.message}`));
  }
};

// export const getimage = async (req, res, next) => {
//   const id = req.params.Id;

//     console.log("Fetching image with key:", id);
//   console.log("From bucket:", s3Bucket);
//   const bucketParams = {
//     Bucket: s3Bucket,
//     Key: id,
//   };

//   try {
//     const data = await s3Client.send(new GetObjectCommand(bucketParams));
//     const contentType = data.ContentType;
//     const srcString = await data.Body.transformToString("base64");
//     const imageSource = `data:${contentType};base64,${srcString}`;
//     res.status(200).json(imageSource);
//   } catch (error)  {
//     console.error("S3 fetch Error:", error);
//     return next(errorHandler(500, `Error uploading image to S3: ${error.message}`));
//   }
// };


