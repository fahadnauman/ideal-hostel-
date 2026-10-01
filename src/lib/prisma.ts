import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
      } as ConstructorParameters<typeof PrismaClient>[0]);
    }
    const value = (globalForPrisma.prisma as any)[prop];
    if (typeof value === 'function') {
      return value.bind(globalForPrisma.prisma);
    }
    return value;
  }
});

if (process.env.NODE_ENV !== "production") {
  // Ensure we don't accidentally overwrite the proxy with the instance in dev mode on reload
  // Actually, we don't need to do anything since the proxy always reads from globalForPrisma
}
