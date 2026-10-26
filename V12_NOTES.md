# Ashen Imperium v12 — Fuma Imperium (First Seed)

Ship date: 2026-10-26. Patched on `/workspace/ashen-imperium-deploy/`.

## Files

- `assets/index-CkDh-r5-.js` — new playable empire + Pattern Recall / Genesis Chart / Fuma-seed boss start
- `sw.js` — `ashen-imperium-v11` → `ashen-imperium-v12`
- `V12_NOTES.md` — this file

Backup: `assets/index-CkDh-r5-.js.bak-pre-v12`

## Fuma Imperium (playable on every map)

| Field | Value |
|-------|-------|
| Id | `fuma-imperium` |
| Epithet | **First Seed** |
| Defaults | Science + Militarism |
| Color | Seed gold `#c9a66b` |
| Lore | Precursor humans who seeded all life; every other throne is a copy |

Selecting the card sets empire name to **Fuma Imperium**.

### Pattern Recall (hidden combat)

- **+30%** host power when **attacking** another empire
- **+25%** host power when **defending** against another empire (damage resistance as durability)
- Does not inflate peacetime power readout (`attacking` must be explicitly true/false)
- First fight fires chronicle: *Pattern Recall: the seed remembers the clay.*

### Genesis Chart

Surveys also **chart neighboring stars** (same effect as Penitent Navigator / Star-Tomb Charts), baked into the archetype.

### Boss start — Fuma Imperium **on seed Fuma only**

| | |
|--|--|
| Tech | `cathedral-hulls` granted (cruisers unlocked) |
| Seed Host | **6** corvette · **5** frigate · **4** cruiser |
| Fleet name | `Seed Host` (replaces First Lance) |

Other maps / other empires keep the normal 4-corvette First Lance.
