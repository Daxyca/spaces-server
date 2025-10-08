import { body } from "express-validator";
import validationErrorsMiddleware from "./validationErrorsMiddleware.js";

const comment = body("content")
  .trim()
  .notEmpty()
  .withMessage("Comment must not be empty or whitespaces only.")
  .isLength({ max: 250 })
  .withMessage("Comment must be 250 characters or less.");

export const createCommentValidator = [
  [comment],
  validationErrorsMiddleware("Invalid comment content", "INVALID_INPUT"),
];
