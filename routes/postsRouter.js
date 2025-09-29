import * as postsController from "../controllers/postsController.js";
import { Router } from "express";

export const postsRouter = Router();

postsRouter.get("/", postsController.indexGet);
postsRouter.post("/", postsController.indexPost);
postsRouter.post("/:postId/like", postsController.postIdLikePost);
postsRouter.delete("/:postId/like", postsController.postIdLikeDelete);
postsRouter.post("/:postId/comments", postsController.postIdCommentsPost);
