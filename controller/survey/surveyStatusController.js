const { baseManager } = require("../../ModelManager/BaseModel.Manager");
const surveyStatusModel = require("../../models/Survey-Models/surveyStatusModel");

module.exports.getSurveyStatus = async (req, res) => {
  const surveyId = req.query.surveyId;
  const surveyStatusManager = new baseManager(surveyStatusModel);
  const surveyStatus = await surveyStatusManager.findOne({
    surveyId: surveyId,
  });
  res.status(200).json({ message: "Successful", surveyStatus });
};

module.exports.updateSurveyStatus = async (req, res) => {
  const surveyId = req.query.surveyId;
  const updatedStatus = req.query.Status;
  const surveyStatusManager = new baseManager(surveyStatusModel);
  const surveyStatus = await surveyStatusManager.findOne({
    surveyId: surveyId,
  });
  const updatedSurveyStatus = await surveyStatusManager.updateById(
    surveyStatus._id,
    { status: req.body.status }
  );
  res.status(200).json({ message: "Successful", updatedSurveyStatus });
};

module.exports.deleteSurveyStatus = async (req, res) => {
  const surveyId = req.query.surveyId;
  const surveyStatusManager = new baseManager(surveyStatusModel);
  const surveyStatus = await surveyStatusManager.findOne({
    surveyId: surveyId,
  });
  const deletedSurveyStatus = await surveyStatusManager.deleteById(
    surveyStatus._id
  );
  res.status(200).json({ message: "Successful", deletedSurveyStatus });
};
