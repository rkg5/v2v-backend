const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
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

categorySchema.pre("save", async function () {
  console.log("Before saving survey in data base:", this);
  this.updatedAt = new Date();
  // it will invalidate this field so won't be stored in database
});

const CategoryModel = new mongoose.model("QuestionCategory", categorySchema);

module.exports = CategoryModel;
