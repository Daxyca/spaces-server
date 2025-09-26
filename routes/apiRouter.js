import { Router } from "express";
import { authRouter } from "./authRouter.js";
import { profileRouter } from "./profileRouter.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { followRouter } from "./followRouter.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/profile", isAuth, profileRouter);
apiRouter.use("/follow", isAuth, followRouter);
