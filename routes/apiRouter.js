import { Router } from "express";
import { authRouter } from "./authRouter.js";
import { profileRouter } from "./profileRouter.js";
import { followRouter } from "./followRouter.js";
import { postsRouter } from "./postsRouter.js";
import { feedsRouter } from "./feedRouter.js";
import { isAuth } from "../middleware/authMiddleware.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/profile", isAuth, profileRouter);
apiRouter.use("/follow", isAuth, followRouter);
apiRouter.use("/posts", isAuth, postsRouter);
apiRouter.use("/feeds", isAuth, feedsRouter);
