import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcryptjs";
import * as authQueries from "../db/authQueries.js";

const localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await authQueries.getUserByNameForLocalStrategy(username);
    if (!user) {
      return done(null, false);
    }
    const passwordHash = user.account[0].passwordHash;
    const isValid = bcrypt.compare(password, passwordHash);
    if (isValid === true) {
      return done(null, {
        id: user.id,
        username: user.username,
        displayName: user.profile.displayName,
      });
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err);
  }
});

const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.SERVER_BASE_URL + "/api/auth/github/callback",
    scope: ["user:email"],
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      const user = await authQueries.getUser(profile.emails[0].value);
      if (user) {
        return done(null, user);
      }
      const account = {
        provider: profile.provider,
        providerUserId: profile.id,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
        displayName: profile.displayName || profile.username,
      };
      const createdUser = await authQueries.createAccount(account);
      return done(null, createdUser);
    } catch (err) {
      return done(err);
    }
  }
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await authQueries.getUserByIdForSession(id);
    done(null, {
      id: user.id,
      username: user.username,
      displayName: user.profile.displayName,
    });
  } catch (err) {
    done(err);
  }
});

passport.use(localStrategy);
passport.use(githubStrategy);
