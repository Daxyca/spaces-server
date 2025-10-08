import { body } from "express-validator";
import validationErrorsMiddleware from "./validationErrorsMiddleware.js";

const feed = body("name")
  .trim()
  .isLength({ min: 3, max: 12 })
  .withMessage("Feed name must be 3 to 12 characters long.");

const createFeedError = () => {
  const err = new Error("Invalid feed name");
  err.code = "INVALID_FEED_NAME";
  return err;
};

export const createFeedValidator = [
  [feed],
  validationErrorsMiddleware(createFeedError),
];
