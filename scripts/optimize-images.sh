#!/usr/bin/env bash
# Convert any PNG/JPG/JPEG under public/ to WebP at quality 82 and delete the
# original. Skips files that are already converted (i.e. a sibling .webp exists
# with a newer mtime). Run after dropping new images into public/.
#
# Usage: npm run optimize-images
# Requires: cwebp (brew install webp)

set -euo pipefail

if ! command -v cwebp >/dev/null 2>&1; then
  echo "Error: cwebp not found. Install with: brew install webp" >&2
  exit 1
fi

QUALITY="${QUALITY:-82}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC_DIR="$ROOT/public"

if [ ! -d "$PUBLIC_DIR" ]; then
  echo "Error: $PUBLIC_DIR does not exist" >&2
  exit 1
fi

converted=0
skipped=0
saved_bytes=0

while IFS= read -r -d '' src; do
  ext="${src##*.}"
  shopt -s nocasematch
  if [[ "$ext" != "png" && "$ext" != "jpg" && "$ext" != "jpeg" ]]; then
    shopt -u nocasematch
    continue
  fi
  shopt -u nocasematch

  out="${src%.*}.webp"

  if [ -f "$out" ] && [ "$out" -nt "$src" ]; then
    skipped=$((skipped + 1))
    continue
  fi

  before=$(stat -f%z "$src" 2>/dev/null || stat -c%s "$src")
  cwebp -q "$QUALITY" -quiet "$src" -o "$out"
  after=$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out")
  saved=$((before - after))
  saved_bytes=$((saved_bytes + saved))

  rel="${src#$ROOT/}"
  printf "  %-60s %6d KB -> %6d KB\n" "$rel" $((before / 1024)) $((after / 1024))

  rm "$src"
  converted=$((converted + 1))
done < <(find "$PUBLIC_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

echo ""
echo "Converted: $converted | Skipped: $skipped | Saved: $((saved_bytes / 1024)) KB"

if [ $converted -gt 0 ]; then
  echo ""
  echo "Done. Update any code references from .png/.jpg to .webp."
fi
