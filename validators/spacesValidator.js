import { body } from "express-validator";
import validationErrorsMiddleware from "./validationErrorsMiddleware.js";

const space = body("name")
  .trim()
  .isLength({ min: 3, max: 12 })
  .withMessage("Space name must be 3 to 12 characters long.");

export const createSpaceValidator = [
  [space],
  validationErrorsMiddleware("Invalid space input", "INVALID_INPUT"),
];
