import prisma from "./prisma.js";

export async function createUser(username, passwordHash, email) {
  return await prisma.user.create({
    data: {
      username,
      passwordHash,
      email,
    },
  });
}

export async function getUserByNameForLocalStrategy(username) {
  return await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      passwordHash: true,
    },
  });
}

export async function getUserByIdForSession(id) {
  return await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      profile: {
        select: {
          displayName: true,
        },
      },
    },
  });
}
