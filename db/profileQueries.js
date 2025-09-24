import prisma from "./prisma.js";

export async function getUserProfile(userId) {
  return await prisma.profile.findFirst({
    where: {
      userId,
    },
  });
}

export async function createProfile(userId, profile = {}) {
  return await prisma.profile.create({
    data: {
      userId: userId,
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
      userId,
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
