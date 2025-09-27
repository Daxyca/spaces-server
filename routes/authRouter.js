import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { isAuth } from "../middleware/authMiddleware.js";

export const authRouter = Router();

authRouter.post("/register", authController.authRegisterPost);
authRouter.post("/login", authController.authLoginPost);

authRouter.use(isAuth);

authRouter.get("/login", authController.authLoginGet);
authRouter.delete("/logout", authController.authLogoutDelete);
