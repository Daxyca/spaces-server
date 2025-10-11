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
    const user = req.user;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2m",
    });
    const redirectUrl = new URL(
      process.env.CLIENT_REDIRECT_URL + "auth/callback"
    );
    redirectUrl.searchParams.set("token", token);
    res.redirect(redirectUrl.toString());
  }
);

authRouter.post("/complete", async (req, res, next) => {
  try {
    const { token } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await getUserByIdForSession(payload.id);

    req.login(user, (err) => {
      if (err) throw err;
      return res.json({ success: true });
    });
  } catch (err) {
    const clientErr = new Error("Authentication error");
    clientErr.code = "AUTH_COMPLETION_ERROR";
    clientErr.status = 401;
    clientErr.details = err;
    next(clientErr);
  }
});

authRouter.use(isAuth);

authRouter.get("/login", authController.loginGet);
authRouter.delete("/logout", authController.logoutDelete);
