# Ashen Imperium v8 — local deploy notes

Ship date: 2026-10-25. Patched in place on the Vite build under `/workspace/ashen-imperium-deploy/`.

## Files changed

- `assets/index-CkDh-r5-.js` — The Titan (Throne claim host; play continues)
- `sw.js` — cache bumped `ashen-imperium-v7` → `ashen-imperium-v8`
- `V8_NOTES.md` — this file

Unchanged asset filenames (index.html still references the same JS/CSS hashes). Save key remains `ashen-imperium-save-v1` (backward compatible: old saves have no Titan / no `throneTaken` until the colony threshold is hit under these rules; `isTitan` optional on fleets; `empire.throneTaken` optional).

Backup of pre-v8 JS: `assets/index-CkDh-r5-.js.bak-pre-v8`

## Feature: The Titan

When the player **takes the Throne** (reaches the colony threshold), they are given **the Titan** — a unique, enormous host that cannot be permanently destroyed, only driven back. **Play does not end.** The Titan is meant to be used in the continuing war.

### Trigger (important)

**Colony milestone in `dn()`, not an end-game victory.**

| Was (broken for gameplay) | Now |
|---------------------------|-----|
| `he(player) >= throneTarget` → set `e.victory = {kind:'throne'}` + grant Titan + `return` | Same threshold → set `empire.throneTaken`, lore/toast, `AiGrantTitan` once — **no** `e.victory`, **no** early return |
| `gn()` froze on victory → Titan arrived as the chronicle closed | Year ticks continue; Titan fights, can be pushed back |

- Threshold: `he(state, playerId) >= state.throneTarget` (default 8 colonies) — same number as the old Throne Ascension win.
- Once only: `empire.throneTaken` gates lore/toast/grant; `AiHasTitan` also blocks a duplicate fleet.
- Does **not** grant on game start, Total Conquest, Creed Hegemony, or load of an already-won save.
- Old saves that already stored `victory.kind === 'throne'` still render via `xe` / `Mn` (legacy); new play never writes that kind.

Toast + chronicle on claim:
- Lore: *Throne Ascension. N colonies sing your name. The galactic throne is claimed — the war goes on.*
- Toast: *The galactic throne is claimed.*
- Titan toast (from `AiGrantTitan`): *The Titan answers the Throne.*

### Real end-game victories (unchanged)

Still set `e.victory` and freeze `gn`:

1. **Defeat** — 0 stars and 0 fleet power
2. **`silence`** — **Total Conquest** (no alive rivals)
3. **`hegemony`** — **Creed Hegemony** (creed ≥ 80, ≥ 12 shrine districts, year ≥ 25)

Throne claim no longer appears in that list.

### Titan host

| Field | Value |
|-------|-------|
| Flag | `isTitan: true` |
| Id | `titan-<empireId>` (stable; not from `nextFleetSerial`) |
| Name | `The Titan` |
| Ships | 8 corvettes · 6 frigates · 14 cruisers |
| Base power `O()` | **994** (8×10 + 6×24 + 14×55) — doctrines/ethics still multiply via `pe` |
| Spawn | Owner capital (`homeSystemId`) if still owned; else first owned system |

### Cannot be destroyed — only pushed back

1. **Wipe rescue (`U` → `AiRescueTitans`)** — before empty fleets are deleted, any Titan with no ships left is restored to full Titan complement and relocated to capital / nearest owned system. Chronicle + toast: **"The Titan is driven back, unbroken."**
2. **Combat (`nn`)** — passes the year toast array into `U`; battle summary will not claim the loser was wiped if their Titan still exists.
3. **Forced retreat (`en`)** — surviving Titan among losers goes to capital/home (ships kept as-is; no free heal on non-wipe retreat).
4. **Anathema** — skips Titan targets.
5. **Fuel desertion (`cn`)** — prefers non-Titan hulls; Titan still rescued by `U` if emptied.
6. **Combine (`AiMerge`)** — keeps `isTitan` and renames survivor **The Titan**.

### UI / copy

- **Hosts tab:** `Titan · The Titan` + *Cannot be destroyed — only pushed back.*
- **System sheet / map:** Titan label; larger map marker (22).
- **HUD / Throne tab:** after claim → *Throne claimed · Titan* / *Throne claimed — the Titan answers*.
- **Tips / title:** Claim the Throne awakens the Titan and war continues; win via Total Conquest or Creed Hegemony.

## Functions added / patched

| Piece | Role |
|-------|------|
| `AiTitanShips` / `AiHasTitan` / `AiTitanHome` / `AiGrantTitan` / `AiPushTitan` / `AiRescueTitans` | Titan lifecycle |
| `U` | Rescue before filter |
| `dn` / `gn` | Milestone grant (no throne victory); still Conquest / Hegemony / Defeat |
| `nn` / `en` / `AiMerge` / Anathema / `cn` | Push-back & protect |
| `Ln`, system sheet, map, HUD, Throne tab, tips, title | Labels & copy |

## How to test

1. Serve `/workspace/ashen-imperium-deploy/` (hard-refresh). Confirm SW cache `ashen-imperium-v8`.
2. Reach **8 colonies** → toasts *The galactic throne is claimed.* + *The Titan answers the Throne.* → **year still advances**; Hosts shows Titan; no victory modal.
3. Fight with the Titan until a wipe would occur → pushed home unbroken; play continues.
4. Still win the game via Total Conquest or Creed Hegemony (victory modal + chronicle closed).
5. Advance years after claim → no second Titan / no re-toast (`throneTaken`).
6. Old pre-v8 save → no Titan until threshold under new rules; no crash on missing fields.

## Verification

- `new Function(bundle)` syntax check: OK
- Bundle no longer writes `victory.kind = 'throne'`
- Isolated checks: base power 994; grant once; wipe restores + home relocate
- Strings: helpers, toasts, `throneTaken`, `ashen-imperium-v8` in sw.js

## Not done / out of scope

- No GitHub publish, no CloudAgent
- No grant-on-load for saves that already recorded legacy Throne Ascension victory
- Asset filenames not renamed (cache bust via SW name only)
- Titan uses existing ship types at high counts (original IP name **the Titan** only)
