import { Router } from "express";
import { authRouter } from "./authRouter.js";
import { profileRouter } from "./profileRouter.js";
import { isAuth } from "../middleware/authMiddleware.js";
import { followRouter } from "./followRouter.js";
import { postsRouter } from "./postsRouter.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);

apiRouter.use(isAuth);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/follow", followRouter);
apiRouter.use("/posts", postsRouter);
