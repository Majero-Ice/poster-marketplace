import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  try {
    const poolConfig = {
      connectionString,
      ssl: connectionString.includes("supabase.co") ? { rejectUnauthorized: false } : undefined,
      max: connectionString.includes("pgbouncer=true") ? 1 : 10,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    };

    const pool = globalForPrisma.pool ?? new Pool(poolConfig);
    const adapter = new PrismaPg(pool);

    const client = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.pool = pool;
    }

    return client;
  } catch (error) {
    if (error instanceof Error && error.message.includes("password")) {
      throw new Error(
        "DATABASE_URL connection error: Password may contain special characters that need to be URL-encoded. " +
        "Special characters like @, :, /, #, %, &, +, =, ?, [, ], and spaces must be encoded. " +
        "Example: postgresql://user:p%40ssw%3Ard@host:5432/db"
      );
    }
    throw error;
  }
};

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
