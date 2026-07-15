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

echo "→ ensure commerce admin"
npx tsx scripts/ensure-commerce-admin.ts

# Catalog seed stays idempotent. Demo users/passwords are NOT re-applied in production
# unless SEED_DEMO_USERS=true (explicit opt-in for staging/previews).
if [ "${SEED_COMMERCE_CATALOG:-true}" = "true" ]; then
  echo "→ seed commerce catalog (SEED_DEMO_USERS=${SEED_DEMO_USERS:-false})"
  SEED_DEMO_USERS="${SEED_DEMO_USERS:-false}" npx tsx prisma/seed-commerce.ts
else
  echo "→ skip commerce seed (SEED_COMMERCE_CATALOG=false)"
fi

echo "→ next build"
npx next build
