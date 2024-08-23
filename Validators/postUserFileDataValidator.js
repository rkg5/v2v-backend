const { body } = require("express-validator");

// Validator for Response recieved from user for a survey
module.exports.postUserFileDataValidator = [
  body("contentType").isString().notEmpty().withMessage("Invalid Content Type"),
  body("fileName").isString().notEmpty().withMessage("Invalid File Name"),
  body("key").isString().notEmpty().withMessage("Invalid Key"),
  body("fileDescription").isString().optional(),
  body("fileTags").isArray().optional(),
];
