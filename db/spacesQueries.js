import prisma from "./prisma.js";
import * as filters from "./filters.js";

export async function getUserSpaces(currentUserId) {
  return await prisma.space.findMany({
    where: {
      authorId: currentUserId,
    },
    include: {
      users: filters.USER_SELECT,
    },
  });
}

export async function getSpacePosts(currentUserId, spaceName) {
  return await prisma.post.findMany({
    where: {
      author: {
        spacesIncluded: {
          some: {
            authorId: currentUserId,
            name: spaceName,
          },
        },
      },
    },
    include: filters.POSTS_INCLUDE_FOR_FEED(currentUserId),
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createSpace(currentUserId, spaceName) {
  return await prisma.space.create({
    data: {
      authorId: currentUserId,
      name: spaceName || null,
    },
    include: {
      users: filters.USER_SELECT,
    },
  });
}

export async function updateSpaceUsers(currentUserId, spaceName, userIds) {
  return await prisma.space.update({
    where: {
      authorId_name: {
        authorId: currentUserId,
        name: spaceName,
      },
    },
    data: {
      name: spaceName,
      users: {
        set: userIds.map((id) => ({ id })),
      },
    },
  });
}

export async function deleteSpace(currentUserId, spaceName) {
  return await prisma.space.delete({
    where: {
      authorId_name: {
        authorId: currentUserId,
        name: spaceName,
      },
    },
  });
}
