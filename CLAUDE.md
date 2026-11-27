# Tool Portal Project

A web portal where students try out small web tools. The subject area is aviation human physiology.

## Tech Stack
- Language: plain HTML, CSS, and JavaScript only
- Framework: None (no frameworks)
- Database: None
- Build step: None (files open directly in a browser)
- Testing: None yet

## Commands
- Install: None yet
- Dev server: None yet (open `index.html` in a browser)
- Build: None yet
- Test (all): None yet
- Test (single file): None yet
- Lint: None yet
- Type check: None yet

## Project Structure
- `CLAUDE.md` - this file
- `index.html` - portal homepage
- `tools/` - one folder per tool
- `tools/fatigue/` - the fatigue and alertness check (`index.html`, `model.js` for the maths, `page.js` for the page, `fatigue.css`)
- `tools/altitude/` - the altitude and hypoxia explorer (`index.html`, `model.js`, `page.js`, `altitude.css`)
- `css/styles.css` - shared styles and the light/dark theme colors
- `js/theme.js` - the light/dark theme toggle

## Key Requirements
1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Code Style
- Follow existing patterns in the surrounding code
- Prefer small, focused functions
- Use descriptive names; avoid abbreviations
- No commented-out code; delete it instead

## Workflow
- Check pages in a browser (phone, tablet, and desktop widths; both themes) before considering a task done
- Make small, focused commits with clear messages
- Don't add new dependencies without asking
- Don't modify generated or vendor files: None yet

## Testing
None yet. Until tests exist, check changes by hand in a browser.

## Gotchas
None yet.

## Feature Plan

### Portal structure
- **Homepage** (`index.html`): a short intro and a card for each tool.
- **Opening a tool:** the visitor clicks a tool's card on the homepage, which opens that tool's own page.
- **Getting back:** every tool page has a "Back to portal" link to the homepage.
- **Adding a tool later:** create a new folder under `tools/` with its own page, then add one card for it on the homepage. Nothing else needs to change.
- **Shared files:** styles in `css/`, the theme toggle in `js/`.

### Phases

**Phase 1: the portal plus its first tool**
- [x] Step 1: portal homepage, theme toggle, responsive layout, and a placeholder "Tool 1 — coming soon" card that opens and returns via "Back to portal" (done; neutral styling, visual design to be chosen later).
- [x] Step 2: the real fatigue and alertness tool replaces the placeholder (done; plain styling).
  - Based on a simplified two-process sleep model.
  - Inputs: time woken up, current time, hours slept last night.
  - Outputs: an alertness score, a label, a 24-hour curve, and a plain-language explanation.
  - Clearly marked as for learning only, not for real flight-safety decisions.

**Phase 2: more tools**
- [x] Altitude and hypoxia explorer (done; plain styling).
  - Input: altitude from 0 to 45,000 ft, chosen with a slider.
  - Outputs: air pressure, oxygen available as a share of sea level, hypoxia stage and symptoms, time of useful consciousness, and two charts.
  - Clearly marked as for learning only, not for real flight-safety decisions.
- [ ] Further tools: not planned yet. Add them one at a time, using the steps above.

## Notes for Claude
- Explain technical terms in plain language
- Ask before making large refactors or architectural changes
- If requirements are unclear, ask rather than guess
- Keep explanations brief; show the diff or result
