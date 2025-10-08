import * as feedQueries from "../db/feedsQueries.js";
import { createFeedValidator } from "../validators/otherValidators.js";

export async function indexGet(req, res) {
  const currentUserId = req.user.id;
  const feeds = await feedQueries.getUserFeeds(currentUserId);
  res.json(feeds);
}

export const indexPost = [
  createFeedValidator,
  async function (req, res) {
    const currentUserId = req.user.id;
    const name = req.body.name;
    const feed = await feedQueries.createFeed(currentUserId, name);
    res.json(feed);
  },
];

export async function feedPostsGet(req, res) {
  const currentUserId = req.user.id;
  const name = decodeURIComponent(req.params.feedName);
  const feed = await feedQueries.getFeedPosts(currentUserId, name);
  res.json(feed);
}

export async function feedUsersPut(req, res) {
  const currentUserId = req.user.id;
  const name = decodeURIComponent(req.params.feedName);
  const userIds = req.body.userIds;
  const feed = await feedQueries.updateFeedUsers(currentUserId, name, userIds);
  res.json(feed);
}

export async function feedDelete(req, res) {
  const currentUserId = req.user.id;
  const name = decodeURIComponent(req.params.feedName);
  await feedQueries.deleteFeed(currentUserId, name);
  res.json({});
}
