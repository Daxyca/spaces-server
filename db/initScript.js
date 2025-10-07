import prisma from "./prisma.js";
import bcrypt from "bcryptjs";
import * as authQueries from "./authQueries.js";
import * as followQueries from "./followQueries.js";
import * as postQueries from "./postsQueries.js";
import * as feedQueries from "./feedsQueries.js";
import * as generate from "../utils/faker.js";
import fs from "fs";

const PASSWORD_HASH = await bcrypt.hash("123", 10);

main();

async function main() {
  await clearTables();

  const NUMBER_OF_USERS = 30;
  const users = [];
  const follows = {
    sent: [],
    accepted: [],
    removed: [],

    otherSent: [],
    otherAccepted: [],
  };
  const followStatusToDelete = ["sent", "accepted"];

  // Users
  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    const user = await insertRandomUser(i === 0 ? "user" : null, PASSWORD_HASH);
    users.push(user);
  }

  // Posts, self-comments, self-likes
  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    const user = users[i];
    user._posts = [];
    user._comments = [];
    user._postLikes = [];
    for (let i = 0; i < 2; i++) {
      const post = await postQueries.createPost(
        user.id,
        `${generate.randomPostContent()}\n\n-${user.username}`
      );
      const comment = await postQueries.onPostCreateComment(
        user.id,
        post.id,
        `Thanks for reading my post!\n-${user.username}`
      );
      const postLike = await postQueries.likePost(user.id, post.id);
      user._posts.push(post);
      user._comments.push(comment);
      user._postLikes.push(postLike);
    }
  }

  // Feeds
  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    const user = users[i];
    user._feeds = [];
    const commonFeed = await feedQueries.createFeed(user.id, "First Feed");
    const customFeed = await feedQueries.createFeed(
      user.id,
      user.username + "'s Feed"
    );
    user._feeds.push(commonFeed);
    user._feeds.push(customFeed);
  }

  // Follows
  for (let i = 1; i < NUMBER_OF_USERS - 1; i++) {
    const user = users[i];
    const sentFollow = await followQueries.createFollow(users[0].id, user.id);
    follows.sent.push(sentFollow);
    if (i % 2 === 0) {
      const acceptedFollow = await followQueries.updateFollowToAccepted(
        user.id,
        users[0].id
      );
      follows.accepted.push(acceptedFollow);
    }

    const otherSentFollow = await followQueries.createFollow(
      user.id,
      users[0].id
    );
    follows.otherSent.push(otherSentFollow);
    if (i % 2 === 0) {
      const otherAcceptedFollow = await followQueries.updateFollowToAccepted(
        users[0].id,
        user.id
      );
      follows.otherAccepted.push(otherAcceptedFollow);
    }
  }

  // Remove one follow
  for (const key of followStatusToDelete) {
    const removedFollow = await followQueries.deleteFollowing(
      follows[key][0].followerId,
      follows[key][0].followingId
    );
    follows.removed.push(removedFollow);
  }

  // Add Users to Feeds
  const userFollowers = await followQueries.findFollowers(users[0].id);
  users[0]._addToCommonFeed = await feedQueries.updateFeedUsers(
    users[0].id,
    users[0]._feeds[0].name,
    userFollowers.map((follow) => follow.followerId)
  );
  users[0]._addToCustomFeed = await feedQueries.updateFeedUsers(
    users[0].id,
    users[0]._feeds[1].name,
    userFollowers
      .filter((el, i) => i % 2 === 1)
      .map((follow) => follow.followerId)
  );

  const queryResults = {
    NUMBER_OF_USERS,
    users,
    follows,
  };

  writeObjToFile({
    fileName: "db/queryResults.json",
    queryResults,
  });
}

export function writeObjToFile(obj, path) {
  const fileName = path || obj.fileName || "db/queryResults.json";
  fs.writeFile(
    fileName,
    JSON.stringify(obj.queryResults, undefined, 2),
    (err) => {
      if (err) {
        console.error("Error writing to file", err);
        return;
      }
      console.log("Saved results to file!");
    }
  );
}

async function clearTables() {
  await prisma.session.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.feed.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.account.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database tables reset.");
}

async function insertRandomUser(username, passwordHash) {
  const userDetails = generate.randomUser();
  const user = await authQueries.createUser(
    username || userDetails.username,
    passwordHash,
    userDetails.email
  );
  return user;
}
