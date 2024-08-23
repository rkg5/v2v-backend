const mongoose = require("mongoose");

const surveyStatusSchema = mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

surveyStatusSchema.pre("save", async function () {
  console.log("Before saving survey status in data base:", this);
  this.updatedAt = new Date();
  // it will invalidate this field so won't be stored in database
});

const surveyStatusModel = new mongoose.model(
  "SurveyStatus",
  surveyStatusSchema
);

module.exports = surveyStatusModel;
