#!/bin/bash

# Step 1: Sync notes from Obsidian to Astro.js blog
echo "🔄 Syncing notes from Published folder..."
./sync-notes.sh

# Step 2: Build the site
echo "🏗 Building the site..."
npm run build

# Step 3: Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod

echo "✅ Blog update complete!"

