# AI-LOG.md — ClubFlow PA#2

Trịnh Duy Nhân - 24217094

## 2026-11-08 — reviewing the assignment documents
Tool: Codex.

Asked for: Compare the ClubFlow brief and `AGENTS.md` with the project brief, PA#2 rubric, and self-assessment template.

Kept: The requirement-by-requirement review of the three-screen flow, Fix these list, responsive checks, and submission evidence.

Changed: The first PDF text extraction command failed because MiKTeX lacked access; switched to the bundled Python `pypdf` reader and checked the source PDFs directly.

Rejected: Treating the two planning files as proof of a finished submission; the repository had no prototype pages, screenshots, or validator results.

## 2026-11-08 — planning the brief
Tool: Codex.

Asked for: Explain implementation options, specify content to add to the brief.

Kept: A static HTML/CSS approach, a consistent five-application example, and a Vietnamese explanation for team review.

Changed: Kept the repository-facing prompt in English because the PA#2 rubric requires `brief.md` to be in English.

Rejected: No generated page code was accepted at this stage.

## 2026-11-08 — updating the implementation brief
Tool: Codex.

Asked for: Update `brief.md` with the scheduling and sample-data guidance discussed earlier.

Kept: A follow-up prompt covering one campaign timeline, A01–A05, real overlapping interviews, timetable counts, assignment rules, approval conditions, and visual-only controls.

Changed: Appended the guidance under Later prompts and changes instead of rewriting the initial prompt, preserving its order as required by `brief.md`.

Rejected: Claims that static HTML calculates schedules, saves data, exports files, or confirms a schedule; the prompt directs the team to document any unwired control in `PROTOTYPE.md`.

## 2026-11-08 — drafting the self-assessment
Tool: Codex.

Asked for: Create a basic `SELF_ASSESSMENT_REPORT.md` following the supplied template.

Kept: Seven rubric rows with current evidence, a provisional total, and sections describing unfinished work and a better logging process.

Changed: Used a progress snapshot of 8/100 instead of presenting an unverified final score; the page, accessibility, validator, screenshot, and commit criteria had no evidence yet.

Rejected: A submission-ready score or ZIP filename claim before the prototype and checks exist.

## 2026-11-08 — updating project rules
Tool: Codex.

Asked for: Update `AGENTS.md` to match the revised brief.

Kept: Shared sample-data rules, scheduling constraints, approval requirements, and documentation checks.

Changed: Clarified the team ownership lines and added explicit requirements for `PROTOTYPE.md`, `AI-LOG.md`, and the self-assessment.

Rejected: No commit was made; `AGENTS.md` requires an explicit request before committing or pushing.

## 2026-11-08 — evaluating the revised brief
Tool: Codex.

Asked for: Assess `brief.md` against clear criteria and explain each judgment.

Kept: The review of screen coverage, Fix these issues, technical constraints, sample-data consistency, and completion evidence.

Changed: Identified a remaining risk: the draft sample blocks approval, while the source flow also describes a visible Confirmed state. Suggested showing that state distinctly without contradicting the draft counts.

Rejected: A guaranteed top score for the brief before the team can show that these were the prompts actually used and the pages satisfy them.

## 2026-11-09 — clarifying the Confirmed state preview
Tool: Codex.

Asked for: Clarify how Screen 3 can show Confirmed while its main sample remains a conflicting draft.

Kept: The existing four-row draft and its 1 Proposed, 2 Conflict, and 1 Unassigned totals.

Changed: Added a separate, clearly labeled future-state preview to `brief.md`, with read-only behavior and disabled editing after valid approval.

Rejected: Marking the current conflicting draft Confirmed or adding a second timetable whose totals could be mistaken for the draft.

## 2026-11-09 — creating the campaign page

Tool: Codex (file editing, static checks, attempted local browser capture).

Asked for: create `index.html`.

Kept: The three-screen order, one-campaign timeline (20 October to 5 November 2026; interviews on 10 November 2026), static HTML/CSS constraints, required-field guidance, and a relative link toward application review.

Changed: Created `index.html` and its local `styles.css`. Added campaign details, three departments and positions with quotas, job descriptions and requirements, a native expandable preview, and clearly disabled draft/publish controls. Appended the user's prompt to `brief.md`.

Rejected: Claims that this static page stores a draft, validates publication, or publishes a campaign. The `review.html` link is prepared for the later screen and is not yet a working transition because that page has not been created.

Checks: Confirmed one H1, seven visible labels for seven form controls, and the viewport meta tag. Attempted a local headless Chrome screenshot, but Chrome produced no output in this environment, so responsive browser checks and W3C validation remain outstanding.

## 2026-11-09 — creating interview scheduling

Tool: Codex.

Asked for: `tạo schedule.html` (create `schedule.html`).

Kept: The same campaign, club, dates, positions, application IDs, and shortlisted applicants shown on the first two screens. A05 remains Rejected and is absent from scheduling.

Changed: Created `schedule.html`, extended `styles.css`, appended the user's prompt to `brief.md`, and added `PROTOTYPE.md` with team IDs, opening instructions, design choices, and exact visual-only controls. The draft has A01/A02 overlapping at 09:00–09:20 with different interviewers and rooms, A03 Proposed, and A04 Unassigned because its availability does not overlap with the qualified Content interviewer. Added approval blockers and a separate future Confirmed preview.

Rejected: Calling the current draft Confirmed, suggesting that A04 is rejected, or implying that disabled buttons generate, save, export, resolve, or approve a schedule.

Checks: All three pages have one H1, unique IDs, matched labels, existing relative links, and balanced HTML tags. The timetable has four rows and exactly 2 Conflict, 1 Proposed, and 1 Unassigned statuses. A05 does not appear in the timetable. CSS braces are balanced, with no `!important` or page-level horizontal overflow hiding. Browser-width, accessibility-pane, screenshot, and W3C Nu checks are still outstanding.

## 2026-11-09 — validating Nhân's HTML
Tool: Codex and the W3C Nu Validator.
Asked for: Check Trịnh Duy Nhân's campaign and scheduling pages.
Kept: The two pages' content, campaign timeline, and four-row draft state.
Changed: W3C found three invalid ARIA uses on generic `div` elements in `index.html` and three in `schedule.html`. Removed redundant labels and gave the scrollable timetable wrapper a valid `region` role.
Rejected: Treating local structural checks as W3C proof. Revalidated both edited files; `checks/validator-index.txt` and `checks/validator-schedule.txt` each record zero errors and zero other messages.
Checks: The two pages have one H1 each, matching labels for form controls, and the timetable has 2 Conflict, 1 Proposed, and 1 Unassigned rows. Browser-width and screenshot checks remain outstanding.

## 2026-11-09 — updating the provisional self-assessment
Tool: Codex (local repository inspection).
Asked for: Check only Person A's current work and update `SELF_ASSESSMENT_REPORT.md` without committing.
Kept: Evidence from `index.html`, `schedule.html`, the two W3C results, `brief.md`, and `AGENTS.md`.
Changed: Replaced stale claims that no pages or commits existed with a clearly provisional seven-criterion table. It gives no responsive or design credit while the shared CSS is absent.
Rejected: Claiming the team has a complete three-page flow or final ZIP score while `review.html`, `styles.css`, `PROTOTYPE.md`, and screenshots are missing from this local folder.
Checks: Confirmed the two A-owned HTML files and their W3C reports exist, but links to `review.html` and stylesheet links to `styles.css` currently have no targets. No commit or push was made.

## 2026-11-09 — preparing the remaining documentation commit
Tool: Codex (Git and document editing).
Asked for: Commit the remaining documentation after separate brief, campaign-page, and schedule-page commits.
Kept: The provisional report's evidence-only scoring and the existing AI work log.
Changed: Updated the report's commit-history evidence and provisional total from 32 to 34 after the three new local commits.
Rejected: Including `checks/` in Nhân's documentation commit because the original division assigns that folder to Dũng, or presenting the provisional score as the final ZIP score.
Checks: The current repository has separate local commits for the brief, `index.html`, and `schedule.html`; no push has occurred.
