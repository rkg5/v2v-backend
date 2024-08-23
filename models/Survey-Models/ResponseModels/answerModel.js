const mongoose = require("mongoose");

const answer = mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  responseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Response",
    required: true,
  },
  answerString: {
    type: String,
  },
  answerArray: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

answer.pre("save", async function () {
  this.createdAt = new Date();
});

const answerModel = new mongoose.model("Answer", answer);

module.exports = answerModel;
