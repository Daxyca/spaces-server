import * as commentsController from "../controllers/commentsController.js";
import { Router } from "express";

export const commentsRouter = Router();

commentsRouter.put("/:commentId", commentsController.commentIdPut);
commentsRouter.delete("/:commentId", commentsController.commentIdDelete);

// Like

commentsRouter.post("/:commentId/like", commentsController.commentIdLikePost);
commentsRouter.delete(
  "/:commentId/like",
  commentsController.commentIdLikeDelete
);
