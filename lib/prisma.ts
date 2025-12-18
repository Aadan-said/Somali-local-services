import { PrismaClient } from "../prisma/generated-client";

const globalForPrisma = global as unknown as { prismaNew: PrismaClient };

export const prisma =
  globalForPrisma.prismaNew ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaNew = prisma;
