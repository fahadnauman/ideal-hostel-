import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!globalForPrisma.prisma) {
      const connectionString = process.env.DATABASE_URL;
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      
      globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
      } as any);
    }
    const value = (globalForPrisma.prisma as any)[prop];
    if (typeof value === 'function') {
      return value.bind(globalForPrisma.prisma);
    }
    return value;
  }
});

if (process.env.NODE_ENV !== "production") {
}
