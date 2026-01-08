#!/bin/sh
echo "Running Prisma Generate..."
npx prisma generate

echo "Running Database Migration (Accepting Data Loss)..."
npx prisma db push --accept-data-loss

echo "Starting Server..."
node dist/index.js
