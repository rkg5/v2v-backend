const surveyModel = require("../../../models/Survey-Models/surveyModel");
const questionModel = require("../../../models/Survey-Models/QuestionModels/questionModel");
const responseModel = require("../../../models/Survey-Models/ResponseModels/ResponseModel");
const answerModel = require("../../../models/Survey-Models/ResponseModels/answerModel");
const { baseManager } = require("../../../ModelManager/BaseModel.Manager");
const mongoose = require("mongoose");

module.exports.postResponse = async (req, res) => {
  // using session to manage atomicity
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const response = req.body;
    const id = req.user.id;
    const surveyId = req.params.id;

    const responseManager = new baseManager(responseModel);
    const newResponse = await responseManager.create(
      {
        surveyId: surveyId,
        userId: id,
        createdAt: new Date(),
      },
      session
    );
    const questionManager = new baseManager(questionModel);
    const answerManager = new baseManager(answerModel);
    // console.log("Response:", response);
    for (let answer of response.answers) {
      const questionId = answer.questionId;
      const question = await questionManager.findOne({ _id: questionId });
      if (question.type === "checkbox") {
        // console.log("Answer:", answer);
        const newAnswer = await answerManager.create(
          {
            questionId: answer.questionId,
            responseId: newResponse._id,
            answerArray: answer.answerArray,
          },
          session
        );
      } else {
        const newAnswer = await answerManager.create(
          {
            questionId: answer.questionId,
            responseId: newResponse._id,
            answerString: answer.answerString,
          },
          session
        );
      }
    }

    await session.commitTransaction();

    res
      .status(200)
      .json({ message: "Successful creation of response", newResponse });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error occured:", error);
    res.status(500).json({ message: `error in postResponse, ${err.message}` });
  } finally {
    // Close the session
    session.endSession();
  }
};
