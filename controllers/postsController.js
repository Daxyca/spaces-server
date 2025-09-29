import * as postsQueries from "../db/postsQueries.js";

export async function indexGet(req, res) {
  const currentUserId = req.user.id;
  const posts = await postsQueries.getMainFeedPosts(currentUserId);
  res.json({ posts });
}

export async function indexPost(req, res) {
  const currentUserId = req.user.id;
  const content = req.body.content;
  const post = await postsQueries.createPost(currentUserId, content);
  res.json({ post });
}

export async function postIdLikeGet(req, res) {
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

export async function postIdCommentsPost(req, res) {
  const currentUserId = req.user.id;
  const postId = req.params.postId;
  const content = req.body.content;
  const comment = await postsQueries.onPostCreateComment(
    currentUserId,
    postId,
    content
  );
  res.json({ comment });
}
