const mongoose = require("mongoose");
const validator = require("validator");
const { baseManager } = require("../../ModelManager/BaseModel.Manager");
const questionModel = require("../Survey-Models/QuestionModels/questionModel");

const survey = mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  createdByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  invitedUsers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
});

survey.pre("save", async function () {
  console.log("Before saving survey in data base:", this);
  this.updatedAt = new Date();
  // it will invalidate this field so won't be stored in database
});

// triggers after an save event entry is done
survey.post("save", function (doc) {
  console.log("After saving survey in data base:", doc);
});

survey.post("deleteOne", { document: true, query: true }, async function () {
  console.log("after deleting an survey:");
  const questionManager = new baseManager(questionModel);
  await questionManager.deleteMany({ surveyId: this._id });
});

const surveyModel = new mongoose.model("Survey", survey);

module.exports = surveyModel;
