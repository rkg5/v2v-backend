const express = require("express");
require("dotenv").config();
const protectRoute = require("../middleware/protectRoute");
const {
  getSignup,
  postSignup,
  loginUser,
  logOut,
  forgotPassword,
  resetPassword,
} = require("../controller/authController");
const { body } = require("express-validator");
const extractUserInfo = require("../middleware/currentUser");
const {
  userRegistrationValidator,
} = require("../Validators/userRegistrationValidator");
const { userLoginValidator } = require("../Validators/userLoginValidator");
const {
  handleValidationErrors,
} = require("../Validators/handleValidationErrors");

//auth routes
const authRouter = express.Router();
authRouter
  .route("/signup")
  .get(getSignup)
  .post(userRegistrationValidator, handleValidationErrors, postSignup);

authRouter
  .route("/login")
  .get((req, res) => {
    res.json({ message: "Not allowed" });
  })
  .post(userLoginValidator, handleValidationErrors, loginUser);
authRouter.route("/logout").get(protectRoute, extractUserInfo, logOut);

authRouter.route("/forgotPassword").post(forgotPassword);
authRouter.route("/forgotPassword/:resetToken").post(resetPassword);

module.exports = authRouter;
