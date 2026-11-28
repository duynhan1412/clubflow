# ClubFlow AI Log

Trịnh Duy Nhân — 24127094
Tạ Đức Dũng — 24127347

## PA#2

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

## 2026-11-09 — setting up the repository (Tạ Đức Dũng — 24127347)
Tool: Claude Code (Claude Opus 5.5).
Asked for: `setup cho toi` — connect a local folder to the empty `duynhan1412/clubflow` repository.
Kept: The clone and the `README.md` commit `b91bc8f`, which Nhân later merged into his history.
Changed: When Nhân's history arrived with `AGENTS.md`, the assistant dropped its own `CLAUDE.md` rules-file commit (kept only on the local branch `backup/dung-claude-md`) so the team has one rules file. Set the repository's `user.name` to Tạ Đức Dũng; the README commit still shows the machine's global name "Junta".
Rejected: The assistant's plan to rewrite the first commit with `git push --force` so that it holds the rules file; the force push was blocked and the team history was kept as it is.
Checks: `git log --all --graph` after `git fetch` showed both histories joined at Nhân's merge `1178f42`.

## 2026-11-09 — planning Dũng's part
Tool: Claude Code (`/ak:brainstorm`).
Asked for: `brainstorm đề bài này cho tôi`, with the assignment, rubric and team task screenshots.
Kept: Static HTML with plain CSS custom properties; `<details>` for each application's CV and motivation so they open without JavaScript; a GET form for search/filter/sort documented as not wired; list and detail stacked on a phone and side by side at 1280 px.
Changed: The assistant could not open the ClubFlow brief on Google Drive (sign-in required, HTTP 401); the screen features and *Fix these* list were then taken from the repository's `brief.md`.
Rejected: Switching to React (no extra marks, plus a `dist/` folder to hand in).
Checks: None — planning only.

## 2026-11-09 — creating `styles.css` and `review.html`
Tool: Claude Code.
Asked for: `repo mới được bạn kia commit đó, xử lý đi` — make Dũng's files against `AGENTS.md` and `brief.md`.
Kept: One stylesheet for all three pages using the classes Nhân's pages already use; spacing tokens `--space-1`…`--space-7` (4–48 px), breakpoints 48rem/80rem, `--tap` 44 px. `review.html` with the same campaign, dates, positions and A01–A04 people as Nhân's pages, a long-named applicant for A05 (Tôn Nữ Hoàng Phương Thảo Nguyên, Rejected), statistics 5/4/4/1, CV + motivation + internal note + Shortlist/Reject for every application, and a relative link to `schedule.html`. The top navigation wraps to full width at 360 px, which removes the nav item past the right edge that Nhân's earlier review noted.
Changed: Replaced the hard-coded `4px` accent borders with `var(--space-1)` so the stylesheet stays on the scale.
Rejected: A table for the application list (it would need a horizontal scroll wrapper at 360 px); cards were used instead.
Checks: A Playwright script loaded each page from the folder with JavaScript disabled at 360/768/1280 px: `clientWidth` equalled the width, `scrollWidth > clientWidth` was `false`, nothing outside the timetable's scroll wrapper passed the right edge, no standalone control was under 44 px, one `h1` per page, and every link target exists. W3C Nu checker: 0 errors, 0 warnings for all three pages (`checks/`). Commits `2c991ff` and `ad00156`.

## 2026-11-09 — responsive pass
Tool: Claude Code.
Asked for: Fix whatever the 360/768/1280 checks found.
Kept: Layout and breakpoints unchanged.
Changed: The text-size check at 360 px listed 14 px text on badges, eyebrows, kickers and section numbers on all three pages (`--text-xs: 0.875rem`). Raised `--text-xs` to 1rem; the re-run listed no text under 16 px. Commit `10d5138`; screenshots retaken in `8fb9673`.
Rejected: Hiding the timetable's overflow at 360 px; it keeps scrolling inside `.table-wrap`, which the rubric allows.
Checks: Same script re-run: all nine page/width combinations pass; contrast computed for every colour pair in `styles.css` (lowest 5.75:1, danger badge).

## 2026-11-09 — "View detail" links did not open the application
Tool: Claude Code.
Asked for: Verify the claims written into `PROTOTYPE.md`.
Kept: Native `<details>` for each application.
Changed: A click test with JavaScript off showed that "Xem chi tiết A03" scrolled to A03 but left it closed, because the fragment id was on the `<details>` element itself. Moved each `id="detail-a0x"` onto the `.detail-body` inside its `<details>`; Chrome then opens it. Re-ran W3C (0 errors) and the width checks. Commit `570676a`.
Rejected: A sentence the assistant first wrote in `PROTOTYPE.md` claiming the brief's own screen shows the detail as an overlay — nobody on Dũng's side had read the source screen, so it was removed.
Checks: Click test reports A03 open after the link; W3C result in `checks/validator-review.txt`.

## PA#3

## 2026-11-23 - consolidating project and milestone requirements

Tool: Codex (PDF review, repository inspection, requirements analysis, and file editing).

Asked for: Write the project requirements and describe the work required in each PA.

Kept: The official ClubFlow scope, C1-F11 feature flow, shared sample timeline, role and ownership boundaries, scheduling and confirmation rules, milestone weights/deadlines, rubric criterion totals, and the repository's current PA#3 contract-first/harness direction.

Changed: Added `REQUIREMENTS.md` as a consolidated English reference covering product goals, users, in/out-of-scope boundaries, features, business rules, non-functional requirements, PA#1-PA#6 work and deliverables, rubric summaries, cross-milestone dependencies, shared submission rules, source limitations, and the current PA#3 priorities. Normalized the milestone headings to `## PA#2` and `## PA#3` without changing historical entries.

Rejected: Inventing detailed PA#1 or PA#3 rubric requirements that are not present in the workspace, treating PA#3 mock behavior as real backend enforcement, or describing PA#5 harness history as work that can be reconstructed at the deadline.

Checks: Re-read the PA#2 rubric and cross-checked the consolidated requirements against the ClubFlow brief, final milestones summary, and PA#4-PA#6 rubrics already reviewed. Confirmed every milestone PA#1-PA#6 is represented, criterion totals add to 100 where listed, and the document distinguishes authoritative rubrics from summary-only information. No commit or push was made.

## 2026-11-23 - restoring the PA#2 project rules

Tool: Codex (Git inspection and file restoration).

Asked for: Restore `AGENTS.md` to the PA#2 version.

Kept: The exact PA#2 rules stored at `HEAD`, including static HTML/CSS constraints, original ownership, sample data, responsive and semantic requirements, never-list, and PA#2 definition of done.

Changed: Replaced the uncommitted PA#3 version of `AGENTS.md` with the committed PA#2 content. The first `git restore` attempt could not create `.git/index.lock` because the sandbox has read-only Git metadata, so the same `HEAD` content was restored through a direct workspace patch instead.

Rejected: Reverting `AI-LOG.md`, deleting `REQUIREMENTS.md`, or changing any PA2 implementation/evidence file; the request named only `AGENTS.md`.

Checks: Compared `AGENTS.md` with `HEAD`; no file diff remains for `AGENTS.md`. No commit or push was made.

## 2026-11-23 - preparing PA#3 documentation progress for review

Tool: Codex (document review, Git branching, selective staging, and commit verification).

Asked for: Fix the identified documentation inconsistencies, split the current progress into clean commits, and push it on `pa3/requirements` without changing `main`.

Kept: `main` as the PA#2 baseline, the restored PA#2 `AGENTS.md`, the cumulative PA#2 log entries, and the two-commit separation between project requirements and the AI log.

Changed: Added both team members and correct student IDs to the log header, corrected the PA#3 priority statement so it no longer claims that PA#3 rules are already current, created branch `pa3/requirements`, and committed only `REQUIREMENTS.md` as `38ebe97` (`docs(project): add consolidated requirements and milestone guide`).

Rejected: Staging `AGENTS.md`, committing directly on `main`, combining requirements and AI-log changes in one commit, or merging the documentation branch into `main` during this task.

Checks: `AGENTS.md` matches `HEAD`; the first commit contains only `REQUIREMENTS.md`; `git diff --check` passes after removing trailing whitespace from the team metadata. The AI-log commit and remote branch are verified separately after this entry is written.

## 2026-11-25 - dividing PA#3 work (Tạ Đức Dũng — 24127347)

Tool: Claude Code (Claude Opus 5.5).

Asked for: `bạn tôi vừa push requirements đồ án lên, chia task thử cho tôi đi` (divide the work in the requirements Nhân pushed), then `tạo một branch mới, đẩy plan này lên cho tôi đi` (push the plan on a new branch).

Kept: The PA#3 scope, rubric weights, deadline, and contract-first order from `REQUIREMENTS.md` on `origin/pa3/requirements`; the PA#2 ownership split (Nhân: campaign and scheduling; Dũng: review and styles).

Changed: Added `PA3-PLAN.md` on branch `pa3/task-plan` (based on `pa3/requirements`) as a proposal: shared foundation owners, C1–C11 slices per member, a day-by-day schedule to 2026-11-30, and risks. Wrote it in English to match the other repository documents, although the plan was first given in Vietnamese in chat.

Rejected: Treating the plan as agreed (it is marked as a proposal), editing Nhân's `brief.md` or `AGENTS.md`, and merging into `main`.

Checks: `git fetch` found the new remote branch `pa3/requirements`; no PA#3 rubric or contract checker exists in the repository or its parent folder, which the plan lists as the first task.

### Shared foundation, rubric and implementation brief

#### 2026-11-26 - preparing the PA#3 shared foundation

Tool: Codex (workspace inspection and file editing).

Asked for: `cập nhật AGENTS.md, chuẩn bị dữ liêu và API README, không commit`

Kept: PA#2 sample records and the PA#3 ownership and contract-first workflow from the task plan.

Changed: Updated `AGENTS.md` and prepared the shared mock data and API README.

Rejected: Treating the proposed API conventions as final or implementing the mock runner and React client as part of this task.

Checks: Cross-referenced the source HTML, task plan and requirements. The official contract checker is pending. No commit or push was made.

#### 2026-11-26 - aligning the API documentation with the official rubric

Tool: Codex (rubric extraction, checker source review and repository documentation edits).

Asked for: `cập nhật readme và các tài liệu liên quan`

Kept: Proposed routes, shared error fields and the existing team ownership.

Changed: Updated `docs/api/README.md`, `AGENTS.md`, `REQUIREMENTS.md` and `PA3-PLAN.md` to document checker-readable endpoint rows, runnable response examples, the official mock modes, restart-safe tokens and the required fixture directory.

Rejected: The earlier header-based mock mode, 422 field validation, 503 simulated failures and an unpaired HTTP response block. The official rubric and checker source exposed the differences.

Checks: Compared the endpoint table and example conventions with the checker parser and rubric. The checker needs per-resource examples and a running mock for an end-to-end run. No commit or push was made.

#### 2026-11-26 - preparing the PA#3 brief

Tool: Codex (repository review and Markdown editing).

Asked for: `cập nhật brief thành brief cho PA3`

Kept: Verbatim PA#3 work prompts available from the conversation and task-plan log, the team split, and the shared PA#2 example timeline.

Changed: Replaced the static PA#2 brief with the PA#3 prompt record and a prepared implementation handoff covering C1–C11, the API boundary, form behavior and checks.

Rejected: Presenting the prepared handoff as a prompt already sent, reconstructing unavailable prompts from log summaries, or claiming implementation checks had passed.

Checks: Read the ownership rules and compared the handoff with the PA#3 rubric and shared API README. No commit or push was made.

### Shared API conventions and fixtures

#### 2026-11-26 - reviewing the shared decisions and preparing the documentation commit

Tool: Codex (Git inspection and review of the task plan, API README and draft fixtures).

Asked for: `commit phần tài liệu và nêu chi tiết hơn những phần cần thống nhất: đã có những đề xuất gì, những điểm mơ hồ`

Kept: The proposed division of work and the distinction between rubric requirements and proposed API choices.

Changed: Recorded the prompt and selected only the PA#3 foundation documents for the requested commit. Identified unresolved decisions about feature boundaries, schedule data, demo accounts and the order of checker examples.

Rejected: Including the draft mock fixture, treating the route table as a final contract, or treating a scheduled agreement as a recorded team decision.

Checks: Inspected the branch, index and working tree, and checked the documentation diff for whitespace errors. No end-to-end checker run was attempted.

#### 2026-11-27 - recording the proposed shared API decisions

Tool: Codex (workspace inspection and Markdown editing).

Asked for: `sửa theo đề xuất`

Kept: Feature ownership, existing route paths, shared error envelope and PA#2 fixture IDs and dates.

Changed: Recorded the API decisions for handler ownership, session responses, stable availability slots, duplicate submissions, confirmed interviews and the checker scenario. Numbered planned resource filenames for checker order and recorded the real prompt in `brief.md`.

Rejected: Renaming A02's fixture position before the team confirms the Communications mapping, or implementing the mock runner as part of the documentation update.

Checks: Compared the proposed responses and scenario with the route table and draft fixtures. The resource contracts and mock runner are pending.

#### 2026-11-27 - specifying mock registration and the Communications fixture

Tool: Codex (Markdown and fixture editing).

Asked for: `cập nhật 2 nội dung này`

Kept: PA#2 reference pages, campaign dates, application IDs and statuses, and the seeded interview assignments.

Changed: Documented route registration, handler context and response serialization. Updated the PA#3 role, A02 and A05 to Communications, matched the interviewer's qualification and added aliases for the demo accounts.

Rejected: Changing the historical PA#2 snapshot or implementing the shared mock runner in this task.

Checks: Reviewed the updated position references, seeded interviewer and alias mapping. No mock or checker execution was performed.

#### 2026-11-27 - validating and relocating the shared fixtures

Tool: Codex (repository inspection, Node built-in assertions, fixture relocation and Markdown edits).

Asked for: `kiểm tra và chỉnh sửa dữ liệu mẫu đã đúng contract chưa`, followed by `PLEASE IMPLEMENT THIS PLAN:` and the full implementation plan recorded verbatim in `brief.md`.

Kept: All seed business data, the intentional A01/A02 conflict, A04's unavailable qualified interviewer and the existing `createSeedData()` import and cloning behavior.

Changed: Copied the fixture source unchanged into `mock/data/seed.mjs` and made `mock/data.mjs` re-export its factory. Updated the API README and its Changes section to document the location and distinguish internal store data from API responses. Recorded the prompts in `brief.md`.

Rejected: Inventing resource response fields, tokens, PDF content or handlers before the resource contracts exist; treating fixture validation as end-to-end API or authorization evidence.

Checks: A Node assertion run passed for legacy/direct import identity, unique IDs and aliases, references, demo roles, dates, statuses, statement limits, qualification, common duration, merged availability coverage, calculated applicant/interviewer/room overlaps, blockers A01/A02/A04 and independent nested mutable seed data. Both modules passed `node --check`. The final documentation diff passed `git diff --check`. Resource contracts and the mock runner are still absent, so the official contract checker and authorization behavior were not exercised. No commit or push was made.

### API contracts and review

#### 2026-11-27 - defining campaign and interview setup contracts

Tool: Codex (repository review, contract authoring and Node built-in assertions).

Asked for: `tạo contract C1, C3, C4`, followed by `Please implement the plan.` after the contract plan and lifecycle choices were approved.

Kept: The existing eight method/path pairs, role and error conventions, seed IDs and business data, the A01/A02 conflict and A04 Unassigned state. The user selected separate Draft creation alongside a Published campaign and constrained Published edits before confirmation.

Changed: Added `docs/api/02-campaigns.md` and `docs/api/03-interview-setup.md` with response views, write fields, publication/setup validation, confirmed locks and ordered executable exchanges. Updated README route status and recorded shared decisions before implementation. Documented deterministic input-slot generation before applications exist and protected availability/date afterward. Recorded the real prompts in `brief.md`.

Rejected: Adding session contracts, handlers, seed changes, UI or dependencies in this documentation task; publishing a second campaign or extending the seeded interviewer's availability just to obtain example responses. Moved the active-campaign publication refusal after the isolated Draft receives an interview date in C4 so earlier validation does not mask the intended 409.

Checks: Node assertions passed for all eight endpoint definitions and matching README rows, 15 paired HTTP exchanges, parseable JSON bodies, complete error envelopes, protected example token aliases, seed-based response values, exclusion of private store fields and the setup-before-publication-refusal order. Seed blockers remain A01/A02/A04. `git diff --check` passed. The official checker, session contract, mock runner and FRONTEND.md were not found in the checkout, so no HTTP, authorization, UI or official checker pass is claimed. No commit or push was made.

#### 2026-11-27 - specifying Draft scheduling and confirmation

Tool: Codex (existing-contract/rubric/checker review, Markdown authoring and Node assertions).

Asked for: `tạo contract C8, C9`

Kept: Existing method/path proposals, C4 configuration ownership, the seed and its intentional manual-edit conflict, application identity and privacy rules. Left `brief.md` unchanged following the user's preference. No mock handlers or UI were added.

Changed: Added `docs/api/05-schedules.md` for the five C8/C9 routes, enriched schedule rows, derived summary, full Draft saves, deterministic generation, CSV export, confirmation gates and cross-resource locks. Added 21 ordered exchanges spanning the seed refusal, resolution, regeneration, availability repair, assignment, open-campaign gate, confirmation and locked writes. Marked the five README routes as initially contracted and documented the shared shape for review before C6/C10 integration. Refreshed the self-assessment's contract evidence to 13/29 endpoints and 36 exchanges; its provisional 21/100 score is unchanged because the mock and React app remain absent.

Rejected: Treating the seeded A01/A02 manual overlap as fresh generation output, trusting client-provided row statuses or confirmation flags, rejecting an entire Draft for a well-formed conflict, inventing extra action endpoints, exposing draft rows to other roles or claiming a live checker pass. Kept possible extra Rejected submissions from the future C5/C7 examples as an explicit shared-checker count dependency rather than silently resetting the store.

Checks: A Node documentation-scenario replay passed for 21 paired exchanges, JSON/error shapes, private-field exclusion, joined labels, all summary counts, interval/merged-availability checks and deduplicated blockers. Independently enumerated first-valid generation and verified A01 room-1 at 09:00, A02 room-1 at 09:20, A03 room-2 at 09:20 and A04 Unassigned under the original setup. Verified C4 extension before A04 assignment, a campaign-only refusal with empty applicationIds, restored closing date, Confirmed assignments and subsequent locks. Static parsing passed for all 36 HTTP exchanges across three resource contracts; README remains 29 routes with 13 initially contracted. `git diff --check` passed. The official HTTP checker, runner, role authorization and UI behavior were not exercised; required session/applications contracts and FRONTEND.md are still pending. No commit or push was made.

#### 2026-11-27 - comparing the resource contracts with the project and PA#3

Tool: Codex (official rubric, project brief and checker review, plus Node assertions).

Asked for: `kiểm tra các contract api đánh giá mức độ phù hợp với yêu cầu project và tài liệu PA3`

Kept: The API contracts, fixture data and mock files.

Changed: Recorded the prompt and reviewed coverage for C1–C11. Flagged the lifecycle rule that prevents first publication on the seeded store and the conflicting C4/C8 rules for an existing assignment whose room was deselected.

Checks: The official checker recognized 36 examples and matched examples to 13 of 29 indexed endpoints. It reported 0/36 HTTP responses verified. Token examples lacked a sign-in example and Demo accounts table, and public or unauthenticated requests returned EACCES in the local environment. The mock runner is absent. Static assertions independently verified all 36 example pairs, JSON bodies, error envelopes, Changes sections and the seeded dates and application identity. No commit or push was made.

#### 2026-11-28 - applying the selected campaign publication and room rules

Tool: Codex (contract editing, Node assertions and the official checker).

Asked for: `cập nhật 2 phương án 1`

Kept: The existing endpoint paths, response fields, seeded timeline and application IDs. The Vietnamese reference files remain local and were not updated in this pass.

Changed: C3 now permits the next publication after the current intake closes if the inclusive application periods do not overlap. C1's public collection selects the open, next upcoming or most recently closed campaign in that order. Earlier Published records remain accessible by ID. C4 keeps assignments when a room is deselected, and C8 saves them as Conflict while rejecting any unknown room ID. C9 continues to block confirmation until conflicts are resolved. Updated both cross-resource scenarios and the Changes sections before implementation.

Checks: Node assertions verified all 44 HTTP pairs and the new publication, date boundary, retained assignment, unknown room, refusal and repair examples. The official checker recognized 44 examples for 13 of 29 indexed endpoints and verified 0 HTTP responses. The mock runner, C2 sign-in example and Demo accounts table are still absent, and unauthenticated localhost requests returned EACCES. `git diff --check` passed. No commit or push was made.

### Vietnamese reference translations

#### 2026-11-27 - providing separate Vietnamese copies of the C1/C3/C4 contracts

Tool: Codex (contract reading, translation and Node assertions).

Asked for: `cho tôi 2 bản tiếng việt, không sửa contract sang tiếng việt, không viết brief`

Kept: Both English contracts, all 30 HTTP example blocks and their JSON, endpoint paths, field names, error codes and lifecycle rules. Left `brief.md` unchanged as requested.

Changed: Added `docs/translations/02-campaigns.vi.md` and `docs/translations/03-interview-setup.vi.md` as Vietnamese reference copies outside the executable API-contract directory. Each links to its English source and identifies the examples as reference material.

Rejected: Replacing the English contracts, duplicating executable scenarios under `docs/api/`, or appending this prompt to `brief.md` against the user's instruction.

Checks: Exact comparison confirmed that all HTTP blocks match their English sources; JSON bodies parse successfully. SHA-256 comparisons confirmed both source contracts and `brief.md` were unchanged during translation. No commit or push was made.

#### 2026-11-27 - providing the Vietnamese C8/C9 reference copy

Tool: Codex (contract translation and Node assertions).

Asked for: `tạo bản tiếng việt, không viết brief`

Kept: The English C8/C9 contract, field names, endpoint paths, error codes and all 42 HTTP example blocks. Left `brief.md` unchanged as explicitly requested.

Changed: Added `docs/translations/05-schedules.vi.md`, a Vietnamese reference copy outside the checker's API input directory, with links to the original English contract and the shared C4/README documentation.

Rejected: Translating the authoritative contract in place, modifying executable examples, writing to `brief.md` or claiming an HTTP checker run.

Checks: Exact comparison passed for all 21 paired HTTP exchanges; JSON bodies and local reference links are valid. SHA-256 comparisons confirmed the source contract and `brief.md` were unchanged. `git diff --check` passed. No commit or push was made.

### Progress and delivery evidence

#### 2026-11-28 - implementing the C1/C3 campaign mock

Tool: Codex (Node.js feature handlers and direct contract replay).

Asked for: `làm mok C1/C3`

Kept: The six documented routes and their API behavior, the seed, and Dũng's ownership of the shared mock runner.

Changed: Added `mock/routes/campaigns.mjs` with public campaign selection and detail, Executive draft creation, detail and save, and publication. The handlers project role-specific fields, validate writes before mutation, protect positions referenced by applications, apply inclusive intake overlap rules and refuse configuration writes when the schedule is confirmed. Documented the runner registration point and recorded the real prompt.

Checks: `node --check` passed. Node assertions replayed 15 paired C1/C3 exchanges from the campaign and setup contracts, comparing status and full JSON. The cross-resource replay prepared the C4 state in memory. Additional direct checks covered role enforcement, date boundaries, invalid and duplicate fields, referenced positions, confirmed locks, and response isolation. The shared runner, all-mode HTTP checks and the Classroom checker remain pending. No commit or push was made.

#### 2026-11-28 - preparing the C1/C3 mock branch

Tool: Codex (Git and Node.js syntax check).

Asked for: `tên nhánh là pa3/mock-c1-c3, push từ nhánh contracts-nhan, push lên`

Kept: The existing contract history and the separate planning and translation changes.

Changed: Prepared the C1/C3 feature module, API registration notes and related log entries for the requested branch.

Checks: Confirmed the checkout was on `pa3/api-contracts-nhan` at `b20f178`, the index was empty and the feature module passed `node --check`.

#### 2026-11-27 - checking the documentation and draft fixtures

Tool: Codex (Git inspection, documentation review and a Node fixture check).

Asked for: `kiểm tra đã đủ nội dung commit chưa, chưa commit`

Kept: The current API documentation and draft fixture.

Changed: Recorded the review and its evidence.

Rejected: Staging or committing changes and treating the draft fixture as the final mock.

Checks: The index was empty and `git diff --check` passed. The fixture check passed for demo aliases, A01/A02/A05, position and slot references, draft statuses and interviewer qualifications. The per-resource contracts and mock runner are still pending.

#### 2026-11-27 - preparing the reviewed documentation for push

Tool: Codex (Git inspection and selective staging).

Asked for: `push phần này lên`

Kept: The reviewed API conventions, Communications account mapping and grouped log entries.

Changed: Recorded the request and prepared the four documentation files for a commit on `pa3/task-plan`.

Rejected: Including the untracked mock fixture in the documentation commit.

Checks: Confirmed the branch and remote, confirmed the index was empty and checked the documentation diff for whitespace errors before staging.

#### 2026-11-27 - replacing the PA#2 report with an evidence-based PA#3 snapshot

Tool: Codex (PDF skill, bundled pypdf/pdfplumber, Node assertions and local Git inspection).

Asked for: `cập nhật self-assessment theo rubric PA3`

Kept: Existing application files, contract/fixture work and Git history. Left `brief.md` unchanged. The previous PA#2 self-assessment remains available in Git history.

Changed: Replaced `SELF_ASSESSMENT_REPORT.md` with a provisional English PA#3 report using the official nine criteria and template. Claimed 21/100 from current evidence: 3 for partial contract/mock work with no runner, 8 for brief/rules, 8 for the AI log and 2 for existing documentation history; zero for unimplemented runtime criteria. Added feature status, checks, missing deliverables and final packaging requirements.

Rejected: Carrying over PA#2's 87/100 or browser evidence, counting prepared contracts as working React features, claiming an official checker pass, or inferring committed work from untracked files. Found the official checker in the parent course-material directory; earlier entries correctly described its absence from the checkout, not from the parent directory.

Checks: Read all 11 rubric pages and both template pages using bundled pypdf; rendered and visually inspected the criterion table with pdfplumber. The system MiKTeX pdftotext failed on registry/setup access, so extraction used the bundled PDF libraries instead. Confirmed absent client/build/runner/FRONTEND deliverables, 29 indexed endpoints with 8 initially contracted, 15 paired parseable JSON HTTP exchanges, seed counts/ownership/blockers and nested clone independence. Verified score totals, report evidence paths, preserved brief content and `git diff --check`. The official HTTP checker and all app/browser checks remain not run. No commit or push was made.

#### 2026-11-27 - checking Nhân's current tasks against local files

Tool: Codex (local Git, file inventory, documentation review and Node fixture import).

Asked for: `kiểm tra các task hiện tại của Nhân và tiến độ hiện tại ở local`

Kept: Existing implementation files and the proposed team schedule.

Changed: Recorded the real prompt and this review. Compared Nhân's foundation, C1/C3/C4/C8/C9 and delivery tasks with the local checkout.

Rejected: Counting the PA#2 HTML, screenshots or self-assessment as completed PA#3 implementation; inferring current remote progress from local tracking refs.

Checks: The initial working tree on `pa3/task-plan` had only untracked `mock/`; HEAD was `77f3a9e`, matching the local origin tracking ref. Imported `createSeedData()` successfully and inspected its campaign, accounts, applications and draft schedule. Only the shared README exists under `docs/api/`; no resource contracts, `client/`, mock runner, formatter, linter or CI configuration are present. The self-assessment still targets PA#2. No runnable PA#3 app or official contract-checker run was available. No fetch, commit or push was performed.
