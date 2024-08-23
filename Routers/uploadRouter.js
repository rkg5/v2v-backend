const express = require("express");
const uploadRouter = express.Router();
const {
  putObjectURL,
  getUserFiles,
  // provideAccess,
  generateObjectUrl,
  postUserFileData,
} = require("../controller/file-Controller/fileUploadController.js");
const protectRoute = require("../middleware/protectRoute.js");
const extractUserInfo = require("../middleware/currentUser.js");
const {
  handleValidationErrors,
} = require("../Validators/handleValidationErrors");
const {
  postUserFileDataValidator,
} = require("../Validators/postUserFileDataValidator");
uploadRouter
  .route("/objectUrl")
  .post(protectRoute, extractUserInfo, generateObjectUrl);
uploadRouter.route("/s3Url").post(protectRoute, extractUserInfo, putObjectURL);
uploadRouter
  .route("/getFiles")
  .get(protectRoute, extractUserInfo, getUserFiles);
// to post confirmation message after successful upload of file
uploadRouter
  .route("/postUserFile")
  .post(
    protectRoute,
    extractUserInfo,
    postUserFileDataValidator,
    handleValidationErrors,
    postUserFileData
  );

// uploadRouter
//   .route("/provideAccess")
//   .post(protectRoute, extractUserInfo, provideAccess);

module.exports = uploadRouter;
