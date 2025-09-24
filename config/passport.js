import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { getUserForLocalStrategy, getUserById } from "../db/authQueries.js";

const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await getUserForLocalStrategy(username);
    if (!user) {
      return done(null, false);
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (isValid === true) {
      return done(null, { id: user.id, username: user.username });
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err);
  }
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(strategy);
