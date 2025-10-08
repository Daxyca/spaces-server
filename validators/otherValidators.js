import { body } from "express-validator";
import validationErrorsMiddleware from "./validationErrorsMiddleware.js";

const feed = body("name")
  .trim()
  .isLength({ min: 3, max: 12 })
  .withMessage("Feed name must be 3 to 12 characters long.");

const createFeedError = () => {
  const err = new Error("Invalid feed input");
  err.code = "INVALID_INPUT";
  return err;
};

export const createFeedValidator = [
  [feed],
  validationErrorsMiddleware(createFeedError),
];
