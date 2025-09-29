import prisma from "./prisma.js";

const AUTHOR_SELECT = {
  select: {
    id: true,
    displayName: true,
  },
};

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
      author: AUTHOR_SELECT,
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
      comments: {
        include: {
          author: AUTHOR_SELECT,
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
  });
}
