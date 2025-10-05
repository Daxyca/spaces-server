export const USER_SELECT = {
  select: {
    id: true,
    displayName: true,
    picture: true,
  },
};

export const POSTS_INCLUDE_FOR_FEED = (currentUserId) => {
  return {
    author: USER_SELECT,
    _count: {
      select: {
        likes: true,
      },
    },
    likes: {
      where: {
        id: currentUserId,
      },
      select: {
        id: true,
      },
    },
    comments: {
      include: {
        author: USER_SELECT,
      },
    },
  };
};
