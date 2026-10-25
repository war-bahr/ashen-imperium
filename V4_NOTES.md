# Ashen Imperium v4 — local deploy notes

Ship date: 2026-10-25. Patched in place on the Vite build under `/workspace/ashen-imperium-deploy/`.

## Files changed

- `assets/index-CkDh-r5-.js` — gameplay (crises, doctrines, personalities, victory, coach)
- `sw.js` — cache bumped `ashen-imperium-v3` → `ashen-imperium-v4`
- `V4_NOTES.md` — this file

Unchanged asset filenames (index.html still references the same JS/CSS hashes). Save key remains `ashen-imperium-save-v1` (backward compatible: `personality` optional, doctrines via `techs[]`, `faithCd??{}` already present).

Backup of pre-v4 JS: `assets/index-CkDh-r5-.js.bak-pre-v4`

## Features

### 1) Mid-game crises (pendingChoice, once each via `firedEvents`)
| Year | Id | Title |
|------|-----|-------|
| 22 | `heresy-flare` | Heresy Flare |
| 28 | `void-plague` | Void Plague |
| 34 | `rival-crusade` | Rival Crusade |

- `pn()` fires them (skip if victory / another choice pending); toasts on trigger.
- Year 34 also picks the strongest alive rival, forces war, spawns `Crusade Host` (2 corvette + 1 frigate) on a border system or their home (`id: crusade-host`).
- `Ze()` returns choice cards; `$e()` applies options (tithe-of-bone preserved).

### 2) Doctrine tech branch
- Branch `doctrine` added to `l`; techs appended to `c`:
  - `host-doctrine` (90) — +12% host power in `pe()`
  - `shrine-doctrine` (90) — shrines +2 Faith each in `ue()`
  - `claim-doctrine` (90) — claims ×0.6 Metal in `M()`
- AI prefs `v` for each archetype append the three doctrine ids (late research).

### 3) Rival personalities
- `Et()` assigns `personality`: `iconoclast` / `warden` / `dreadnought` cycled by rival index (old saves → treat as `warden`).
- `Lt()` warChance/warYear hate bias vs player (creed/shrines, colony count, fleet power).
- `hn()` first-contact lore + toast flavor; Envoys card (`Rn`) shows personality.

### 4) Victory paths (`dn`, `xe`, `Mn`, tips)
1. Defeat — 0 stars and 0 fleet power
2. `silence` — **Total Conquest** (no alive rivals)
3. `throne` — **Throne Ascension** (colonies ≥ throneTarget)
4. `hegemony` — **Creed Hegemony** (creed ≥ 80, ≥ 12 shrine districts, year ≥ 25)

### 5) First-run Throne coach
- Tip text updated for Faith/Science rites and three win paths.
- First time player opens Throne tab: modal via `localStorage` key `ashen-coach-throne`.

## Functions patched

`c`/`l`/`v` data, `pe`, `ue`, `M`, tips `y`, `xe`, `Mn`, `dn`, `Et`, `Lt`, `hn`, `Rn`, `Ze`, `$e`, `pn`, Throne tab click (coach).

## Verification

- `new Function(bundle)` syntax check: OK
- Strings present: crisis titles, Doctrine techs, personality ids, hegemony / Throne Ascension / Total Conquest, coach key, `ashen-imperium-v4` in sw.js

## Not done / out of scope

- No GitHub publish, no CloudAgent, no planet-harvester / ludus-manager touches
- Asset filenames not renamed (cache bust via SW name only)
