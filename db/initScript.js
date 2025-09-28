import prisma from "./prisma.js";
import bcrypt from "bcryptjs";
import * as authQueries from "./authQueries.js";
import * as profileQueries from "./profileQueries.js";
import * as followQueries from "./followQueries.js";
import * as postQueries from "./postsQueries.js";
import { createRandomUser } from "../utils/faker.js";
import fs from "fs";

main();

async function main() {
  await clearTables();

  const NUMBER_OF_USERS = 6;
  const users = [];
  const profiles = [];
  const posts = [];

  // Users and Profiles
  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    const { user, profile } = await insertRandomUser(i === 0 ? "user" : null);
    const post = await postQueries.createPost(
      user.id,
      `The writer is ${user.username}`
    );
    users.push(user);
    profiles.push(profile);
    posts.push(post);
  }

  // Follows
  const follows = {
    sent: [],
    accepted: [],
    removed: [],

    otherSent: [],
    otherAccepted: [],
  };

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

  const statusToDelete = [
    "sent",
    // "accepted"
  ];
  for (const key of statusToDelete) {
    const removedFollow = await followQueries.deleteFollowing(
      follows[key][0].followerId,
      follows[key][0].followingId
    );
    follows.removed.push(removedFollow);
  }

  const findFollowing = await followQueries.findFollowing(users[0].id);
  const findFollowers = await followQueries.findFollowers(users[0].id);
  const findFollowingRequests = await followQueries.findFollowingRequests(
    users[0].id
  );
  const findFollowersRequests = await followQueries.findFollowersRequests(
    users[0].id
  );
  const findNotFollowing = await followQueries.findNotFollowing(users[0].id);

  // Posts
  const getMainFeedPosts = await postQueries.getMainFeedPosts(users[0].id);
  // postQueries.getPost
  // postQueries.likePost
  // postQueries.unlikePost
  // postQueries.onPostCreateComment

  writeObjToFile({
    fileName: "db/scriptResults.json",
    byQuery: {
      posts: {
        getMainFeedPosts: getMainFeedPosts,
        createPost: posts[0],
      },
      auth: {
        createUser: users[0],
        getUserByNameForLocalStrategy:
          await authQueries.getUserByNameForLocalStrategy(users[0].username),
        getUserByIdForSession: await authQueries.getUserByIdForSession(
          users[0].id
        ),
      },
      profile: {
        createProfile: profiles[0],
        getUserProfile: await profileQueries.getUserProfile(users[0].id),
        updateProfile: await profileQueries.updateProfile(users[0].id, {
          displayName: "ImUser",
        }),
      },
      follows: {
        createFollow: follows.sent[1],
        updateFollowToAccepted: follows.accepted[0],
        deleteFollowing: follows.removed[0],
        deleteAcceptedFollowing: follows.removed[1],
        findFollowing,
        findFollowingRequests,
        findFollowers,
        findFollowersRequests,
        findNotFollowing,
      },
    },
    afterQueries: {
      users,
      profiles,
      follows,
    },
  });
}

function writeObjToFile(obj) {
  const fileName = obj.fileName || "db/results.json";
  fs.writeFile(fileName, JSON.stringify(obj, undefined, 2), (err) => {
    if (err) {
      console.error("Error writing to file", err);
      return;
    }
    console.log("Saved results to file!");
  });
}

async function clearTables() {
  await prisma.session.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.feed.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database tables reset.");
}

async function insertRandomUser(username) {
  const userDetails = createRandomUser();
  const passwordHash = await bcrypt.hash("123", 10);
  const user = await authQueries.createUser(
    username || userDetails.username,
    passwordHash,
    userDetails.email
  );
  const profile = await profileQueries.createProfile(
    user.id,
    userDetails.profile
  );
  return { user, profile };
}
