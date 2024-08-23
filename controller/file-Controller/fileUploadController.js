const userModel = require("../../models/User-Models/userModel.js");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
require("dotenv").config();
const crypto = require("crypto");
const { promisify } = require("util");
const randomBytes = promisify(crypto.randomBytes);
const { baseManager } = require("../../ModelManager/BaseModel.Manager.js");
const fileModel = require("../../models/file-Models/fileModel.js");
const mongoose = require("mongoose");
// Configure AWS SDK with your credentials

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credential: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

//generate object access presigned URL
module.exports.generateObjectUrl = async function generateObjectUrl(req, res) {
  const key = req.body["key"];
  console.log(key);
  if (!key) return res.status(400).json({ message: "key is required" });
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  console.log("object access url", url);
  return res.json({ "Object access URL": url, expiresIn: "5 min" });
};

// generate object upload presigned URL
module.exports.putObjectURL = async function putObjectURL(req, res) {
  const data = req.body;
  const { fileName, contentType } = data;
  const key = (await crypto.randomBytes(16)).toString("hex");
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: "UserFiles" + "/" + (key + fileName),
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  const responseObject = {
    uploadURL: url,
    key: "UserFiles" + "/" + (key + fileName),
    contentType: contentType,
    createdAt: new Date(),
    expiresIn: new Date(new Date().setMinutes(new Date().getMinutes() + 5)),
  };
  console.log("object upload url", responseObject);
  return res.json(responseObject);
};

// async function init() {
//   console.log(
//     "URL for object is",
//     await generateObjectUrl(
//       "25b0240b3987f89bddee926e9dba658aScreenshot from 2024-03-10 15-48-17.png"
//     )
//   );
//   // console.log(
//   //   "URL for upload objects:",
//   //   await putObjectURL("Screenshot from 2024-03-10 15-48-17.png", "image/png")
//   // );
// }

// init();
// /////////////////////////////////////////////////////////////////////////////////////////////////////

// AWS.config.update({
//   accessKeyId: "YOUR_ACCESS_KEY",
//   secretAccessKey: "YOUR_SECRET_KEY",
//   region: "us-east-1", // Change to your region
// });

// const s3 = new AWS.S3({
//   region,
//   accessKeyId,
//   secretAccessKey,
//   signatureVersion: "v4",
// });

// module.exports.generateUploadURL = async (req, res) => {
//   const fileType = req.query["fileType"];
//   const key = (await crypto.randomBytes(16)).toString("hex");
//   // Get signed URL from S3
//   const s3Params = {
//     Bucket: bucketName,
//     Key: key,
//     ContentType: fileType,
//     Expires: 300, // 5min
//   };

//   const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);
//   return res.status(200).json({ uploadURL: uploadURL });
// };

module.exports.postUserFileData = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const data = req.body;
    console.log(data);
    const ContentType = req.body["contentType"];
    const fileName = req.body["fileName"];
    const key = req.body["key"];
    const createdByUser = req.user.id;
    const fileDescription = req.body["fileDescription"];
    const fileTags = req.body["fileTags"];
    const fileCategory = req.body["fileCategory"];
    const fileObject = {
      fileName: fileName,
      key: key,
      ContentType: ContentType,
      createdByUser: createdByUser,
      fileDescription: fileDescription,
      fileTags: fileTags,
      fileCategory: fileCategory,
    };
    const fileManager = new baseManager(fileModel);
    const file = await fileManager.create(fileObject, session);
    const userManager = new baseManager(userModel);
    const user = await userManager.getById(createdByUser);
    user.hasFileAccess.push({
      fileId: file._id,
      ownershipType: "createdByUserItself",
    });
    await userManager.updateById(user._id, user, session);
    await session.commitTransaction();
    return res.status(200).json({
      message: "file created successfully",
      data: file,
    });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({
      message: "file creation failed",
      error: err.message,
    });
  } finally {
    // Close the session
    session.endSession();
  }
};

module.exports.getUserFiles = async (req, res) => {
  const userId = req.user.id;
  const userManager = new baseManager(userModel);
  const files = (await userManager.findOne({ _id: userId }))["hasFileAccess"];
  console.log(files);
  let userFiles = [];
  for (let file of files) {
    const fileManager = new baseManager(fileModel);
    const userFile = await fileManager.getById(file.fileId);
    console.log(userFile);
    if (!userFile) continue;
    userFiles.push({
      fileName: userFile.fileName,
      fileDescription: file.fileDescription,
      fileTags: file.fileTags,
      fileCategory: file.fileCategory,
      key: userFile.key,
      ContentType: userFile.ContentType,
    });
  }
  return res.status(200).json({
    message: "files retrieved successfully",
    data: userFiles,
  });
};

// module.exports.provideAccess = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const fileId = req.body["fileId"];
//     const userId = req.body["userId"];
//     const ownershipType = req.body["ownershipType"];
//     const userManager = new baseManager(userModel);
//     const user = await userManager.getById(userId);
//     user.hasFileAccess.push({
//       fileId: fileId,
//       ownershipType: ownershipType,
//     });
//     await userManager.updateById(user._id, user, session);
//     const fileManager = new baseManager(fileModel);
//     const file = await fileManager.getById(fileId);
//     file.fileAccessGivenToUsers.push({
//       givenToUser: userId,
//       accessGivenAt: new Date(),
//       accessExpiresAt: new Date(
//         new Date().setFullYear(new Date().getFullYear() + 1)
//       ),
//     });
//     await fileManager.updateById(file._id, file, session);
//     await session.commitTransaction();
//     return res.status(200).json({
//       message: "file access provided successfully",
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     return res.status(500).json({
//       message: "file access failed",
//       error: err.message,
//     });
//   } finally {
//     // Close the session
//     session.endSession();
//   }
// };
