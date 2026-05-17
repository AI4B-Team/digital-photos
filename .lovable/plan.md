# Premium "Custom Portrait Art" Rebrand — Phased Plan

The request spans two large pages (~6.3k LOC). To avoid a single risky rewrite, I'll split into 3 sequential phases. You can approve all, or just phase 1 to start.

---

## Phase 1 — Style Discovery Page (`src/pages/Index.tsx`)

**Copy & positioning**
- Hero title: "Choose An Art Style" → "Choose Your Portrait Style"
- Subhead → "Explore hundreds of curated styles designed for every memory, personality, and occasion."
- Sweep all customer-facing copy for "AI", "generate", "prompt" → replace with "curated", "crafted", "portrait", "artist-designed". (AI stays in code/comments.)

**Curated collections layer**
- Add a horizontal scrollable "Collections" rail above the style grid with editorial chips/cards:
  Trending · Best Sellers · Royal Portrait · Watercolor · Memorial · Father's Day Favorites · Hero Dad · Story Time · Legacy Portrait · High Society · Guilty As Charged · Kitchen Tails · Mugshot · Office Life · Extreme Sports · Funny & Viral
- Each collection tags an existing subset of styles (mapping defined in code; no new style assets needed). Selecting a collection filters the grid with a soft fade.
- Visual treatment: large image-led cards, serif labels (Playfair), soft shadows, generous whitespace — Pinterest/editorial, not filter pills.

**Visual polish**
- Reduce hard borders, soften dividers, increase section spacing.

---

## Phase 2 — Customize Page Cleanup (`src/pages/Customize.tsx`)

**Visual de-clutter (~70% less red)**
- Audit every `#E61919` / `RED` usage. Keep red ONLY on: primary CTA, countdown timer, currently-selected option ring, active product card.
- Convert remaining red borders/badges to neutral: `BORDER` (rgba(0,0,0,.08)), soft shadows, muted labels.

**Right panel → accordions**
- Collapse the long stacked product sections into accordion groups using existing `@/components/ui/accordion`:
  - Size
  - Frame Color
  - Mount Color
  - Glass / Glaze
  - What's Included
- Default-open: Size. Others collapsed. Selected value shown in the accordion header.

**Emotional CTA copy**
- Above Add-to-Cart: small italic line "A timeless piece made uniquely for you."

**Watermark softening**
- Lower opacity (e.g. 0.35 → 0.15), reduce repeat count, single diagonal pass instead of tile grid.

---

## Phase 3 — Frame Preview Realism (`src/pages/Customize.tsx`)

- Add a subtle wall-texture background layer behind the framed preview (CSS gradient + noise, no new asset required).
- Add ambient drop shadow + soft top-light gradient on the frame to imply room lighting.
- Subtle inner glass reflection sheen on glazed frames.
- (Lifestyle room scenes deferred — would need new image assets; flag for a follow-up if you want it.)

---

## Out of scope (call out)
- No backend, pricing, or cart-logic changes.
- No new image/photography assets (lifestyle mockups deferred).
- No route or data-model changes.

---

## Questions before I start
1. **Phase order** — ship all three in one go, or land Phase 1, review, then continue?
2. **Collection mapping** — happy for me to auto-assign existing styles to the collections by name/category heuristics, or do you want to hand-curate the lists later?
3. **Lifestyle room scenes** — skip for now (CSS-only realism), or do you want me to generate 2–3 room background images?
