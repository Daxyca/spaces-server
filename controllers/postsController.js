import * as postsQueries from "../db/postsQueries.js";

export async function postsGet(req, res) {
  const currentUserId = req.user.id;
  const posts = await postsQueries.getMainFeedPosts(currentUserId);
  res.json({ posts });
}

export async function postsPost(req, res) {
  const currentUserId = req.user.id;
  const content = req.body.content;
  const post = await postsQueries.createPost(currentUserId, content);
  res.json({ post });
}
