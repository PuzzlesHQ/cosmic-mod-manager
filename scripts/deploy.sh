#!/usr/bin/env bash

PROJECT_DIR="/var/www/cosmic-mod-manager/current"
FRONTEND_DIR="$PROJECT_DIR/apps/frontend"
BACKEND_DIR="$PROJECT_DIR/apps/backend"

cd "$PROJECT_DIR" || exit 1
git pull origin main
bun install --frozen-lockfile

# deploy frontend
echo "Deploying frontend..."
cd "$FRONTEND_DIR" || exit 1
bun install
bun run build
pm2 restart crmm-frontend -s

# deploy backend
echo "Deploying backend..."
cd "$BACKEND_DIR" || exit 1
bun install
bun run src/routes/cdn/process-downloads.ts
bun run prisma-generate
bun run prisma-push
pm2 restart crmm-backend -s
pm2 restart crmm-github-webhook -s

echo "Deployment complete!"