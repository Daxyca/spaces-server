import { PrismaClient } from "../generated/prisma/index.js";

const omitConfig = {
  user: {
    passwordHash: true,
  },
};

const prisma = new PrismaClient({ omit: omitConfig });

export default prisma;
