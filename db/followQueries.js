import prisma from "./prisma.js";

export async function createFollow(currentUserId, otherUserId) {
  return await prisma.follow.create({
    data: {
      followerId: currentUserId,
      followingId: otherUserId,
    },
  });
}

export async function updateFollow(currentUserId, otherUserId) {
  return await prisma.follow.update({
    where: {
      followerId: currentUserId,
      followingId: otherUserId,
    },
    data: {
      status: "Accepted",
    },
  });
}

export async function deleteFollowing(currentUserId, otherUserId) {
  return await prisma.follow.delete({
    where: {
      followerId: currentUserId,
      followingId: otherUserId,
    },
  });
}

export async function findFollowing(currentUserId) {
  return await prisma.follow.findMany({
    where: {
      followingId: currentUserId,
      status: "Accepted",
    },
    include: {
      following: true,
    },
  });
}

export async function findFollowers(currentUserId) {
  return await prisma.follow.findMany({
    where: {
      followerId: currentUserId,
      status: "Accepted",
    },
    include: {
      follower: true,
    },
  });
}

export async function findFollowingRequests(currentUserId) {
  return await prisma.follow.findMany({
    where: {
      followingId: currentUserId,
      status: "Pending",
    },
    include: {
      following: true,
    },
  });
}

export async function findNotFollowing(currentUserId) {
  return await prisma.profile.findMany({
    where: {
      userId: {
        not: currentUserId,
      },
      follower: {
        none: { id: currentUserId },
      },
    },
  });
}
