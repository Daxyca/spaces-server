import { validationResult } from "express-validator";

export default function validationErrorsMiddleware(errorFunction) {
  return async (req, res, next) => {
    // Catch validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errorFunction();
      err.status = 400;
      err.errors = errors.array();
      return next(err);
    }
    next();
  };
}
