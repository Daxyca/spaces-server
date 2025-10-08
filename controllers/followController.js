import * as followQueries from "../db/followQueries.js";

export async function followingUserIdPost(req, res) {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;
  const follow = await followQueries.createFollow(currentUserId, otherUserId);
  res.json(follow);
}

export async function followerUserIdPatch(req, res) {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;
  const follow = await followQueries.updateFollowerToAccepted(
    currentUserId,
    otherUserId
  );
  res.json(follow);
}

export async function followingUserIdDelete(req, res) {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;
  await followQueries.deleteFollowing(currentUserId, otherUserId);
  res.json({ delete: true });
}

export async function followerUserIdDelete(req, res) {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;
  await followQueries.deleteFollower(currentUserId, otherUserId);
  res.json({ delete: true });
}

// Get Profiles

export async function followingGet(req, res) {
  const currentUserId = req.user.id;
  const follows = await followQueries.findFollowing(currentUserId);
  res.json({ follows });
}

export async function followersGet(req, res) {
  const currentUserId = req.user.id;
  const follows = await followQueries.findFollowers(currentUserId);
  res.json({ follows });
}

export async function followingRequestsGet(req, res) {
  const currentUserId = req.user.id;
  const follows = await followQueries.findFollowingRequests(currentUserId);
  res.json({ follows });
}

export async function followersRequestsGet(req, res) {
  const currentUserId = req.user.id;
  const follows = await followQueries.findFollowersRequests(currentUserId);
  res.json({ follows });
}

export async function notFollowingGet(req, res) {
  const currentUserId = req.user.id;
  const profilesNotFollowing =
    await followQueries.findNotFollowing(currentUserId);
  res.json({ profiles: profilesNotFollowing });
}
