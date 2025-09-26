import passport from "passport";
import bcrypt from "bcryptjs";
import * as authQueries from "../db/authQueries.js";
import * as profileQueries from "../db/profileQueries.js";

export async function authRegisterPost(req, res) {
  const { username, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await authQueries.createUser(username, passwordHash, email);
  const profile = await profileQueries.createProfile(user.id, {
    displayName: user.username,
  });
  res.status(201).json({ data: user });
}

export function authLoginGet(req, res, next) {
  if (req.isAuthenticated()) {
    res.json({ data: req.user });
  } else {
    const err = new Error("Not logged in");
    err.code = "NOT_AUTHENTICATED";
    err.status = 401;
    return next(err);
  }
}

export function authLoginPost(req, res, next) {
  passport.authenticate("local", (err, user, info, status) => {
    if (err) return next(err);
    if (!user) {
      const err = new Error("Invalid username or password");
      err.code = "INVALID_CREDENTIALS";
      err.status = 401;
      return next(err);
    }
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ data: user });
    });
  })(req, res, next);
}

export function authLogoutDelete(req, res, next) {
  const notLoggedIn = () => {
    const err = new Error("Not logged in");
    err.code = "NOT_AUTHENTICATED";
    err.status = 401;
    return next(err);
  };
  if (!req.user) {
    return notLoggedIn();
  }
  req.logout((err) => {
    if (err) {
      return notLoggedIn();
    } else {
      res.json({ message: "Logged out successfully" });
    }
  });
}
