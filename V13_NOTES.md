# Ashen Imperium v13 — fix Fuma Imperium founding crash

## Bug
v12 added a 7th archetype (`fuma-imperium`). Game creation still built `1 + (all remaining archetypes)` empires while only seating **6** homes via `St(..., 6)`. Lighting the throne with Fuma Imperium (or any pick once 7 archetypes exist) left the 7th empire with `homeSystemId` undefined → `Cannot read properties of undefined (reading 'name')`.

## Fix
- Shuffle remaining archetypes then **`.slice(0,5)`** so the galaxy always has 6 empires (player + 5 AI).
- Clearer throws if a seat or archetype lookup is missing.

## Files
- `assets/index-CkDh-r5-.js`
- `sw.js` → `ashen-imperium-v13`
- `V13_NOTES.md`
