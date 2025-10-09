import * as postsQueries from "../db/postsQueries.js";
import { createPostValidator } from "../validators/postsValidator.js";
import { createCommentValidator } from "../validators/commentsValidator.js";
import { matchedData } from "express-validator";

export async function indexGet(req, res) {
  const currentUserId = req.user.id;
  const posts = await postsQueries.getMainSpacePosts(currentUserId);
  res.json(posts);
}

export const indexPost = [
  createPostValidator,
  async function (req, res) {
    const data = matchedData(req);
    const currentUserId = req.user.id;
    const content = data.content;
    const post = await postsQueries.createPost(currentUserId, content);
    res.json(post);
  },
];

export async function postIdLikeGet(req, res) {
  const currentUserId = req.user.id;
  const postId = req.params.postId;
  const isPostAlreadyLiked = await postsQueries.isPostAlreadyLiked(
    currentUserId,
    postId
  );
  if (isPostAlreadyLiked) {
    return res.json({ alreadyLiked: true });
  }
  return res.json({ alreadyLiked: false });
}

export async function postIdLikePost(req, res) {
  const currentUserId = req.user.id;
  const postId = req.params.postId;
  await postsQueries.likePost(currentUserId, postId);
  res.json({ like: true });
}

export async function postIdLikeDelete(req, res) {
  const currentUserId = req.user.id;
  const postId = req.params.postId;
  await postsQueries.unlikePost(currentUserId, postId);
  res.json({ unlike: true });
}

export const postIdCommentsPost = [
  createCommentValidator,
  async function (req, res) {
    const data = matchedData(req);
    const currentUserId = req.user.id;
    const postId = req.params.postId;
    const content = data.content;
    const comment = await postsQueries.onPostCreateComment(
      currentUserId,
      postId,
      content
    );
    res.json(comment);
  },
];

export async function postIdDelete(req, res, next) {
  const currentUserId = req.user.id;
  const postId = req.params.postId;
  try {
    const [_, post] = await postsQueries.deletePost(currentUserId, postId);
    res.json({ post });
  } catch (err) {
    return next(err);
  }
}
