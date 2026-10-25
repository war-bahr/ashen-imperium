# Ashen Imperium v6 — local deploy notes

Ship date: 2026-10-25. Patched in place on the Vite build under `/workspace/ashen-imperium-deploy/`.

## Files changed

- `assets/index-CkDh-r5-.js` — claimed-star Metal yield (sticky 6–20 / year)
- `sw.js` — cache bumped `ashen-imperium-v5` → `ashen-imperium-v6`
- `V6_NOTES.md` — this file

Unchanged asset filenames (index.html still references the same JS/CSS hashes). Save key remains `ashen-imperium-save-v1` (backward compatible: `metalYield` optional; assigned lazily if missing).

Backup of pre-v6 JS: `assets/index-CkDh-r5-.js.bak-pre-v6`

## Feature: Claimed-star Metal tithe

Every star system has a fixed **Metal/year** yield in **6..20** (inclusive). While an empire owns/claims that star, the yield is paid each year into Metal (internal `ore`).

### Data

- New system field `metalYield` (integer 6–20).
- Assigned once at galaxy generation in `xt()` via seeded RNG: `6+Math.floor(r()*15)`.
- Helper `AiMetalYield(sys)` returns the yield; if missing/out of range (old saves), assigns a sticky value `6+(id*17+31)%15` and mutates the system so the next save persists it.
- Never re-rolled on yearly tick.

### Income (`de`)

- Yearly income helper `de(state, empire)` now adds `AiMetalYield(system)` for **every owned system**, then still sums colony district yields (`ue`) as before.
- Year tick already does `empire.ore += de(...).ore`, so claimed stars pay automatically for player and AI alike.
- Unowned / enemy stars do not pay you; richer stars still matter because the yield is visible when surveyed.

### UI

- **System sheet (Map):** when visibility is `surveyed` (owned by you, or surveyed), the epithet line includes e.g. `14 Metal/yr`.
- **HUD:** Metal stock chip tooltip title is `Metal · +N/yr` (N = full Metal income from `de`, including star yields + foundries).

### Edge cases

| Case | Behavior |
|------|----------|
| New galaxy | RNG yield 6–20 per star at gen |
| Old save missing field | Lazy assign on first `de` / sheet view; sticky thereafter |
| Invalid yield (&lt;6 or &gt;20) | Re-assigned via id formula |
| Empty star (no planets) | Still pays its metalYield when claimed |
| Pilgrim Claim / AI claims | Same; ownership drives payment |
| Colony foundries | Unchanged; stack on top of star yield |
| Fog (fringe / charted only) | Yield hidden until surveyed (or you own it → surveyed) |

## Functions / UI patched

- `AiMetalYield` (new, before `de`)
- `de` — owned-system Metal tithe
- `xt` — gen-time `metalYield`
- `Fn` system sheet epithet
- HUD Metal chip title (render path in `Vn`)

## How to test

1. Serve `/workspace/ashen-imperium-deploy/` (or hard-refresh after parent publishes). Confirm SW cache name is `ashen-imperium-v6`.
2. New game → survey a neighbor → system sheet shows `N Metal/yr` (6–20) before/after claim.
3. Claim the star → Advance the Year → Metal stock rises by at least that yield (plus any colony foundry income).
4. Re-open the same star across years → yield number unchanged.
5. Load an old v5 save → first year / sheet view assigns yields; save again; reload → same numbers.
6. Hover HUD Metal → tooltip `Metal · +N/yr` reflects owned-star yields.

## Verification

- `new Function(bundle)` syntax check: OK
- Isolated checks: sticky yield, range 6–20, `de` sums owned yields + foundries, old-save lazy assign
- Strings present: `AiMetalYield`, `metalYield`, `Metal/yr`, `ashen-imperium-v6` in sw.js

## Not done / out of scope

- No GitHub publish, no CloudAgent
- Asset filenames not renamed (cache bust via SW name only)
- No separate “star income” ledger line in the chronicle (HUD tip + system sheet only)
