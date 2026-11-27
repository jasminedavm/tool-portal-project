# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks and no build step: files should open directly in a browser.

## Project Structure

The repository is nearly empty for now. Update this section as files are added.

- `CLAUDE.md`: this file

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.

## Feature Plan

A web portal where students try out small web tools. The subject area is aviation human physiology.

### Portal structure

- **Homepage** (`index.html`): a short intro and a card for each tool.
- **Opening a tool:** the visitor clicks a tool's card on the homepage, which opens that tool's own page.
- **Getting back:** every tool page has a "Back to portal" link to the homepage.
- **Adding a tool later:** create a new folder under `tools/` with its own page, then add one card for it on the homepage. Nothing else needs to change.
- **Shared files:** styles in `css/`, the theme toggle in `js/`.

### Phases

**Phase 1: the portal plus its first tool**
- Portal homepage, light/dark toggle, responsive layout.
- First tool: a fatigue and alertness check, based on the two-process sleep model.
- Inputs: time woken up, current time, hours slept last night.
- Outputs: an alertness score, a label, a 24-hour curve, and a plain-language explanation.
- Clearly marked as for learning only, not for real flight-safety decisions.

**Phase 2: more tools** (not planned yet)
- Add further aviation physiology tools, one at a time, using the steps above.
