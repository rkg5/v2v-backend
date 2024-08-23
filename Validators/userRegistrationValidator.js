// validators.js

const { body } = require("express-validator");

// Validator for user registration
module.exports.userRegistrationValidator = [
	body("name").trim().notEmpty(),
	body("email").trim().notEmpty().isEmail(),
	body("password").trim().notEmpty().isLength({ min: 6 }),
	body("confirmPassword").trim().notEmpty().isLength({ min: 6 }),
	body("location").custom((location) => {
		if (!location || !location.coordinates) {
			return true;
		}
		else if (!Array.isArray(location.coordinates)) {
			throw new Error(`location must be an array of longitude and latitude.`);
		}
		const [longitude, latitude] = location.coordinates;
		if (typeof longitude !== 'number' || typeof latitude !== 'number') {
			throw new Error('Longitude and latitude must be numbers.');
		}
		if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
			throw new Error('Invalid longitude or latitude.');
		}
		return true;
	})
];
