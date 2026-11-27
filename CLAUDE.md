# Tool Portal Project

A web portal where students try out small web tools. The subject area is aviation human physiology.

**Audience:** Year 2 students of a Diploma in Aviation Management. They are future managers, not pilots, so each tool should explain why the topic matters for running aviation operations (rostering, safety culture, emergency procedures). Do not use the school's name, logo, or colors on the site.

## Tech Stack
- Language: plain HTML, CSS, and JavaScript only
- Framework: None (no frameworks)
- Database: None
- Build step: None (files open directly in a browser)
- Fonts: Space Grotesk and JetBrains Mono, loaded from Google Fonts with a `<link>` tag (the only outside resource; system fonts are the fallback)
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
- `tools/disorientation/` - the spatial disorientation illusions (`index.html`, `illusions.js` for the data, `page.js`, `disorientation.css`)
- `css/styles.css` - the design tokens (colors, fonts, spacing) and shared components; every page loads it
- `css/background.css` - the aviation background artwork; `styles.css` imports it, so pages get it automatically
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
- The Google Fonts `<link>` tags must be in the `<head>` of every page, before `css/styles.css`. Without internet the pages still work, using the fallback fonts.
- Background art: `css/background.css` uses the `html::before`, `body::before`, and `body::after` pseudo-elements. Don't use those for anything else.
- Page headings: the site name in the header is a `<p>`, each page has exactly one `<h1>`, and sections inside a tool page are `<h2>`.

## Design Direction

The visual direction is called **Checklist**: calm paper-and-ink colors, technical type, square corners, and hairline rules, like a pilot's checklist. Apply it to every page and tool. Do not hard-code colors, fonts, or spacing: use the tokens in `css/styles.css`.

### Palette
Both themes use the same token names. The default is the light theme.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--bg` | `#F3EFE6` | `#101214` | Page background |
| `--surface` | `#FBF8F1` | `#1A1D20` | Panels (results, explanations) |
| `--text` | `#1B1B1B` | `#F1EEE6` | Body text, strong rules, button borders |
| `--muted` | `#4D493E` | `#B5B0A3` | Secondary text |
| `--accent` | `#963306` | `#FF9A57` | Links, numbers, chart lines, focus ring, selected state |
| `--border` | `#C9C2B2` | `#3A3D40` | Hairline dividers (decoration only, never the only edge of a control) |

- Use one accent color only. Everything else is text, background, or border.
- Measured contrast on the page background: text 15:1 (light) and 16:1 (dark), muted text 7.8:1 and 8.7:1, accent 6.6:1 and 8.9:1. All pass the 4.5:1 minimum, and text over the background artwork was also checked pixel by pixel (worst case 4.8:1). Check new colors and any change to the background the same way.
- Controls need a visible edge: inputs and buttons use a 2px `--text` border.
- Do not rely on color alone to show a state (for example, a selected button also gets a thicker accent edge and bold text).
- Diagram colors that carry meaning (the sky and ground on the attitude dials) are tool-specific tokens in that tool's CSS, with a light and a dark value.

### Background
Every page has an aviation-themed background drawn behind the content. It combines four themes, all faint:
- **Sky:** a light blue-gray wash at the top of the page, and soft clouds.
- **Chart:** a fine map grid (small squares with heavier lines every 200px), contour lines, and dashed flight paths with waypoints, in the accent color.
- **Compass and radar:** a compass rose with a tick ring on the right, and range rings with a sweep line on the lower left.
- **Runway:** edge lines, a dashed centerline, and threshold stripes along the bottom.

Rules:
- It lives only in `css/background.css`. Pages and tools do not add their own background art.
- It is fixed to the window and never takes clicks. Content panels, inputs, and buttons keep solid backgrounds.
- Colors come from tokens: `--sky-wash`, `--grid-minor`, `--grid-major`, `--deco-ink`, and `--deco-accent`. Keep them faint (ink about 9%, accent about 20%), and recheck text contrast over the artwork if you change them.
- The shapes are SVG masks written inline as `data:` URLs, because separate SVG files cannot be used as masks when a page is opened straight from disk.
- It is hidden when printing. On phones the artwork shifts so the compass side shows.

### Typography
- Body and headings: **Space Grotesk** (`--font-body`), weights 400, 500, 700.
- Labels, buttons, numbers, and notes: **JetBrains Mono** (`--font-mono`), small (13 to 14px), uppercase with wide letter spacing for labels and buttons.
- Page title (`h1`): bold, tight line height (1.05), slightly negative letter spacing, sized with `clamp(2rem, 6vw, 3.25rem)`.
- Section headings (`h2`): 1.5rem bold. Body text: 1rem with 1.5 line height. Keep paragraphs under about 45rem wide.

### Spacing and shape
- Spacing scale: `--space-1` 0.5rem, `--space-2` 1rem, `--space-3` 1.5rem, `--space-4` 2rem, `--space-5` 3rem, `--space-6` 4rem. Use these, not one-off values.
- Page width: `--page-width` 70rem, centered. Side padding 1rem on phones, 2rem from 600px wide.
- Corners: `--radius` 2px (nearly square). No pill buttons, no large rounded cards.
- Rules: `--rule` 2px solid `--text` for the header line, section labels, buttons, and inputs. 1px `--border` for dividers between rows and around panels.
- Touch targets are at least 44px tall.

### Components (already in `css/styles.css`)
- Header: `.site-header` with `.site-title` and the theme toggle.
- Page: `.back-link`, one `h1`, `.eyebrow` and `.lead` on the homepage, `.section-label`.
- Homepage hero: `.hero` with the `.eyebrow`, `h1`, `.lead`, and a `.sky-lane` where a small plane flies along a dashed flight path (the animation stops for visitors who ask for reduced motion). The header's site name has a small plane icon, drawn with the `--plane` token.
- Homepage list: `.tool-list` with one `.tool-row` per tool, styled like a boarding pass: a boxed row with a number, icon, title link, description, a "Why it matters" line (`.tool-why`), and a perforated `.tool-stub` holding the "Open" button. The whole row is clickable and lifts on hover. Icons are simple 24px line drawings with a 1.75 stroke, using `currentColor`.
- Learning boxes: `.learn` with an `.learn-label` heading. Every tool page has three: Learning objective (after the intro), Key takeaway, and Think about it (a question plus a `<details>` discussion point), the last two after the tool and before the `.note`.
- Buttons: `.button` and `.theme-toggle`. Panels: `.result` and `.explanation`. Footnote: `.note` (every tool ends with a learning-only note). Charts: `.chart` with the `.chart-*` classes.
- Tool-specific styles go in the tool's own CSS file and must use the tokens above.

### Rules for new tools
- Start from an existing tool page for the `<head>` (fonts, `css/styles.css`, `js/theme.js`) and the header and back link.
- Reuse the shared components before writing new styles.
- Every tool page needs a learning objective, a key takeaway, and a "Think about it" question with a discussion point, written for aviation management students. Every homepage row needs a "Why it matters" line. Only state facts you are confident are correct, and flag figures that should be checked against a source.
- Keep motion minimal, and turn it off for visitors who ask for reduced motion.

## Feature Plan

### Portal structure
- **Homepage** (`index.html`): a short intro and a card for each tool.
- **Opening a tool:** the visitor clicks a tool's card on the homepage, which opens that tool's own page.
- **Getting back:** every tool page has a "Back to portal" link to the homepage.
- **Adding a tool later:** create a new folder under `tools/` with its own page, then add one row for it on the homepage by copying an existing `.tool-row` (numbering is automatic). Follow the Design Direction section below.
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
- [x] Spatial disorientation illusions (done; plain styling).
  - Four illusions: the leans, graveyard spiral, somatogravic illusion, and Coriolis illusion.
  - Each is a step-through animation with two dials: what the aircraft is really doing, and what the pilot feels.
  - Clearly marked as for learning only; angles and timings are illustrative.
- [x] Audience polish for Year 2 Diploma in Aviation Management students (done).
  - Homepage wording speaks to future aviation managers, with a "Why it matters" line for each tool.
  - Each tool has a learning objective, key takeaway, and reflection question.
  - Livelier visuals: boarding-pass tool rows, a plane flying across the hero, and a plane icon in the header.
- [ ] Further tools: not planned yet. Add them one at a time, using the steps above.

## Notes for Claude
- Explain technical terms in plain language
- Ask before making large refactors or architectural changes
- If requirements are unclear, ask rather than guess
- Keep explanations brief; show the diff or result
