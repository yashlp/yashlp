#!/usr/bin/env bash
set -euo pipefail

# channel_binding=require can break Prisma on some hosts.
if [ -n "${DATABASE_URL:-}" ]; then
  export DATABASE_URL="${DATABASE_URL//&channel_binding=require/}"
  export DATABASE_URL="${DATABASE_URL//?channel_binding=require&/?}"
  export DATABASE_URL="${DATABASE_URL//?channel_binding=require/}"
fi

if [ -n "${DATABASE_URL:-}" ] && [[ "$DATABASE_URL" =~ ^postgresql:// ]]; then
  echo "→ prisma db push"
  npx prisma db push --skip-generate || echo "WARN: prisma db push failed — continuing"

  echo "→ ensure commerce admin"
  npx tsx scripts/ensure-commerce-admin.ts || echo "WARN: ensure-commerce-admin failed — continuing"

  echo "→ bootstrap commerce settings"
  npx tsx prisma/seed-commerce-bootstrap.ts || echo "WARN: seed-commerce-bootstrap failed — continuing"

  if [ "${PURGE_DEMO_CATALOG:-}" = "true" ]; then
    echo "→ purge demo catalog"
    npx tsx scripts/purge-demo-catalog.ts || echo "WARN: purge-demo-catalog failed — continuing"
  fi
fi

echo "→ starting Next.js"
exec node server.js
