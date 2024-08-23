// validators.js

const { body } = require("express-validator");
const { isStringLiteral } = require("typescript");

// Validator for user registration
module.exports.surveyCreateValidator = [
  body("title").trim().notEmpty().withMessage("title can not be empty!"),
  body("description").trim(),
  body("surveyQuestions")
    .isArray()
    .custom((questions) => {
      if (!Array.isArray(questions)) {
        throw new Error(`surveyQuestions must be an array.`);
      }
      const typesEnum = ["multipleChoice", "text", "checkbox"];
      questions.forEach(function (question, index) {
        if (!question.questionString) {
          throw new Error("Question must be in valid format!");
        }
        if (!typesEnum.includes(question["type"])) {
          throw new Error("type of question is invalid!");
        }
        if (!question.category || question.category instanceof String) {
          throw new Error("category of question is invalid!");
        }
      });
      return true;
    }),
  // body("visibility")
  //   .trim()
  //   //.notEmpty()
  //   .custom((value) => {
  //     const visibilityEnum = ["public", "private"];
  //     if (!visibilityEnum.includes(value)) {
  //       throw new Error("value of visility is invalid!");
  //     }
  //     return true;
  //   }),
];
