const mongoose = require("mongoose");

const response = mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

response.pre("save", async function () {
  this.updatedAt = new Date();
  this.createdAt = new Date();
});

const responseModel = new mongoose.model("Response", response);

module.exports = responseModel;
