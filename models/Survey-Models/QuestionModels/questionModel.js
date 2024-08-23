const mongoose = require("mongoose");
const validator = require("validator");

const question = mongoose.Schema({
  questionString: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["multipleChoice", "text", "checkbox"],
  },
  options: [
    // options of each question like multiple choice questions
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionCategory",
    required: true,
  },
});

const questionModel = new mongoose.model("Question", question);

module.exports = questionModel;
