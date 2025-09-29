import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { isAuth } from "../middleware/authMiddleware.js";

export const authRouter = Router();

authRouter.post("/register", authController.registerPost);
authRouter.post("/login", authController.loginPost);

authRouter.use(isAuth);

authRouter.get("/login", authController.loginGet);
authRouter.delete("/logout", authController.logoutDelete);
