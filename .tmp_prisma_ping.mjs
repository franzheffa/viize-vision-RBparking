import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
try {
  await prisma.$queryRaw`SELECT 1`;
  console.log("✅ Prisma DB: SELECT 1 OK");
} catch (e) {
  console.error("❌ Prisma DB ping failed:", e?.message || e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
