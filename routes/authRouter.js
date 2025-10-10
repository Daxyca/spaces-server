import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { isAuth } from "../middleware/authMiddleware.js";
import passport from "passport";
import process from "process";

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
    failureRedirect:
      (process.env.CLIENT_REDIRECT_URL || process.env.CLIENT_BASE_URL) +
      "/auth/login",
  }),
  function (req, res) {
    res.redirect(
      process.env.CLIENT_REDIRECT_URL || process.env.CLIENT_BASE_URL
    );
  }
);

authRouter.use(isAuth);

authRouter.get("/login", authController.loginGet);
authRouter.delete("/logout", authController.logoutDelete);
