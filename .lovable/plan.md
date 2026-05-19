# Multi-Item Cart Redesign — `src/pages/Customize.tsx`

Implements the spec in `DigitalPhotos_MultiItem_Cart_Spec.pdf`. Goal: stage multiple portraits at different sizes/products, then commit all with ONE Add to Cart that fires the VIP modal exactly once.

## Current state (verified in file)

- `items[]` already exists as the staging array; `cartItems[]` is the committed cart.
- Each product card (~line 4080–4210) has its own "Add to Cart" button that calls `addToCart()` then `setUpsellOpen(true)`.
- Portrait rows already render with checkbox + qty + remove (~line 3466). Selection highlight already follows `selectedId`.
- Header total uses `cartFullSubtotal` (committed cart), so it reads $0 while staging.
- `handleAddImage()` exists; "+ Add Different Photo" is already in the right panel (~line 3921).
- `checkoutCart()` exists at ~2678.

## Changes

### CHANGE-A — Compute staged total
~line 1861, add:
```
const stagedTotal = items.reduce((s, it) => s + itemUnitPrice(it) * (it.qty || 1), 0);
const headerTotal = cartItems.length > 0 ? cartFullSubtotal : stagedTotal;
```
Use `headerTotal` wherever the right-panel/sticky header currently shows `cartFullSubtotal` (price chip + button label). Don't touch the Stripe checkout math.

### CHANGE-B — "Add Portrait at Different Size/Product" button
In the YOUR PORTRAITS area (just under the rows, ~line 3594), add a button:
```
const addPortraitVariant = () => {
  const newItem = makeItem({
    photoUrl: selected.photoUrl,
    photoAspect: selected.photoAspect,
    style: selected.style,
  });
  setItems(prev => [...prev, newItem]);
  setSelectedId(newItem.id);
  setTimeout(() => document.getElementById(newItem.id)?.scrollIntoView({ behavior:'smooth', block:'nearest' }), 80);
};
```
Two buttons side-by-side: `+ Add at Different Size / Product` (calls `addPortraitVariant`) and `+ Add a Different Photo` (calls `handleAddImage`). Subtle "Save 10% on 2+" caption underneath.

### CHANGE-C — Radio dot on each portrait row
Replace the left checkbox at line 3471–3484 with a red radio circle whose `checked` state is `it.id === selectedId`. Keep the row click behavior. The existing "in cart" checkbox functionality (`toggleItemInCart`) is now redundant since cart-add happens via the unified button — remove that toggle.

### CHANGE-D — Remove per-card "Add to Cart" buttons
Find the block ~line 4170–4210 inside each expanded product card (the one calling `addToCart(namedSnapshot, lineQty)` + `setUpsellOpen(true)`) and remove it together with the italic "A timeless piece made uniquely for you." line above. Size clicks already mutate the staged item via `updateSelected()`, so nothing else needed.

### CHANGE-E — Unified sticky "Add All to Cart" button
Above the existing `checkoutCart` button (~line 4624), insert a new sticky red button:
```
const addAllToCart = async () => {
  for (const it of items) {
    const finalUrl = await maybeComposeNameOnImage(it); // if helper exists; else use it.photoUrl
    const snap = buildSnapshot(it, finalUrl);            // reuse the same snapshot logic the per-card button used
    addToCart(snap, it.qty || 1);
  }
  setUpsellOpen(true);
};
```
Label: `Add All to Cart — $${headerTotal}`. Disabled when `items.length === 0`. Below it: small muted line "100% satisfaction guarantee · Free shipping worldwide".

I'll extract `buildSnapshot(it, url)` from the existing per-card button code (the `namedSnapshot` construction at ~line 4180) into a small helper so both paths stay consistent.

### CHANGE-F — "Configuring Portrait #N" label
Above the product cards section, add a small uppercase muted label:
```
const selectedIndex = items.findIndex(i => i.id === selectedId);
const configLabel = selectedIndex >= 0 ? `Portrait #${selectedIndex + 1}` : 'Your Portrait';
```
Render: `CONFIGURING {configLabel}`.

### Out of scope (intentionally)
- No changes to `create-payment` / `create-prodigi-order` edge functions.
- No changes to `cartItems[]` shape or `checkoutCart()` flow — VIP modal still flows into the same checkout.
- Bundle discount math stays in `itemUnitPrice`/`discountAmt` — already applied per item.

## Verification
- Build passes.
- With 1 staged portrait: header shows its price, "Add All to Cart — $X" enabled, click → VIP modal once → checkout.
- Add second portrait via new button → both rows visible, radio toggles middle preview, total updates live, single Add All to Cart commits both.
- No "Add to Cart" buttons remain inside expanded product cards.
