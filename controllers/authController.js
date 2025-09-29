import passport from "passport";
import bcrypt from "bcryptjs";
import * as authQueries from "../db/authQueries.js";
import * as profileQueries from "../db/profileQueries.js";

export async function registerPost(req, res) {
  const { username, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await authQueries.createUser(username, passwordHash, email);
  const profile = await profileQueries.createProfile(user.id, {
    displayName: user.username,
  });
  res.status(201).json({ data: user });
}

export function loginPost(req, res, next) {
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

export function loginGet(req, res, next) {
  const user = req.user;
  res.json({
    data: {
      username: user.username,
      id: user.id,
      displayName: user.displayName,
    },
  });
}

export function logoutDelete(req, res, next) {
  req.logout((err) => {
    if (err) {
      const err = new Error("Not logged in");
      err.code = "NOT_AUTHENTICATED";
      err.status = 401;
      return next(err);
    } else {
      res.json({ message: "Logged out successfully" });
    }
  });
}
