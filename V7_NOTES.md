# Ashen Imperium v7 — local deploy notes

Ship date: 2026-10-25. Patched in place on the Vite build under `/workspace/ashen-imperium-deploy/`.

## Files changed

- `assets/index-CkDh-r5-.js` — Tithe Gates / Border Vigil / passage grants
- `sw.js` — cache bumped `ashen-imperium-v6` → `ashen-imperium-v7`
- `V7_NOTES.md` — this file

Unchanged asset filenames (index.html still references the same JS/CSS hashes). Save key remains `ashen-imperium-save-v1` (backward compatible: borders default **open** until Tithe Gates is researched; missing `passageGrants` / `borderStance` treated as `{}` / `open`).

Backup of pre-v7 JS: `assets/index-CkDh-r5-.js.bak-pre-v7`

## Feature: Border Vigil (Tithe Gates)

Players (and AI) can decide who may travel into claimed systems once the **Tithe Gates** doctrine is known.

### Civic / toggle

| Piece | Id / values |
|-------|-------------|
| Doctrine tech | `tithe-gates` — **Tithe Gates** (cost 70) |
| Throne policy | **Border Vigil** stances: `open` · `ask` · `tribute` · `closed` |
| Labels | Open Lanes · Border Vigil (Ask) · Tithe Gates (Tribute) · Closed Borders |

- Research **Tithe Gates** under Doctrine on the Throne tab.
- After unlock, Throne shows stance chips. Default for the player stays **Open Lanes** until changed.
- AI auto-picks a stance on completing Tithe Gates from personality:
  - `warden` → Ask
  - `dreadnought` → Tribute
  - `iconoclast` → Closed

### Transit rules (when owner has Tithe Gates and stance ≠ open)

1. **Pact** — free access through owned systems (no ask, no tax).
2. **War** — no peaceful fly-through. Entry into an owned system is allowed only when that system is the **path destination** (attack / claim intent). Intermediate hops through other owned stars while bound elsewhere are blocked.
3. **Neutral / rival / truce** —
   - **Ask**: blocked until a passage grant exists (Envoys: Request passage / Offer tribute; or AI passage-plea judgment).
   - **Tribute**: free ask refused; must pay Metal tithe for a grant.
   - **Closed**: no peaceful transit (pact or war-attack only).
4. **Passage grants** — `empire.passageGrants[otherId] = untilYear` (8 years). Stored on the **owner** empire (who may enter *their* space).
5. **Pale Reavers** ignore border checks (crisis raiders).

Fair play: the same `AiMayEnter` check applies when the player charts a course into AI space and when AI hosts path into player space.

### Ask / tribute UX

- **Player → AI (Envoys):** Request passage (wardens often accept; dreadnought/iconoclast demand tribute) or Offer tribute (Metal = `max(15, 10 + 3×ownerStars)`).
- **AI → Player:** If Ask/Tribute stance blocks an AI path, a **Passage Plea** judgment is queued (`pendingChoiceId: passage-plea`). Choices: Grant passage / Demand tribute / Refuse.
- **Player grant:** Envoys chip **Grant passage** (8 years) when your borders are not Open.
- Blocked chart orders toast the refusal reason (no silent fail). Yearly move (`qt`) also drops illegal next hops as a safety net.

### Persistence

- `empire.borderStance` — string, default `open`
- `empire.passageGrants` — `{ [empireId]: untilYear }`
- `state.pendingPassage` — ephemeral plea payload (cleared with the judgment)
- Old saves: no Tithe Gates → effective open borders; no soft-lock

### UI surfaces

- Throne: Border Vigil section (or tip to research Tithe Gates)
- Envoys: stance lines + Request / Offer tribute / Grant chips
- System sheet epithet: stance label when owner enforces borders
- Tips array mentions Tithe Gates

## Functions patched / added

- New: `AiStanceLabel`, `AiBorderStance`, `AiTributeCost`, `AiHasPassage`, `AiInitBorderStance`, `AiMayEnter`, `AiAllowedSystems`, `AiSetBorder`, `AiGrantPassage`, `AiRequestPassage`, `AiQueuePassage`, `AiFlushPassage`
- `Ve` — player course validation
- `qt` — hop safety
- `Rt` — AI paths use allowed-system mask; queues passage pleas
- `gn` — flushes passage plea before movement
- `ln` / `Qe` — init AI/player stance on Tithe Gates complete
- `Ze` / `$e` — `passage-plea` judgment
- `In`, `Rn`, `Fn` — UI
- Controller: `setBorderStance`, `requestPassage`, `grantPassage`
- Data: tech `tithe-gates`, AI prefs append, empire create fields

## How to test

1. Serve `/workspace/ashen-imperium-deploy/` (hard-refresh). Confirm SW cache `ashen-imperium-v7`.
2. New game → Throne → Doctrine → research **Tithe Gates** → set stance to **Ask** or **Closed**.
3. Meet a neutral → try to chart a host through their owned star → toast blocks; Envoys → Offer tribute / Request passage → then course succeeds.
4. Propose a pact → course through their space succeeds with no grant.
5. Declare war → chart *through* an enemy star to somewhere else → blocked; chart *to* that enemy star (attack) → allowed.
6. Set your borders to Ask; let years pass until an AI hits the border → Passage Plea modal → Accept / Tribute / Refuse.
7. Load a pre-v7 save → borders behave as Open until Tithe Gates is researched; no crash on missing fields.

## Verification

- `new Function(bundle)` syntax check: OK
- Rule unit checks: pact free; war fly-through blocked / dest attack ok; neutral needs grant; closed refuses; no-tech = open
- Strings present: `tithe-gates`, `Border Vigil`, `passage-plea`, `AiMayEnter`, `ashen-imperium-v7` in sw.js

## Not done / out of scope

- No GitHub publish, no CloudAgent
- No per-system grants (empire-pair grants only)
- Asset filenames not renamed (cache bust via SW name only)
- AI does not dynamically renegotiate mid-path after a grant in the same year (grant applies next chart / next year hop check)
