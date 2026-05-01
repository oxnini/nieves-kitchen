#!/usr/bin/env bash
# Convert specific image file(s) to WebP at quality 82, delete the originals,
# and stage the new .webp files. Used by the lint-staged pre-commit hook to
# auto-convert PNGs/JPGs in opt-in folders (configured in package.json under
# "lint-staged"). For ad-hoc full-tree conversion, use scripts/optimize-images.sh.
#
# Usage: scripts/convert-image.sh <file1> [<file2> ...]
# Requires: cwebp (brew install webp)

set -euo pipefail

if ! command -v cwebp >/dev/null 2>&1; then
  echo "Error: cwebp not found. Install with: brew install webp" >&2
  exit 1
fi

QUALITY="${QUALITY:-82}"

if [ $# -eq 0 ]; then
  exit 0
fi

for src in "$@"; do
  if [ ! -f "$src" ]; then
    continue
  fi

  ext="${src##*.}"
  shopt -s nocasematch
  if [[ "$ext" != "png" && "$ext" != "jpg" && "$ext" != "jpeg" ]]; then
    shopt -u nocasematch
    continue
  fi
  shopt -u nocasematch

  out="${src%.*}.webp"
  before=$(stat -f%z "$src" 2>/dev/null || stat -c%s "$src")
  cwebp -q "$QUALITY" -quiet "$src" -o "$out"
  after=$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out")

  printf "Optimized %s: %d KB -> %d KB (q%s)\n" "$src" $((before / 1024)) $((after / 1024)) "$QUALITY"

  # Stage the new .webp; remove the source from working tree + index so the
  # commit records the deletion (and lint-staged's post-task re-add is a no-op).
  git add "$out"
  git rm -f --quiet "$src" 2>/dev/null || rm -f "$src"
done
