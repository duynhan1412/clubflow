# Self-assessment — ClubFlow PA#2

Submitted by:

- Trịnh Duy Nhân — 24127094
- Tạ Đức Dũng — 24127347

Total claimed: **87 / 100** (ZIP: `24127094-24127347_87.zip`).

Scored on 2026-11-09 from the integrated repository (all three pages, shared `styles.css`, nine screenshots, three W3C results).

| Criterion | Max | Claim | Evidence |
|---|---:|---:|---|
| 1. Three linked ClubFlow screens | 20 | 18 | `index.html` (Create Recruitment Campaign) → `review.html` (Application Review) → `schedule.html` (Interview Scheduling). Main-flow links are relative files: `index.html` "Xem đơn ứng tuyển" → `review.html`; `review.html` "Xếp lịch cho 4 đơn Shortlisted" → `schedule.html`. A link check with JavaScript off found no missing target (AI-LOG, "creating `styles.css` and `review.html`"). Features follow `brief.md`; the *Fix these* items are addressed as listed in `PROTOTYPE.md` §4. We hold back 2 points because Dũng never read the original brief PDF directly — his side relied on `brief.md`. |
| 2. Responsive at 360, 768, 1280 px | 25 | 22 | `screenshots/` holds nine full-page captures with JavaScript off. At every width `clientWidth` equals the width and `scrollWidth > clientWidth` is `false`; nothing outside the timetable's own scroll wrapper passes the right edge; no standalone control is under 44 px at 360 px (AI-LOG "responsive pass"). The layout changes at 768 and 1280 px (`PROTOTYPE.md` §6). We deduct for the 360 px timetable, which is usable only by scrolling inside its wrapper, and for checks run through a script rather than by hand in DevTools. |
| 3. Semantic, valid HTML | 20 | 18 | `checks/validator-index.txt`, `validator-review.txt`, `validator-schedule.txt`: 0 errors, 0 warnings. Every page has `header`, `nav`, `main`, `footer`, one `h1`, ordered headings, and a visible `label` for every input. Actions are `<button>`, navigation is `<a href>`. We deduct because the Accessibility pane was not inspected by hand on every page. |
| 4. Design you can check | 10 | 8 | `styles.css`: spacing tokens `--space-1`…`--space-7` (4–48 px), colour and type tokens, no `!important`, no framework. No text under 16 px at 360 px; lowest contrast pair is 5.75:1. A few raw values remain outside the scale (1 px borders, the 3 px focus outline, `min-width: 56rem` on the timetable, 12–22 rem flex bases). |
| 5. The brief and the rules file | 10 | 8 | `brief.md` holds Nhân's prompts and Dũng's verbatim prompts in order; `AGENTS.md` records stack, ownership, the never list and definition of done. Dũng's own prompts are short and rely on the repository brief and screenshots rather than restating the constraints. |
| 6. `AI-LOG.md` | 10 | 9 | One entry per task for both members, with Tool / Asked for / Kept / Changed / Rejected / Checks. Errors caught by checks: W3C ARIA errors on Nhân's pages; 14 px text found by the 360 px text-size check (commit `10d5138`); closed `<details>` found by a JavaScript-off click test (commit `570676a`). |
| 7. Commit history | 5 | 4 | Separate commits for each page (`9fb3d0e` index, `ad00156` review, `f91aa4b` schedule), the stylesheet (`2c991ff`), a responsive pass (`10d5138`), evidence (`8fb9673`) and a fix (`570676a`), under each author's name. The very first commit (`b91bc8f`) is a README made when the GitHub repository was connected, not the rules file, and it carries the machine name "Junta"; the rules file arrives in `d77c55d`. |
| **Total** | **100** | **87** | |

## What we did not manage

- The search, filter, sort, export, pagination, decision, scheduling and approval controls are visual only; `PROTOTYPE.md` §5 lists each one.
- The first commit is not the rules file, and one commit carries a machine name rather than a member's name.
- The Accessibility pane was not inspected by hand on every page, and Dũng did not read the original ClubFlow brief PDF.

## What we would do differently

Agree on one repository and the first rules-file commit before either member starts, and set `git config user.name` on both machines on day one. Run the 360 px checks by hand in DevTools as well as by script.
