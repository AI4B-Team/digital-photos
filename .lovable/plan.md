I parsed the audit PDF. It identifies 12 bugs across `src/pages/Customize.tsx` (4,804 lines) and `supabase/functions/create-prodigi-order/index.ts`. Below is the fix plan in the recommended priority order. Fulfillment bugs first (they silently fail paid orders), preview bugs second.

## Phase 1 — Fulfillment (must ship before any live order)

1. **BUG-09 Multi-item orders** — `create-payment` and the checkout call only pass `cartItems[0]` to `create-prodigi-order`. Change payload to a `printItems` array, loop over it in the edge function to build Prodigi `items[]`, and store all SKUs on the session row.
2. **BUG-04 + BUG-05 Canvas wrap attribute** — In `create-prodigi-order`, replace `CANVAS_EDGE_ATTR` with the documented Prodigi values and add the missing `gallery` key:
   ```
   gallery → imageWrap
   mirror → mirrorWrap
   museum-black → black
   museum-white → white
   ```
3. **BUG-06 Float-frame canvas color** — In `create-prodigi-order`, detect `productType==='canvas' && sku.startsWith('GLOBAL-FRA-CAN')` and pass `attributes.color = FRAME_COLOR_ATTR[frameColor] ?? frameColor`. Ensure `create-payment` / Stripe metadata forwards `canvasFloatFrameColor` as `frameColor` for these items.
4. **BUG-10 SKU casing** — In `SIZES_BY_PRODUCT` (~line 220), normalize all SKUs to uppercase `X` (e.g. `GLOBAL-CAN-8X10`). Verify against Prodigi docs.

## Phase 2 — Preview correctness (acrylic + canvas)

5. **BUG-01 isFrameless ignores acrylic** — In `renderItem()` (~3180) change
   `const isFrameless = fd.id==='frameless' || fd.id==='digital' || isAcrylic;`
   and make the wrapper background explicitly `transparent` when `isAcrylic || isFrameless`.
6. **BUG-02 undefined edge highlights** — At ~3205 replace the `borderTop/borderLeft: undefined` no-ops with:
   ```
   borderTop:  isAcrylic ? '1px solid rgba(255,255,255,0.18)' : undefined,
   borderLeft: isAcrylic ? '1px solid rgba(255,255,255,0.15)' : undefined,
   ```
7. **BUG-11 Stale `item.frame` on productType switch** — In the size click handler derive frame via `toFrameId(card.id, cardFrame)` and pass it to `updateSelected`. Update `makeItem` to derive frame from `overrides.productType` when provided.
8. **BUG-03 Room view uses `activeCard`** — Pass `selected.productType` (not `activeCard`) to `RoomViewPanel` so the room view reacts to the selected item.
9. **BUG-12 Float-frame state not snapshotted** — In the size click handler include `canvasFloatFrame` and `canvasEdge` in the snapshot. Add a `useEffect` keyed on `selectedId` that restores `canvasFrame` / `canvasFrameColor` from the selected item.

## Phase 3 — UI polish

10. **BUG-07 Float-frame 5mm gap in room view** — At ~1740 add the inner dark gap (`background:'#1a1a1a'`, ~5px padding) between the float frame and the canvas, mirroring the center preview.
11. **BUG-08 Box-frame missing `frameColors:true`** — Add `frameColors:true` to the box-frame card definition (~3580) so color/mount/glaze UI renders. `FRAME_COLORS['box-frame']` already exists.

## Verification

- After edits, build must pass.
- Manually verify in the preview: acrylic shows no frame bleed and has subtle edge highlights; switching productType updates frame; room view reflects selected item; box-frame shows color/mount/glaze; canvas float-frame shows a 5mm dark gap.
- For fulfillment, dry-run a multi-item cart through `create-payment` → check the payload sent to `create-prodigi-order` contains all items with correct uppercase SKUs and the right `attributes.wrap` / `attributes.color`.

## Notes

- This touches checkout and fulfillment logic. I'll keep changes surgical and preserve existing variable names / shapes.
- I will not run live Prodigi orders — verification is code-level + preview-level.
- File size: Customize.tsx is ~4,800 lines, so I'll read the relevant ranges (~220, ~1740, ~2480, ~3180–3220, ~3580, ~3900, ~4150) before editing.
