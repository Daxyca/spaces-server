// import { execSync } from "child_process";
import prisma from "../db/prisma.js";

beforeAll(async () => {
  //   execSync("npx prisma migrate reset --force --skip-seed", {
  //     stdio: "inherit",
  //   });
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.feed.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.session.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
