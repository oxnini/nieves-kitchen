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
- [x] Egypt
- [x] Morocco

### Sub-Saharan Africa
- [x] South Africa

### Middle East
- [x] Iran
- [x] Lebanon
- [~] Turkey

### Latin America
- [~] Mexico
- [~] Peru

### North America
- [~] United States

### South Asia
- [x] Bangladesh
- [~] Bhutan
- [~] Nepal
- [x] Pakistan
- [x] Sri Lanka

### Southeast Asia
- [x] Indonesia
- [x] Malaysia
- [x] Philippines
- [~] Singapore
- [x] Thailand
- [x] Vietnam

### Central Asia
- [~] Afghanistan
- [~] Kazakhstan
- [~] Turkmenistan
- [~] Uzbekistan

## Missing — to add

Add new countries here as recipes ship or as cuisine priorities surface. The `ingeststamp` skill will check them off when ingested.

- [x] Kenya  <!-- Sub-Saharan Africa; move to Done section when convenient -->
- [x] Saudi Arabia  <!-- Middle East; move to Done section when convenient -->
- [x] Cyprus  <!-- Middle East; move to Done section when convenient -->
- [x] Argentina  <!-- South America; move to Done section when convenient -->
- [x] Algeria  <!-- North Africa; move to Replace/Done section when convenient -->
- [x] Tunisia  <!-- North Africa; move to Replace/Done section when convenient -->
- [x] Libya  <!-- North Africa; move to Replace/Done section when convenient -->
- [x] Sudan  <!-- North Africa; move to Replace/Done section when convenient -->
- [x] Senegal  <!-- Sub-Saharan Africa; move to Done section when convenient -->
- [x] Gambia  <!-- Sub-Saharan Africa; move to Done section when convenient -->
- [x] Liberia  <!-- Sub-Saharan Africa; move to Done section when convenient -->
- [x] Nigeria  <!-- Sub-Saharan Africa; move to Done section when convenient -->
- [x] Togo  <!-- Sub-Saharan Africa; move to Done section when convenient -->
- [x] Sierra Leone  <!-- Sub-Saharan Africa; move to Done section when convenient -->
- [x] Niger  <!-- Sub-Saharan Africa; move to Done section when convenient -->

<!-- Examples — uncomment / edit as needed:
- [ ] Germany
- [ ] Brazil
- [ ] Israel
- [ ] Ireland
-->
