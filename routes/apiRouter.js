import { Router } from "express";
import { authRouter } from "./authRouter.js";
import { profileRouter } from "./profileRouter.js";
import { isAuth } from "../controllers/authController.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/profile", isAuth, profileRouter);
