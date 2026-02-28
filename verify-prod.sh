#!/usr/bin/env bash
set -euo pipefail

echo "==> 1) Show Vercel project link (if any)"
vercel projects ls || true

echo "==> 2) Pull env vars from Vercel (Production)"
vercel env pull .env.production.local --environment=production

echo "==> 3) Sanity check: DATABASE_URL exists (masked)"
if grep -q '^DATABASE_URL=' .env.production.local; then
  echo "✅ DATABASE_URL found in .env.production.local"
else
  echo "❌ DATABASE_URL missing in .env.production.local"
  exit 1
fi

echo "==> 4) Prisma generate (should succeed)"
cp .env.production.local .env
npx prisma generate

echo "==> 5) Prisma DB ping via a tiny Node script"
cat > /tmp/prisma-ping.js <<'PING'
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Prisma ping OK");
  } catch (e) {
    console.error("❌ Prisma ping failed:", e?.message || e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
PING
node /tmp/prisma-ping.js
echo "==> OK"
