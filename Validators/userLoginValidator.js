// validators.js
const { body } = require("express-validator");

// Validator for user registration
module.exports.userLoginValidator = [
  body("email").trim().isEmail(),
  body("password").trim().notEmpty(),
];
("New survey form");
