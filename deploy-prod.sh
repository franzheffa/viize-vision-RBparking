#!/bin/bash
echo "==> 1) Sync Prisma Schema"
npx dotenv -e .env.production.local -- npx prisma db push

echo "==> 2) Running Seed (20 spots)"
npx dotenv -e .env.production.local -- npx tsx prisma/seed.ts

echo "==> 3) Committing changes"
git add .
git commit -m "prod: dynamic pricing engine and 20 spots sync"

echo "==> 4) Pushing to GitHub (Production Build)"
git push origin main

echo "✅ Deployment pipeline finished."
