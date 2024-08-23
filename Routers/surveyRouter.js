const express = require("express");
require("dotenv").config();
const {
  postSurvey,
  getSurveyById,
  updateSurvey,
  deleteSurveyById,
  getAllPublicSurveys,
  inviteUserForSurvey,
  getUserSurveyInvited,
} = require("../controller/survey/surveyController");
const {
  postResponse,
} = require("../controller/survey/responseController.js/responseController");
const extractUserInfo = require("../middleware/currentUser");
const {
  handleValidationErrors,
} = require("../Validators/handleValidationErrors");
const surveyRouter = express.Router();
const {
  surveyCreateValidator,
} = require("../Validators/surveyCreateValidator");
const protectRoute = require("../middleware/protectRoute");

surveyRouter
  .route("/response/:id")
  .post(protectRoute, extractUserInfo, postResponse);

surveyRouter.route("/getAllSurveys").get(protectRoute, getAllPublicSurveys);

surveyRouter
  .route("/")
  .post(
    protectRoute,
    extractUserInfo,
    surveyCreateValidator,
    handleValidationErrors,
    postSurvey
  );

surveyRouter
  .route("/inviteUserForSurvey/:surveyId")
  .post(protectRoute, extractUserInfo, inviteUserForSurvey);

// get all surveys for a user for which he is invited
surveyRouter
  .route("/getUserSurveyInvited")
  .get(protectRoute, extractUserInfo, getUserSurveyInvited);

surveyRouter
  .route("/:id")
  .get(protectRoute, getSurveyById)
  .patch(
    protectRoute,
    surveyCreateValidator,
    handleValidationErrors,
    updateSurvey
  )
  .delete(protectRoute, deleteSurveyById);
module.exports = surveyRouter;
