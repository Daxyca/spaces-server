import prisma from "./prisma.js";
import * as filters from "./filters.js";

export async function getMainSpacePosts(currentUserId) {
  return await prisma.post.findMany({
    where: {
      author: {
        OR: [
          {
            followers: {
              some: {
                followerId: currentUserId,
                status: "Accepted",
              },
            },
          },
          {
            id: currentUserId,
          },
        ],
      },
    },
    include: filters.POSTS_INCLUDE_FOR_FEED(currentUserId),
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createPost(currentUserId, content) {
  return await prisma.post.create({
    data: {
      content,
      authorId: currentUserId,
    },
    include: {
      author: filters.USER_SELECT,
    },
  });
}

// export async function getPost(postId) {}

export async function isPostAlreadyLiked(currentUserId, postId) {
  return await prisma.post.findFirst({
    where: {
      id: postId,
      likes: {
        some: {
          id: currentUserId,
        },
      },
    },
  });
}

export async function likePost(currentUserId, postId) {
  return await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      likes: {
        connect: {
          id: currentUserId,
        },
      },
    },
  });
}

export async function unlikePost(currentUserId, postId) {
  return await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      likes: {
        disconnect: {
          id: currentUserId,
        },
      },
    },
  });
}

export async function onPostCreateComment(authorId, postId, content) {
  return await prisma.comment.create({
    data: {
      authorId,
      postId,
      content,
    },
    include: {
      author: filters.USER_SELECT,
    },
  });
}

export async function deletePost(currentUserId, postId) {
  return await prisma.$transaction([
    prisma.comment.deleteMany({ where: { postId } }),
    prisma.post.delete({
      where: {
        id: postId,
        authorId: currentUserId,
      },
    }),
  ]);
}
