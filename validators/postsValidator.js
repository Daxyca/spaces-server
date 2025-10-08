import { body } from "express-validator";
import validationErrorsMiddleware from "./validationErrorsMiddleware.js";

const post = body("content")
  .trim()
  .notEmpty()
  .withMessage("Post must not be empty or whitespaces only.")
  .isLength({ max: 1000 })
  .withMessage("Post must be 1000 characters or less.");

export const createPostValidator = [
  [post],
  validationErrorsMiddleware("Invalid post content", "INVALID_INPUT"),
];
