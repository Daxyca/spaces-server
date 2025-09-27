import prisma from "./prisma.js";

const FOLLOW_SELECT = {
  select: {
    id: true,
    displayName: true,
    picture: true,
    firstName: true,
    lastName: true,
  },
};

export async function createFollow(currentUserId, otherUserId) {
  return await prisma.follow.create({
    data: {
      followerId: currentUserId,
      followingId: otherUserId,
    },
  });
}

export async function updateFollowToAccepted(currentUserId, otherUserId) {
  return await prisma.follow.update({
    where: {
      followerId_followingId: {
        followingId: currentUserId,
        followerId: otherUserId,
      },
    },
    data: {
      status: "Accepted",
    },
  });
}

export async function deleteFollowing(currentUserId, otherUserId) {
  return await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: otherUserId,
      },
    },
  });
}

export async function findFollowing(currentUserId) {
  return await prisma.follow.findMany({
    where: {
      followerId: currentUserId,
      status: "Accepted",
    },
    include: {
      following: FOLLOW_SELECT,
    },
  });
}

export async function findFollowers(currentUserId) {
  return await prisma.follow.findMany({
    where: {
      followingId: currentUserId,
      status: "Accepted",
    },
    include: {
      follower: FOLLOW_SELECT,
    },
  });
}

export async function findFollowingRequests(currentUserId) {
  return await prisma.follow.findMany({
    where: {
      followerId: currentUserId,
      status: "Pending",
    },
    include: {
      following: FOLLOW_SELECT,
    },
  });
}

export async function findFollowersRequests(currentUserId) {
  return await prisma.follow.findMany({
    where: {
      followingId: currentUserId,
      status: "Pending",
    },
    include: {
      follower: FOLLOW_SELECT,
    },
  });
}

export async function findNotFollowing(currentUserId) {
  return await prisma.profile.findMany({
    where: {
      id: {
        not: currentUserId,
      },
      followers: {
        none: { followingId: currentUserId },
      },
    },
    ...FOLLOW_SELECT,
  });
}
