import prisma from "./prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.feed.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database reset.");

  const initProfile = {
    displayName: "displayName",
    firstName: "firstName",
    lastName: "lastName",
    birthDate: new Date(),
    bio: "I'm a user.",
    sexAtBirth: "Male",
    location: "US",
  };
  const passwordHash = await bcrypt.hash("123", 10);
  await prisma.user.create({
    data: {
      username: "user",
      passwordHash,
      email: "user@user.com",
      profile: {
        create: initProfile,
      },
    },
  });
  await prisma.user.create({
    data: {
      username: "david",
      passwordHash,
      email: "david@david.com",
      profile: {
        create: initProfile,
      },
    },
  });
  const users = await prisma.user.findMany();
  const profiles = await prisma.profile.findMany();
  const follows = await prisma.follow.findMany();
  console.log(users);
  console.log(profiles);
  console.log(follows);
}

main();
