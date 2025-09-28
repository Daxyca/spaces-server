import prisma from "./prisma.js";

export async function getMainFeedPosts(currentUserId) {
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
    include: {
      author: true,
      _count: {
        select: {
          likes: true,
        },
      },
      likes: {
        where: {
          id: currentUserId,
        },
      },
    },
  });
}

export async function createPost(currentUserId, content) {
  return await prisma.post.create({
    data: {
      content,
      authorId: currentUserId,
    },
  });
}

export async function getPost(postId) {}

export async function likePost(postId) {}

export async function unlikePost(postId) {}

export async function onPostCreateComment(postId) {}
