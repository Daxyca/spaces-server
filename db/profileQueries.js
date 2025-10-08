import prisma from "./prisma.js";
import * as filters from "./filters.js";

export async function getUserProfile(currentUserId, otherUserId) {
  if (!otherUserId) {
    otherUserId = currentUserId;
  }
  return await prisma.profile.findFirst({
    where: {
      id: otherUserId,
    },
    include: {
      posts: { include: filters.POSTS_INCLUDE_FOR_FEED(currentUserId) },
      followers: {
        where: {
          followerId: currentUserId,
        },
      },
      following: {
        where: {
          followingId: currentUserId,
        },
      },
    },
  });
}

export async function createProfile(userId, profile = {}) {
  return await prisma.profile.create({
    data: {
      id: userId,
      displayName: profile.displayName,
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthDate: profile.birthDate,
      bio: profile.bio,
      sexAtBirth: profile.sexAtBirth,
      location: profile.location,
    },
  });
}

export async function updateProfile(userId, profile = {}) {
  return await prisma.profile.update({
    where: {
      id: userId,
    },
    data: {
      displayName: profile.displayName,
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthDate: profile.birthDate,
      bio: profile.bio,
      sexAtBirth: profile.sexAtBirth,
      location: profile.location,
    },
  });
}

export async function updateProfilePicture(userId, imagePath) {
  return await prisma.profile.update({
    where: {
      id: userId,
    },
    data: {
      picture: imagePath,
    },
    select: {
      picture: true,
    },
  });
}

export async function getPreviousProfilePicture(userId) {
  return await prisma.profile.findUnique({
    where: {
      id: userId,
    },
    select: {
      picture: true,
    },
  });
}
