const express = require("express");
require("dotenv").config();
const protectRoute = require("../middleware/protectRoute");
const extractUserInfo = require("../middleware/currentUser");
const {
  getCookies,
  setCookies,
  updateUserInfo,
  getProfile,
} = require("../controller/userController.js");

const userRouter = express.Router();

userRouter.route("/getCookies").get(getCookies);
userRouter.route("/setCookies").get(setCookies);
userRouter
  .route("/updateUserInfo")
  .post(protectRoute, extractUserInfo, updateUserInfo);
userRouter.route("/profile").get(protectRoute, extractUserInfo, getProfile);

module.exports = userRouter;
