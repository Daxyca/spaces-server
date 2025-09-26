import * as authQueries from "../db/authQueries.js";
import passport from "passport";
import bcrypt from "bcryptjs";
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

export function authLoginGet(req, res) {
  if (req.isAuthenticated()) {
    res.json({ user: { id: req.user.id, username: req.user.username } });
  } else {
    res.json({ user: null });
  }
}

export function authLoginPost(req, res, next) {
  passport.authenticate("local", (err, user, info, status) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ login: false, message: "Wrong credentials!" });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ login: true, message: "Logged in successfully!", user });
    });
  })(req, res, next);
}

export function authLogoutDelete(req, res, next) {
  if (!req.user) {
    return res.json({ logout: false, message: "Already logged out." });
  }
  req.logout((err) => {
    if (err) {
      // console.error(err);
      res.json({ logout: false, message: "Already logged out!" });
    } else {
      res.json({ logout: true, message: "Logged out successfully!" });
    }
  });
}
