export function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    const err = new Error("Not logged in");
    err.code = "NOT_AUTHENTICATED";
    err.status = 401;
    return next(err);
  }
}
