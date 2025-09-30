#!/bin/sh
set -e

# Regenerate Prisma client inside the mounted volume
echo "Generating Prisma client..."
npx prisma generate --generator js_client

# Start dev server
echo "Starting app..."
exec npm run dev
