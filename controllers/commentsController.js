import * as commentsQueries from "../db/commentsQueries.js";
import { commentValidator } from "../validators/commentsValidator.js";
import { matchedData } from "express-validator";

export async function commentIdLikePost(req, res) {
  const currentUserId = req.user.id;
  const commentId = req.params.commentId;
  await commentsQueries.likeComment(currentUserId, commentId);
  res.json({ like: true });
}

export async function commentIdLikeDelete(req, res) {
  const currentUserId = req.user.id;
  const commentId = req.params.commentId;
  await commentsQueries.unlikeComment(currentUserId, commentId);
  res.json({ unlike: true });
}

export async function commentIdDelete(req, res, next) {
  const currentUserId = req.user.id;
  const commentId = req.params.commentId;
  try {
    const comment = await commentsQueries.deleteComment(
      currentUserId,
      commentId
    );
    res.json({ comment });
  } catch (err) {
    return next(err);
  }
}

export const commentIdPut = [
  commentValidator,
  async function (req, res, next) {
    const data = matchedData(req);
    const currentUserId = req.user.id;
    const commentId = req.params.commentId;
    const content = data.content;
    try {
      const comment = await commentsQueries.updateComment(
        currentUserId,
        commentId,
        content
      );
      res.json(comment);
    } catch (err) {
      return next(err);
    }
  },
];
