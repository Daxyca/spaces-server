import { validationResult } from "express-validator";

export default function validationErrorsMiddleware(
  errorMsg = "Unexpected error",
  errorCode = "UNEXPECTED_ERROR"
) {
  return async (req, res, next) => {
    // Catch validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error(errorMsg);
      err.code = errorCode;
      err.status = 400;
      err.errors = errors.array();
      return next(err);
    }
    next();
  };
}
