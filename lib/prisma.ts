import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL || "";
  
  // Use Turso/LibSQL adapter for production (libsql:// URLs)
  if (databaseUrl.startsWith("libsql://")) {
    const { createClient } = require("@libsql/client");
    const { PrismaLibSQL } = require("@prisma/adapter-libsql");

    const libsql = createClient({
      url: databaseUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    const adapter = new PrismaLibSQL(libsql);

    // Pass a dummy datasource URL to bypass Prisma's URL validation
    // The adapter will handle the actual connection
    return new PrismaClient({
      adapter,
      datasourceUrl: "file:./placeholder.db",
    });
  }
  
  // Use regular SQLite for local development (file:// URLs)
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}