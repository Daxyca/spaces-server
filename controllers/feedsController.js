import * as feedQueries from "../db/feedsQueries.js";

export async function indexGet(req, res) {
  const currentUserId = req.user.id;
  const feeds = await feedQueries.getUserFeeds(currentUserId);
  res.json(feeds);
}

export async function indexPost(req, res) {
  const currentUserId = req.user.id;
  const name = req.body.name;
  const feed = await feedQueries.createFeed(currentUserId, name);
  res.json(feed);
}

export async function feedPostsGet(req, res) {
  const currentUserId = req.user.id;
  const name = decodeURIComponent(req.params.feedName);
  const feed = await feedQueries.getFeedPosts(currentUserId, name);
  res.json(feed);
}

export async function feedUserPatch(req, res) {
  const currentUserId = req.user.id;
  const name = decodeURIComponent(req.params.feedName);
  const otherUserId = req.body.otherUserId;
  const feed = await feedQueries.addUserToFeed(
    currentUserId,
    name,
    otherUserId
  );
}
