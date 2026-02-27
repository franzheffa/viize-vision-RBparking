#!/usr/bin/env bash
set -euo pipefail

echo "==> 1) Show Vercel project link (if any)"
vercel project ls || true

echo "==> 2) Pull env vars from Vercel (Production)"
vercel env pull .env.production.local --environment=production

echo "==> 3) Sanity check: DATABASE_URL exists (masked)"
if grep -q "^DATABASE_URL=" .env.production.local; then
  echo "✅ DATABASE_URL found in .env.production.local"
  echo "   (value hidden)"
else
  echo "❌ DATABASE_URL missing in Vercel Production env."
  exit 1
fi

echo "==> 4) Prisma generate (should succeed)"
npx prisma generate

echo "==> 5) Prisma DB ping via a tiny Node script"
cat > .tmp_prisma_ping.mjs << 'PING'
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
PING

NODE_ENV=production \
$(grep -v '^#' .env.production.local | xargs) \
node .tmp_prisma_ping.mjs

rm -f .tmp_prisma_ping.mjs

echo "==> 6) Build locally using production env (no deploy yet)"
NODE_ENV=production \
$(grep -v '^#' .env.production.local | xargs) \
npm run build

echo "✅ Done: prod env pulled + prisma ok + build ok"
