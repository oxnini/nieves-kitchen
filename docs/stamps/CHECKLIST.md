# Stamp Checklist

Tracks which country stamps are ingested into `public/stamps/` and registered in `CUSTOM_STAMPS` (`lib/passport-stamps.ts`).

Legend:
- `[x]` — done, current ink-pressed aesthetic
- `[~]` — present but pre-redesign aesthetic, queued for replacement
- `[ ]` — not yet ingested

The `ingeststamp` skill flips `[~]` and `[ ]` → `[x]` automatically. To queue a stamp for replacement, change its `[x]` back to `[~]` by hand.

---

## Done (new ink-pressed look)

- [x] Ethiopia
- [x] Ghana
- [x] India
- [x] Jamaica

## Keep — pre-redesign, excluded from replacement

Europe and East Asia stamps are kept as-is even though they predate the ink-pressed redesign.

### Europe
- [x] Belgium
- [x] Croatia
- [x] France
- [x] Greece
- [x] Hungary
- [x] Italy
- [x] Poland
- [x] Portugal
- [x] Slovakia
- [x] Spain

### East Asia
- [x] China
- [x] Hong Kong
- [x] Japan
- [x] South Korea
- [x] Taiwan

## Replace — pre-redesign, queued for new ink-pressed render

### North Africa
- [~] Egypt
- [~] Morocco

### Sub-Saharan Africa
- [~] South Africa

### Middle East
- [~] Iran
- [~] Lebanon
- [~] Turkey

### Latin America
- [~] Mexico
- [~] Peru

### North America
- [~] United States

### South Asia
- [~] Bangladesh
- [~] Bhutan
- [~] Nepal
- [~] Pakistan
- [~] Sri Lanka

### Southeast Asia
- [x] Indonesia
- [x] Malaysia
- [~] Philippines
- [~] Singapore
- [~] Thailand
- [~] Vietnam

### Central Asia
- [~] Afghanistan
- [~] Kazakhstan
- [~] Turkmenistan
- [~] Uzbekistan

## Missing — to add

Add new countries here as recipes ship or as cuisine priorities surface. The `ingeststamp` skill will check them off when ingested.

- [x] Kenya  <!-- Sub-Saharan Africa; move to Done section when convenient -->
- [x] Saudi Arabia  <!-- Middle East; move to Done section when convenient -->

<!-- Examples — uncomment / edit as needed:
- [ ] Germany
- [ ] Argentina
- [ ] Brazil
- [ ] Israel
- [ ] Ireland
-->
