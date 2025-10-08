#!/bin/bash

set -e  # Stop on error

APP_NAME="nextjs-app"
APP_DIR="/Users/it-12/Documents/Projects/rev_fest_code/rev_fest_frontend"         # Update this
TMP_DIR="/tmp/nextjs-build"
NEXT_DIR=".next"

echo "📦 Starting deployment..."

cd "$APP_DIR"

# echo "📥 Pulling latest code..."
# git pull origin main

echo "📦 Installing dependencies..."
sudo npm install

echo "🏗 Building in temporary directory..."
# Clean any old temp build
sudo rm -rf "$TMP_DIR"
sudo mkdir "$TMP_DIR"

# Copy app files into the temp dir
sudo rsync -a --exclude="$NEXT_DIR" --exclude="node_modules" ./ "$TMP_DIR"

cd "$TMP_DIR"

# Install dependencies (optional if you're sure they're identical)
sudo npm install

sudo npm run build

echo "🚚 Replacing .next directory safely..."
# Swap in the new .next folder
sudo rm -rf "$APP_DIR/$NEXT_DIR"
sudo mv "$TMP_DIR/$NEXT_DIR" "$APP_DIR/"

echo "🧹 Cleaning up..."
sudo rm -rf "$TMP_DIR"

cd "$APP_DIR"

echo "🔁 Reloading PM2 with zero downtime..."
pm2 reload "$APP_NAME"

echo "✅ Deployment complete."