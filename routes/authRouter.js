import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { isAuth } from "../middleware/authMiddleware.js";
import passport from "passport";
import process from "process";
import jwt from "jsonwebtoken";
import { getUserByIdForSession } from "../db/authQueries.js";

export const authRouter = Router();

authRouter.post("/register", authController.registerPost);
authRouter.post("/login", authController.loginPost);

// Github
authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: process.env.CLIENT_REDIRECT_URL + "auth/login",
  }),
  function (req, res) {
    console.log("Session ID created:", req.sessionID);
    console.log("Session data:", req.session);
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
      }
      console.log("Session saved, ID:", req.sessionID);
      res.redirect(process.env.CLIENT_REDIRECT_URL);
    });
  }
);

authRouter.use(isAuth);

authRouter.get("/login", authController.loginGet);
authRouter.delete("/logout", authController.logoutDelete);
