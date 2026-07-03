// scripts/seed-recipes.ts
//
// Loads every data/recipes/*.ts recipe (skips _-prefixed helpers), converts to
// the recipes row shape, validates each row through DbRecipeSchema, then either
// reports (--check, offline) or upserts into Supabase on conflict slug.
import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { DbRecipeSchema } from '../lib/types';
import { inputToRow, needsRealPhoto, type RecipeInput, type RecipeRow } from '../data/recipes/_types';
import { stampStatusForCountry } from './lib/stamp-coverage';

config({ path: '.env.local' });

const CHECK_ONLY = process.argv.includes('--check');
const REQUIRE_STAMPS = process.argv.includes('--require-stamps');
const RECIPES_DIR = resolve(process.cwd(), 'data/recipes');

async function loadInputs(): Promise<{ slug: string; input: RecipeInput }[]> {
  const files = readdirSync(RECIPES_DIR)
    .filter((f) => f.endsWith('.ts') && !f.startsWith('_'))
    .sort();
  const out: { slug: string; input: RecipeInput }[] = [];
  for (const file of files) {
    const slug = file.replace(/\.ts$/, '');
    const mod = await import(pathToFileURL(join(RECIPES_DIR, file)).href);
    if (!mod.default) {
      console.error(`✗ ${file}: no default export`);
      process.exit(1);
    }
    out.push({ slug, input: mod.default as RecipeInput });
  }
  return out;
}

async function main() {
  const inputs = await loadInputs();
  const rows: RecipeRow[] = [];
  let failed = false;

  for (const { slug, input } of inputs) {
    const row = inputToRow(slug, input);
    // DbRecipeSchema expects id + created_at (DB-generated); add stand-ins so
    // the parse validates the columns we actually write without false errors.
    const parsed = DbRecipeSchema.safeParse({
      ...row,
      id: '00000000-0000-0000-0000-000000000000',
      created_at: new Date().toISOString(),
    });
    if (!parsed.success) {
      failed = true;
      console.error(`✗ ${slug}.ts failed validation:`);
      console.error(parsed.error.issues.map((i) => `   ${i.path.join('.')}: ${i.message}`).join('\n'));
    } else {
      rows.push(row);
    }
  }

  if (failed) {
    console.error('\nAborting: fix the recipes above before seeding (no rows written).');
    process.exit(1);
  }

  console.log(`✓ ${rows.length} recipe(s) valid.`);

  const needPhotos = inputs.filter(({ input }) => needsRealPhoto(input)).map(({ slug }) => slug);
  if (needPhotos.length > 0) {
    console.log(`\nStill using stock photos (need a real photo): ${needPhotos.length}`);
    needPhotos.forEach((s) => console.log(`   - ${s}`));
  }

  // Origin-less recipes (no country) never stamp, so they have no coverage row.
  const coverage = inputs.flatMap(({ slug, input }) =>
    input.country
      ? [{ slug, country: input.country, status: stampStatusForCountry(input.country) }]
      : [],
  );
  const needsReplacing = coverage.filter((c) => c.status === 'needs-replacing');
  const missing = coverage.filter((c) => c.status === 'missing');
  const approvedCount = coverage.length - needsReplacing.length - missing.length;

  console.log(
    `\nStamp coverage: ${approvedCount} approved, ${needsReplacing.length} need replacing, ${missing.length} missing.`,
  );
  if (needsReplacing.length > 0) {
    console.log('  Stamp exists but not the approved [x] version:');
    needsReplacing.forEach((c) => console.log(`   ~ ${c.slug} (${c.country})`));
  }
  if (missing.length > 0) {
    console.log('  No custom stamp (procedural fallback only):');
    missing.forEach((c) => console.log(`   ✗ ${c.slug} (${c.country})`));
  }
  if (REQUIRE_STAMPS && (needsReplacing.length > 0 || missing.length > 0)) {
    console.error('\nAborting: --require-stamps is set and some recipes lack an approved stamp.');
    process.exit(1);
  }

  if (CHECK_ONLY) {
    console.log('\n--check: validation only, nothing written.');
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }
  const supabase = createClient(url, key);
  const { error, data } = await supabase.from('recipes').upsert(rows, { onConflict: 'slug' }).select('slug');
  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
  console.log(`\nSeeded ${data?.length ?? 0} recipe(s) into Supabase.`);
}

main();
