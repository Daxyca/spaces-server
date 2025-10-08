import { body } from "express-validator";
import validationErrorsMiddleware from "./validationErrorsMiddleware.js";

const displayName = body("displayName")
  .trim()
  .isLength({ min: 3, max: 12 })
  .withMessage("Display name must be 3 to 12 characters long.")
  .isAlphanumeric()
  .withMessage("Display name must be alphanumeric.");

const firstName = body("firstName")
  .trim()
  .optional({ values: "null" })
  .matches(/^[A-Za-z ]+$/)
  .withMessage("First name must contain only letters and spaces.");

const lastName = body("lastName")
  .trim()
  .optional({ values: "null" })
  .matches(/^[A-Za-z ]+$/)
  .withMessage("Last name must contain only letters and spaces.");

const dateFormatErrorMsg = "Date must be a string of format YYYY-MM-DD.";

const birthDate = body("birthDate")
  .trim()
  .optional({ values: "null" })
  .isLength({ min: 10, max: 10 })
  .bail()
  .withMessage(dateFormatErrorMsg)
  .isDate({ format: "YYYY-MM-DD", strictMode: true })
  .withMessage(dateFormatErrorMsg);

const bio = body("bio")
  .trim()
  .optional({ values: "null" })
  .isLength({ max: 250 })
  .withMessage("Bio must be 250 characters or less.");

const sexAtBirth = body("sexAtBirth")
  .trim()
  .optional({ values: "null" })
  .isIn(["Male", "Female"])
  .withMessage("Sex at birth can only be Male or Female.");

const location = body("location").trim();

export const updateProfileValidator = [
  [displayName, firstName, lastName, birthDate, bio, sexAtBirth, location],
  validationErrorsMiddleware("Invalid profile input", "INVALID_INPUT"),
];
