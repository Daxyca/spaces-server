import prisma from "./prisma.js";
import * as filters from "./filters.js";

export async function likeComment(currentUserId, commentId) {
  return await prisma.comment.update({
    where: {
      id: commentId,
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

export async function unlikeComment(currentUserId, commentId) {
  return await prisma.comment.update({
    where: {
      id: commentId,
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

export async function deleteComment(currentUserId, commentId) {
  return await prisma.comment.delete({
    where: {
      id: commentId,
      authorId: currentUserId,
    },
  });
}

export async function updateComment(currentUserId, commentId, content) {
  return await prisma.comment.update({
    where: {
      id: commentId,
      authorId: currentUserId,
    },
    data: {
      content,
    },
    include: {
      author: filters.USER_SELECT,
    },
  });
}
