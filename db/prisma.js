import { PrismaClient } from "../generated/prisma/index.js";
import process from "process";

const omitConfig = {
  user: {
    email: true,
    createdAt: true,
    updatedAt: true,
  },
  account: {
    passwordHash: true,
    createdAt: true,
    updatedAt: true,
  },
};

const databaseUrl = process.env.NODE_ENV.startsWith("dev")
  ? process.env.DEVELOPMENT_DATABASE_URL
  : process.env.NODE_ENV === "test"
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
