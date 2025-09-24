import { Router } from "express";
import * as authController from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/register", authController.authRegisterPost);
authRouter.get("/login", authController.authLoginGet);
authRouter.post("/login", authController.authLoginPost);
authRouter.delete("/logout", authController.authLogoutDelete);
