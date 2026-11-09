# Self-assessment — ClubFlow PA#2

**Status: provisional progress review on 2026-11-09; not ready for submission.** This table scores the repository as it exists now using evidence from Trịnh Duy Nhân's work only. Reassess every criterion and replace the total after the team's third page, shared CSS, screenshots, and commits are integrated. Do not use this provisional total in the ZIP filename.

Submitted by:

- Trịnh Duy Nhân — 24127094
- Tạ Đức Dũng — 24127347

Current provisional claim: **34 / 100**.

| Criterion | Max | Current claim | Evidence and current gap |
|---|---:|---:|---|
| Three linked ClubFlow screens | 20 | 5 | `index.html` covers campaign creation and `schedule.html` covers interview scheduling. Both use the same campaign dates and sample data. `review.html` is absent from this local repository, so links to it are currently broken and the three-screen flow cannot be checked. |
| Responsive at 360, 768, and 1280 px | 25 | 0 | Both A-owned pages exist, but their linked `styles.css` is absent. No 360/768/1280 browser inspection or full-page screenshot has been completed. |
| Semantic, valid HTML | 20 | 8 | `checks/validator-index.txt` and `checks/validator-schedule.txt` record zero W3C Nu errors and zero other messages after an ARIA correction. Both A-owned pages have one H1 and associated input labels. The absent third page and browser Accessibility-pane inspection prevent a full-team claim. |
| Design you can check | 10 | 0 | The shared stylesheet is absent, so spacing, contrast, hierarchy, and tap-target sizes cannot be verified in the current repository. |
| The brief and the rules file | 10 | 9 | `brief.md` records the implementation request and later prompts, including the consistent sample state and Confirmed preview. `AGENTS.md` records the stack, ownership, semantic rules, responsive checks, and never list. |
| `AI-LOG.md` | 10 | 9 | `AI-LOG.md` has task-level entries and records the six ARIA errors found on the two A-owned pages by W3C, what changed, and the zero-error recheck. It also records the current missing-page and missing-CSS limitation. |
| Commit history | 5 | 3 | `.git` contains the initial rules commit (`d77c55d`), the brief update (`4633458`), and separate commits for `index.html` (`9fb3d0e`) and `schedule.html` (`f91aa4b`). The Review page and responsive-pass commits are still missing. |
| **Total** | **100** | **34** | **Provisional only; recalculate from the integrated submission before naming the ZIP.** |

## What we did not manage yet

The current local repository does not contain `review.html`, `styles.css`, `PROTOTYPE.md`, or the nine required screenshots. Links from the A-owned pages to `review.html` therefore do not open a file. Responsive layout, tap targets, contrast, and the complete three-page flow have not been checked in a browser. The A-owned pages and updated brief have local commits; the W3C evidence is not committed, and nothing has been pushed.

## What we would do differently

Integrate the two members' files before the final responsive pass, then capture all nine screenshots and score the seven rubric criteria from the exact folder that will be zipped. Keep each page and the responsive pass in clearly named commits under the correct author names.
