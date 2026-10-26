# Ashen Imperium v11 — Fuma star-chart seed

Ship date: 2026-10-26. Patched in place on the Vite build under `/workspace/ashen-imperium-deploy/`.

## Files changed

- `assets/index-CkDh-r5-.js` — special seed **Fuma** (fixed chart + Stronghold start)
- `sw.js` — cache bumped `ashen-imperium-v10` → `ashen-imperium-v11`
- `V11_NOTES.md` — this file

Backup of pre-v11 JS: `assets/index-CkDh-r5-.js.bak-pre-v11`

## How to load

On the founding screen, set **Star-chart seed** to `Fuma` (any casing). Blank still rolls a random numeric galaxy; other numeric seeds behave as before.

Internal sentinel seed number: `4655465` (shown in chronicle as `Fuma`).

## Fuma chart

- 24 systems laid out to match Nick’s hand sketch (red start on the mid-right spur)
- Hyperlanes follow the sketch spine, top cluster, right loop, left spur, and bottom cross
- Player home is forced to the red-start system regardless of seating RNG

## Fuma’s Stronghold (player home)

| Property | Value |
|----------|-------|
| Name | Fuma’s Stronghold |
| Metal/year | **20** (max) |
| Vigil Bastion | **rank 3** (fully upgraded) |
| Station | starhold |
| Worlds | **4**, habitability **95**, size **8** |
| Pre-built districts | Prime **Foundry**, II **Reactor**, III **Archive**, IV **Shrine** (all colonized) |

Other empires still seat on distant viable stars as usual (six thrones total).
