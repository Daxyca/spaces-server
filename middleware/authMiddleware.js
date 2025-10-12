export function isAuth(req, res, next) {
  console.log("Received session ID:", req.sessionID);
  console.log("Session data:", req.session);
  console.log("Raw cookie header:", req.headers.cookie);
  if (req.isAuthenticated()) {
    next();
  } else {
    const err = new Error("Not logged in");
    err.code = "NOT_AUTHENTICATED";
    err.status = 401;
    return next(err);
  }
}
