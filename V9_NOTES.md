# Ashen Imperium v9 — local deploy notes

Ship date: 2026-10-25. Patched in place on the Vite build under `/workspace/ashen-imperium-deploy/`.

## Files changed

- `assets/index-CkDh-r5-.js` — same-year war attack lock
- `sw.js` — cache bumped `ashen-imperium-v8` → `ashen-imperium-v9`
- `V9_NOTES.md` — this file

Unchanged asset filenames (index.html still references the same JS/CSS hashes). Save key remains `ashen-imperium-save-v1` (backward compatible: war relations already store `{kind, since, until}`; missing `since` on a war relation is treated as already fightable so old saves never soft-lock).

Backup of pre-v9 JS: `assets/index-CkDh-r5-.js.bak-pre-v9`

## Feature: Steel waits — no attacks the year war is declared

When an empire **declares war**, **neither side** may resolve **offensive combat** against that foe in the **same year**. Fighting becomes legal starting the **next year** (`year > relation.since`).

Nick’s ask was that the declarer cannot attack that year; the cleaner mutual lock (both sides) is what shipped so AI and player share one rule and mid-year clashes cannot soft-exploit “defender may still fight.”

### Exact rule

| Check | Result |
|-------|--------|
| `relation.kind === 'war'` and `typeof since === 'number'` and `since === currentYear` | **Fresh war** — combat between those two empires does **not** resolve |
| War with `since` missing / non-number | Treat as eligible (old / odd saves) |
| `year > since` | Combat allowed |
| Pale Reavers | Always fightable (crisis; no diplomatic `since`) |

Movement into enemy systems (and war-only border entry for attack/claim destinations) **remains allowed**. Fleets may arrive and sit; **battle / claim-by-conquest does not fire** until the lock lifts.

### Feedback

Toast (player-involved): **"War was declared this year — steel waits until next year."**

Fired when:

1. Player declares war, or is declared upon, via Envoys / AI diplomacy (`We`)
2. Rival Crusade event sets war on the player
3. Year resolution finds player hosts (or stations) co-located with a fresh-war foe but skips the fight (`AiToastFreshWar`)

### Hook points

| Piece | Role |
|-------|------|
| `H(..., 'war', year, 0)` via `We` / crusade / AI | Declare still sets `since` to the current year (unchanged) |
| `AiWarFresh` | True when that pair’s war `since === e.year` |
| `AiCanFight` | `w(...)` (at war) and not fresh |
| `$t` | Battle picker — only returns pairs that `AiCanFight` (station defenders included) |
| `an` → `nn` | Combat loop; toasts fresh-war standoffs when nothing fightable remains |
| `Rt` | AI war pathing: only **seeks** systems of empires that are already fightable; still **holds** in any war system (including fresh) so next year’s battle can fire |
| `w` | Unchanged diplomatic “at war” helper (borders, hold-in-place, capture post-fight) |

AI diplomacy (`Lt` → `We`) and Rival Crusade respect the same lock because combat goes through `$t` / `AiCanFight`.

### Not changed

- Peace / truce / pact rules
- Tithe Gates / border fly-through (war still may enter destination systems to attack/claim; attack just won’t resolve same year)
- Save schema / key
- Titan / Border Vigil / prior v4–v8 features

## How to test

1. Serve `/workspace/ashen-imperium-deploy/` (hard-refresh). Confirm SW cache `ashen-imperium-v9`.
2. Declare war in year N → toast includes steel-waits line; `relations[foe].since === N`.
3. Move a host into an enemy system and end year N → no battle report; steel-waits toast if co-located; system not captured.
4. End year N+1 with hosts still engaged → combat resolves normally.
5. AI-declared war / Rival Crusade in year N → same lock vs the player.
6. Old save with an ongoing war and no / odd `since` → still able to fight (no soft-lock).

## Verification

- `new Function(bundle)` syntax check: OK
- Helpers present: `AiWarFresh`, `AiCanFight`, `AiToastFreshWar`
- `$t` gates on `AiCanFight`; `Rt` uses fightable subset for attack seeks
- Toast string present; SW `ashen-imperium-v9`

## Not done / out of scope

- No GitHub publish, no CloudAgent
- Asset filenames not renamed (cache bust via SW name only)
- Declarer-only lock (mutual lock chosen instead)
