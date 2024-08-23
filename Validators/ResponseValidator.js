const { body } = require("express-validator");
const { param } = require("../app");

// Validator for Response recieved from user for a survey
module.exports.surveyCreateValidator = [
    body("answers").isArray().custom((answers) => {
        if (!Array.isArray(answers)) {
            throw new Error(`answers must be an array.`);
        }

        answers.forEach(function (answer) {
            if (!answer.questionId || !answer.answerString) {
                throw new Error("Answer must be in valid format!");
            }
        });

        return true;
    }),
    param("surveyId").isMongoId().withMessage("Invalid Survey Id"),
];
