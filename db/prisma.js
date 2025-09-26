import { PrismaClient } from "../generated/prisma/index.js";
import process from "process";

const omitConfig = {
  user: {
    passwordHash: true,
    createdAt: true,
    email: true,
  },
};

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  omit: omitConfig,
});

export default prisma;
