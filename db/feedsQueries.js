import prisma from "./prisma.js";
import * as filters from "./filters.js";

export async function getUserFeeds(currentUserId) {
  return await prisma.feed.findMany({
    where: {
      authorId: currentUserId,
    },
    include: {
      users: {
        select: {
          id: true,
          displayName: true,
        },
      },
    },
  });
}

export async function getFeedPosts(currentUserId, feedName) {
  return await prisma.post.findMany({
    where: {
      author: {
        feedsIncluded: {
          some: {
            authorId: currentUserId,
            name: feedName,
          },
        },
      },
    },
    include: filters.POSTS_INCLUDE_FOR_FEED(currentUserId),
  });

  return await prisma.feed.findFirst({
    where: {
      authorId: currentUserId,
      name: feedName,
    },
    include: {
      users: {
        select: {
          posts: {
            include: filters.POSTS_INCLUDE_FOR_FEED(currentUserId),
          },
        },
      },
    },
  });
}

export async function createFeed(currentUserId, feedName) {
  return await prisma.feed.create({
    data: {
      authorId: currentUserId,
      name: feedName,
    },
  });
}

export async function addUserToFeed(currentUserId, feedName, otherUserId) {
  return await prisma.feed.update({
    where: {
      authorId_name: {
        authorId: currentUserId,
        name: feedName,
      },
    },
    data: {
      users: {
        connect: {
          id: otherUserId,
        },
      },
    },
  });
}
