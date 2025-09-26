import * as followQueries from "../db/followQueries.js";

export async function followUserPost(req, res) {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;
  const follow = await followQueries.createFollow(currentUserId, otherUserId);
  res.json({ follow });
}

export async function followUserPatch(req, res) {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;
  await followQueries.updateFollow(currentUserId, otherUserId);
  res.json({ follow: true });
}

export async function followUserDelete(req, res) {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;
  await followQueries.deleteFollowing(currentUserId, otherUserId);
  res.json({ delete: true });
}

export async function followFollowingGet(req, res) {
  const currentUserId = req.user.id;
  const follows = await followQueries.findFollowing(currentUserId);
  res.json({ follows });
}

export async function followFollowersGet(req, res) {
  const currentUserId = req.user.id;
  const follows = await followQueries.findFollowers(currentUserId);
  res.json({ follows });
}

export async function followRequestsGet(req, res) {
  const currentUserId = req.user.id;
  const follows = await followQueries.findFollowingRequests(currentUserId);
  res.json({ follows });
}

export async function followNotFollowingGet(req, res) {
  const currentUserId = req.user.id;
  const profilesNotFollowing =
    await followQueries.findNotFollowing(currentUserId);
  res.json({ profiles: profilesNotFollowing });
}
