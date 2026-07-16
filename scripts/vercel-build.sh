#!/usr/bin/env bash
set -euo pipefail

# channel_binding=require can break Prisma on some build hosts; Neon works without it.
if [ -n "${DATABASE_URL:-}" ]; then
  export DATABASE_URL="${DATABASE_URL//&channel_binding=require/}"
  export DATABASE_URL="${DATABASE_URL//?channel_binding=require&/?}"
  export DATABASE_URL="${DATABASE_URL//?channel_binding=require/}"
fi

echo "→ prisma generate"
npx prisma generate

if [ -z "${DATABASE_URL:-}" ]; then
  echo "WARN: DATABASE_URL is not set — skipping db push / seed. Storefront will still build."
elif [[ ! "$DATABASE_URL" =~ ^postgresql:// ]]; then
  echo "WARN: DATABASE_URL is not postgresql:// — skipping db push / seed. Storefront will still build."
else
  echo "→ prisma db push"
  npx prisma db push --skip-generate || echo "WARN: prisma db push failed — continuing build"

  echo "→ ensure commerce admin"
  npx tsx scripts/ensure-commerce-admin.ts || echo "WARN: ensure-commerce-admin failed — continuing build"

  echo "→ bootstrap commerce settings (no demo catalog)"
  npx tsx prisma/seed-commerce-bootstrap.ts || echo "WARN: seed-commerce-bootstrap failed — continuing build"

  if [ "${PURGE_DEMO_CATALOG:-}" = "true" ]; then
    echo "→ purge demo catalog"
    npx tsx scripts/purge-demo-catalog.ts || echo "WARN: purge-demo-catalog failed — continuing build"
  fi

  if [ "${SEED_DEMO_CATALOG:-}" = "true" ]; then
    echo "→ seed demo catalog (SEED_DEMO_CATALOG=true)"
    npx tsx prisma/seed-commerce.ts || echo "WARN: seed-commerce failed — continuing build"
  fi
fi

echo "→ next build"
npx next build
