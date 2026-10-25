# Ashen Imperium v5 — local deploy notes

Ship date: 2026-10-25. Patched in place on the Vite build under `/workspace/ashen-imperium-deploy/`.

## Files changed

- `assets/index-CkDh-r5-.js` — host Combine / merge
- `sw.js` — cache bumped `ashen-imperium-v4` → `ashen-imperium-v5`
- `V5_NOTES.md` — this file

Unchanged asset filenames (index.html still references the same JS/CSS hashes). Save key remains `ashen-imperium-save-v1` (no schema change; fleets array already supports variable count).

Backup of pre-v5 JS: `assets/index-CkDh-r5-.js.bak-pre-v5`

## Feature: Combine hosts

Player-owned hosts in the **same star system** can be merged into one.

### UX

1. **System sheet (Map):** Chart/select a host. Under **Hosts present**, each other friendly host in that system gains a **Combine** button. Pressing it folds that host into the selected one.
2. **Selected-host banner:** When a host is selected and allies share its star, chips appear: **Combine &lt;name&gt;** for each co-located friendly host.
3. **Hosts tab:** Each host card shows **Combine &lt;name&gt;** for every other player host at the same star.
4. Toast + chronicle line on success (grimdark: “X folds into Y. The host swells.”).
5. Tip under Hosts tab mentions Combine.

### Data

- New action helper `AiMerge(state, keepId, absorbId)`.
- Validates: both exist, both `empireId === playerId`, same `systemId`, not self.
- Clears both `path` arrays (mid-move courses abandoned cleanly).
- Sums ship counts via existing `ie()` into the kept host (corvette/frigate/cruiser/surveyor/ark).
- Removes the absorbed fleet from `state.fleets`.
- Controller action `mergeHosts(keepId, absorbId)`; if the absorbed host was selected, selection moves to the kept host.
- Combat power follows existing `O()` / `pe()` on the summed ships (no separate power field).

### Edge cases handled

| Case | Behavior |
|------|----------|
| Different systems | Refused: “Hosts must share a star to combine.” |
| Enemy / non-player | Refused: “Those hosts do not answer you.” |
| Self | Refused: “A host cannot devour itself.” |
| Mid-move (path set) | Allowed; both courses cleared |
| Selection | Kept host remains / becomes selected |
| Empty after merge | N/A (ships always summed onto keep) |
| Old saves | Compatible; no new fields |

## Functions / UI patched

- `AiMerge` (new, after `He`)
- Controller `mergeHosts` action (after `clearPath`)
- `Fn` system sheet — Hosts present row + selected banner chips
- `Ln` Hosts tab — Combine chips + tip text

## How to test

1. Serve `/workspace/ashen-imperium-deploy/` (or hard-refresh the live PWA after parent publishes). Confirm SW cache name is `ashen-imperium-v5`.
2. At a starhold, lay hulls until you have two combat hosts, **or** move two hosts onto the same star.
3. Chart one host → system sheet → **Combine** on the other → toast; one host remains with summed ships; chronicle log entry.
4. Hosts tab: open two co-located hosts → **Combine &lt;name&gt;** on either card.
5. Negative: try Combine when hosts are in different systems (button should not appear); enemy hosts never show Combine.
6. Mid-move: set a course, then Combine — courses clear, ships merge.

## Verification

- `new Function(bundle)` syntax check: OK
- Isolated `AiMerge` unit check: ships sum, absorb removed, path cleared, enemy/diff-system/self rejected
- Strings present: `AiMerge`, `Combine`, `folds into`, `ashen-imperium-v5` in sw.js

## Not done / out of scope

- No GitHub publish, no CloudAgent
- No multi-select / drag-merge; pairwise Combine only (repeat to fold many)
- Asset filenames not renamed (cache bust via SW name only)
