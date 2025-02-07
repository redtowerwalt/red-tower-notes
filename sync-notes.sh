#!/bin/bash

# Define paths
VAULT_PATH="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/Red Tower Vault/Published"
BLOG_PATH="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/Red Tower Vault/red-tower-notes/content/notes"

# Ensure the destination folder exists
mkdir -p "$BLOG_PATH"

# Sync published notes (overwrite changes & remove deleted files)
rsync -av --delete --include='*.md' --include='*.txt' --exclude='*' "$VAULT_PATH/" "$BLOG_PATH/"

# Rename .txt files to .md in content/notes/
for file in "$BLOG_PATH"/*.txt; do
    [ -f "$file" ] && mv "$file" "${file%.txt}.md"
done

echo "✅ Notes successfully synced from Published to Blog!"

# After syncing notes, push updates to GitHub
cd /Users/walterhenson_air/Library/Mobile Documents/iCloud~md~obsidian/Documents/Red Tower Vault/red-tower-notes
git add .
git commit -m "Auto-sync new notes"
git push origin main

# Trigger Netlify build
netlify deploy --prod

