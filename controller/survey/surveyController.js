const surveyModel = require("../../models/Survey-Models/surveyModel");
const questionModel = require("../../models/Survey-Models/QuestionModels/questionModel");
const { baseManager } = require("../../ModelManager/BaseModel.Manager");
const userModel = require("../../models/User-Models/userModel");
const categoryModel = require("../../models/Survey-Models/CategoryModel/QuestionCategory");
const mongoose = require("mongoose");

module.exports.postSurvey = async (req, res) => {
  // using session to manage atomicity
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log(req.body);
  try {
    const survey = req.body;
    const id = req.user.id;

    const surveyManager = new baseManager(surveyModel);
    const newSurvey = await surveyManager.create(
      {
        title: survey.title,
        description: survey.description,
        createdByUser: id,
        createdAt: new Date(),
        visibility: survey.visibility,
        invitedUsers: [id],
      },
      session
    );

    const questionManager = new baseManager(questionModel);
    const categoryManager = new baseManager(categoryModel);
    for (let question of survey.surveyQuestions) {
      const category = question.category;
      // check if category is already present in the survey
      const categoryExists = await categoryManager.findOne({
        title: category,
        surveyId: newSurvey._id,
      });
      let newCategory;
      if (!categoryExists) {
        newCategory = await categoryManager.create({
          title: category,
          surveyId: newSurvey._id,
        });
      } else {
        newCategory = categoryExists;
      }
      const newQuestion = await questionManager.create(
        {
          questionString: question.questionString,
          options: question.options,
          type: question.type,
          index: question.id,
          categoryId: newCategory._id,
        },
        session
      );
    }

    await session.commitTransaction();

    res
      .status(200)
      .json({ message: "Successful creation of survey", newSurvey });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error occured:", error);
    res.status(500).json({ message: error.message });
    throw new Error(`Error while creating survey: ${error}`);
  } finally {
    // Close the session
    session.endSession();
  }
};

module.exports.getSurveyById = async (req, res) => {
  try {
    const id = req.params.id;
    const surveyManager = new baseManager(surveyModel);
    const survey = await surveyManager.getById(id);
    // get all categories of the survey
    const categoryManager = new baseManager(categoryModel);
    const categories = await categoryManager.getManyByCriteria({
      surveyId: id,
    });
    console.log(categories);
    // get all questions of each category
    questionArray = [];
    const questionManager = new baseManager(questionModel);
    for (let category of categories) {
      const questions = await questionManager.getManyByCriteria({
        categoryId: category._id,
      });
      questionArray.push({
        category: category,
        questions: questions,
      });
      // console.log(category.questions);
    }
    // const questions = await questionManager.getManyByCriteria({ surveyId: id });
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }
    return res.json({
      message: "Successful retrieval of survey",
      survey: survey,
      questions: questionArray,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `error in getSurveyId, ${err.message}` });
  }
};

module.exports.updateSurvey = async (req, res) => {
  try {
    const id = req.params.id;
    const survey = req.body;
    const surveyManager = new baseManager(surveyModel);
    const response = await surveyManager.updateById(id, survey);
    if (!response) {
      return res.status(404).json({ message: "Survey not found" });
    }
    return res.json({ message: "Successful update of survey", data: response });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `error in updateSurvey, ${err.message}` });
  }
};

module.exports.deleteSurveyById = async (req, res) => {
  try {
    const id = req.params.id;
    const surveyManager = new baseManager(surveyModel);
    const response = await surveyManager.deleteById(id);
    if (!response) {
      return res
        .status(404)
        .json({ message: `error in deleteSurveyId, ${err.message}` });
    }
    return res.json({
      message: "Successful deletion of survey",
      data: response,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getAllPublicSurveys = async (req, res) => {
  try {
    const surveyManager = new baseManager(surveyModel);
    const surveys = await surveyManager.getManyByCriteria({
      visibility: "public",
    });
    surveys.sort((a, b) => b.createdAt - a.createdAt);
    return res.json({
      message: "Successful retrieval of all public surveys",
      data: surveys,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `error in getAllPublicSurveys, ${err.message}` });
  }
};

module.exports.getAllSurveysByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const surveyManager = new baseManager(surveyModel);
    const surveys = await surveyManager.getManyByCriteria({
      createdByUser: userId,
    });
    return res.json({
      message: "Successful retrieval of all surveys by user",
      data: surveys,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `error in getAllSurveysByUser, ${err.message}` });
  }
};

module.exports.inviteUserForSurvey = async (req, res) => {
  try {
    const surveyId = req.params.surveyId;
    const userEmail = req.body.email;
    const userManager = new baseManager(userModel);
    const user = await userManager.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = user._id;
    const surveyManager = new baseManager(surveyModel);
    const survey = await surveyManager.getById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }
    if (survey.invitedUsers.includes(userId)) {
      return res.status(400).json({ message: "User already invited" });
    }
    survey.invitedUsers.push(userId);
    await survey.save();
    return res.json({
      message: "Successful invitation of user for survey",
      data: { email: userEmail, surveyId: surveyId, name: user.name },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `error in inviteUserForSurvey, ${err.message}` });
  }
};

module.exports.getUserSurveyInvited = async function (req, res) {
  try {
    const userId = req.user.id;
    const surveyManager = new baseManager(surveyModel);
    const surveys = await surveyManager.getManyByCriteria({
      invitedUsers: { $elemMatch: { $eq: userId } },
    });
    surveys.forEach((survey) => {
      survey.invitedUsers = undefined;
    });
    return res.json({
      message:
        "Successful retrieval of all surveys of user for which he is invited",
      data: surveys,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `error in getUserSurveyInvited, ${err.message}` });
  }
};
