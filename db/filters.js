export const AUTHOR_SELECT = {
  select: {
    id: true,
    displayName: true,
    picture: true,
  },
};

export const POSTS_INCLUDE_FOR_FEED = (currentUserId) => {
  return {
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
  };
};
