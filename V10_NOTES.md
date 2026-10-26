# Ashen Imperium v10 — local deploy notes

Ship date: 2026-10-26. Patched in place on the Vite build under `/workspace/ashen-imperium-deploy/`.

## Files changed

- `assets/index-CkDh-r5-.js` — Vigil Bastion (build / upgrade / combat garrison)
- `sw.js` — cache bumped `ashen-imperium-v9` → `ashen-imperium-v10`
- `V10_NOTES.md` — this file

Unchanged asset filenames (index.html still references the same JS/CSS hashes). Save key remains `ashen-imperium-save-v1` (backward compatible: missing `vigilLevel` treated as **0** — no crash, no free bastion).

Backup of pre-v10 JS: `assets/index-CkDh-r5-.js.bak-pre-v10`

## Feature: Vigil Bastion

Player-built **stationary defense** on an owned **starhold**, so a border star can fight without a host present. Name chosen for grimdark tone and to sit beside Border Vigil (v7 Tithe Gates) without colliding with the existing `station` field (`none` / `outpost` / `starhold`).

### Persistence

| Field | Values | Notes |
|-------|--------|-------|
| `system.vigilLevel` | `0`–`3` | One bastion per system; `0` = none |
| Old saves | missing / non-number | `AiVigilLevel` → `0` |

New galaxies initialize `vigilLevel: 0` on every system.

### Build / upgrade (player only)

Only on **your** systems with `station === 'starhold'`. Outposts must be raised to starhold first. One bastion per star (the level field itself).

| From → To | Metal | Fuel | Garrison power added |
|-----------|------:|-----:|---------------------:|
| 0 → 1 (Raise) | 55 | 8 | +28 |
| 1 → 2 (Upgrade) | 85 | 0 | +55 |
| 2 → 3 (Upgrade) | 130 | 0 | +90 |
| 3 | — | — | max; button hidden |

Toast / lore on raise or upgrade. Tip: *“Raise a Vigil Bastion on a starhold to garrison the border without a host…”*

### Combat

Starhold / outpost base power (`le(station)`: outpost 14, starhold 46) is unchanged. Bastion power is **added** when the **system owner is the defender**:

`defenderPower = fleetPower×doctrine + le(station) + AiVigilPower(system)`

`$t` already pulls the system owner into a fight when `le(station) > 0` (starhold/outpost), even with **no fleets** in-system — so a Vigil Bastion on a starhold fights invaders alone. Fresh-war lock (v9) still applies.

#### Damage / destruction (not undying)

When the system owner was defending and had `vigilLevel > 0`:

| Outcome | Bastion |
|---------|---------|
| Attacker wins **and captures** the star | Razed → `vigilLevel = 0` |
| Attacker wins, no capture | Rank drops by 1 (to 0 = destroyed) |
| Defender wins | Unscathed |

War chronicle lines: razed / scarred to rank N / falls silent. Rebuild from rank 0 with the Raise cost again.

### UI

- **System sheet** (owned starhold): “Vigil Bastion” section — rank + garrison tip, or “None…”; **Raise** / **Upgrade** ghost button with cost (disabled if short Metal/Fuel).
- **Epithet**: `vigil bastion N` when present.
- **Map**: small filled chevron under the ownership pip when `vigilLevel > 0` (visible under the same fog rules as the pip).

### AI

**Skipped.** AI does not build or upgrade Vigil Bastions. Documented intentional omission — player-only border fortifications for this ship.

### Limits

- One per system (`vigilLevel` scalar)
- Starhold-owned only
- Max rank 3
- No host required to defend
- Captured stars do not keep the previous owner’s bastion

### Functions added / patched

| Piece | Role |
|-------|------|
| `AiVigilLevel` / `AiVigilPower` / `AiVigilCost` / `AiVigilFuel` | Defaults, power table, costs |
| `AiRaiseVigil` | Spend + bump level |
| `raiseVigil` (controller) | Player action |
| `nn` | Adds bastion to defender power; scar / raze after fight |
| `an` | Empty-power guard includes bastion |
| System sheet / epithet / map / tips | UX |
| Galaxy init | `vigilLevel:0` |

`$t` / `AiToastFreshWar` unchanged (starhold `le` already registers the owner as a defender).

## How to test

1. Serve `/workspace/ashen-imperium-deploy/` (hard-refresh). Confirm SW cache `ashen-imperium-v10`.
2. Own a **starhold** → system sheet → **Raise Vigil Bastion · 55 Metal · 8 Fuel** → epithet shows `vigil bastion 1`; map chevron appears.
3. Upgrade to rank 2 then 3; confirm costs 85 / 130 Metal and button disappears at 3.
4. Move all hosts away. Declare war (wait until next year per v9). Enemy host enters the bastion star → battle resolves **without** your fleet; defender power includes garrison.
5. Lose a fight without capture → rank drops; lose with capture → bastion gone; rebuild works.
6. Load a pre-v10 save → no crash; systems behave as rank 0 until raised.

## Verification

- `new Function(bundle)` syntax check: OK
- Helpers / strings present: `AiVigilLevel`, `AiRaiseVigil`, `Vigil Bastion`, `raiseVigil`
- SW `ashen-imperium-v10`
- Unit checks: level clamp, costs, power table, starhold+L3 = 136 garrison total with base 46

## Not done / out of scope

- No GitHub publish, no CloudAgent
- AI does not build bastions
- Asset filenames not renamed (cache bust via SW name only)
- No separate HP bar (rank is the durability track)
