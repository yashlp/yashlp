#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo ""
  echo "ERROR: DATABASE_URL is not set in Vercel → Settings → Environment Variables."
  echo "Add your Neon pooled PostgreSQL URL for the Production environment, then redeploy."
  echo ""
  exit 1
fi

if [[ ! "$DATABASE_URL" =~ ^postgresql:// ]]; then
  echo ""
  echo "ERROR: DATABASE_URL must start with postgresql:// (Neon pooled URL)."
  echo "SQLite URLs (file:./dev.db) do not work on Vercel."
  echo ""
  exit 1
fi

# channel_binding=require can break Prisma on some build hosts; Neon works without it.
export DATABASE_URL="${DATABASE_URL//&channel_binding=require/}"
export DATABASE_URL="${DATABASE_URL//?channel_binding=require&/?}"
export DATABASE_URL="${DATABASE_URL//?channel_binding=require/}"

echo "→ prisma generate"
npx prisma generate

echo "→ prisma db push"
npx prisma db push --skip-generate

if [ -n "${COMMERCE_ADMIN_PASSWORD:-}" ]; then
  echo "→ ensure commerce admin"
  npx tsx scripts/ensure-commerce-admin.ts
else
  echo "→ commerce admin setup skipped (set COMMERCE_ADMIN_PASSWORD on Vercel to enable)"
fi

echo "→ next build"
npx next build
