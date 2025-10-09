import * as spaceQueries from "../db/spacesQueries.js";
import { createSpaceValidator } from "../validators/spacesValidator.js";

export async function indexGet(req, res) {
  const currentUserId = req.user.id;
  const spaces = await spaceQueries.getUserSpaces(currentUserId);
  res.json(spaces);
}

export const indexPost = [
  createSpaceValidator,
  async function (req, res) {
    const currentUserId = req.user.id;
    const name = req.body.name;
    const space = await spaceQueries.createSpace(currentUserId, name);
    res.json(space);
  },
];

export async function spacePostsGet(req, res) {
  const currentUserId = req.user.id;
  const name = decodeURIComponent(req.params.spaceName);
  const space = await spaceQueries.getSpacePosts(currentUserId, name);
  res.json(space);
}

export async function spaceUsersPut(req, res) {
  const currentUserId = req.user.id;
  const name = decodeURIComponent(req.params.spaceName);
  const userIds = req.body.userIds;
  const space = await spaceQueries.updateSpaceUsers(
    currentUserId,
    name,
    userIds
  );
  res.json(space);
}

export async function spaceDelete(req, res) {
  const currentUserId = req.user.id;
  const name = decodeURIComponent(req.params.spaceName);
  await spaceQueries.deleteSpace(currentUserId, name);
  res.json({});
}
