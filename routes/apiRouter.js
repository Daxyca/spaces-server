import { Router } from "express";
import { authRouter } from "./authRouter.js";
import { profileRouter } from "./profileRouter.js";
import { followRouter } from "./followRouter.js";
import { postsRouter } from "./postsRouter.js";
import { spacesRouter } from "./spaceRouter.js";
import { commentsRouter } from "./commentsRouter.js";
import { isAuth } from "../middleware/authMiddleware.js";

export const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ready",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});
apiRouter.use("/auth", authRouter);
apiRouter.use("/profile", isAuth, profileRouter);
apiRouter.use("/follow", isAuth, followRouter);
apiRouter.use("/posts", isAuth, postsRouter);
apiRouter.use("/spaces", isAuth, spacesRouter);
apiRouter.use("/comments", isAuth, commentsRouter);
