import prisma from "./prisma.js";

export async function createUser(username, passwordHash, email) {
  return await prisma.user.create({
    data: {
      username,
      email,
      account: {
        create: { provider: "local", passwordHash },
      },
      profile: {
        create: {
          displayName: username,
        },
      },
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
      profile: {
        select: {
          displayName: true,
        },
      },
      account: {
        where: {
          provider: "local",
        },
        select: {
          passwordHash: true,
        },
      },
    },
  });
}

export async function getUserByIdForSession(id) {
  return await prisma.user.findUnique({
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

export async function getUser(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      profile: true,
    },
  });
}

export async function createAccount(account) {
  return await prisma.user.create({
    data: {
      email: account.email,
      account: {
        create: {
          provider: account.provider,
          providerUserId: account.providerUserId,
        },
      },
      profile: {
        create: {
          displayName: account.displayName,
          picture: account.picture,
        },
      },
    },
    include: {
      account: true,
      profile: {
        select: {
          displayName: true,
          picture: true,
        },
      },
    },
  });
}
