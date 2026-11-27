# Self-assessment — ClubFlow PA#3

Submitted by:

- 24127094 — Trịnh Duy Nhân
- 24127347 — Tạ Đức Dũng

Total claimed for the current local snapshot: **21 / 100**.

Status: provisional progress assessment as of 2026-11-27 (Asia/Saigon), updated after the C8/C9 contract addition; not a completed submission. Reassess after integration and verification. The 87/100 previously recorded in this file assessed PA#2 and does not carry over to PA#3; that report remains in Git history at `5548c61:SELF_ASSESSMENT_REPORT.md`.

## Basis and evidence boundary

This assessment follows the official **PA#3 — Front end in React · rubric**, supplied as `../PA3-rubric-react-front-end.pdf`: criteria and weights on page 5, scoring bands on pages 6–10, and submission/self-assessment rules on pages 10–11. The structure follows `../SELF_ASSESSMENT_REPORT template.pdf`. Both source PDFs and the official checker are available in the parent course-material directory, outside the repository. [REQUIREMENTS.md](REQUIREMENTS.md#11-pa3---react-front-end-contract-and-mock) contains the repository summary; the official rubric takes precedence.

Evidence includes the current working tree on `pa3/task-plan`, with HEAD `77f3a9e`. The three resource contracts, fixtures and translations are still untracked; README and log updates are uncommitted. Their existence supports local progress only, not committed contract-first history. No remote progress is inferred.

There is no `client/`, `client/dist/`, `mock/server.mjs` or `FRONTEND.md` in this checkout. The root HTML/CSS, screenshots and W3C reports are PA#2 artifacts. They are design references, not evidence that the PA#3 React app works.

## Assessment against the official rubric

| Criterion | Max | Claim | Evidence and remaining gap |
| --- | ---: | ---: | --- |
| 1. The whole main flow, in React | 25 | 0 | No `client/` or `client/dist/`; no C1–C11 flow can be opened as a React build. [PROTOTYPE.md](PROTOTYPE.md) describes the static PA#2 reference only. Contracts for C1/C3/C4 do not establish working screens. |
| 2. Routing, sign-in and shared state | 10 | 0 | No React router, auth context, sign-in/out, protected routes, role homes, return paths or API-driven shared state are implemented locally. The session routes in [docs/api/README.md](docs/api/README.md#endpoint-table-and-contract-status) are proposals. The rubric explicitly assigns 0 for no router or no sign-in. |
| 3. Data from the API: loading, errors, empty lists | 10 | 0 | No client or runner exists, so no frontend request reaches a mock. Four modes, Retry and relative /api usage are documented in [docs/api/README.md](docs/api/README.md#mock-modes), but no loading/error/empty/success behavior has been exercised. The rubric explicitly assigns 0 when no request reaches the mock. |
| 4. Forms | 10 | 0 | No working React main-flow form. Validation and field paths are specified in [02-campaigns.md](docs/api/02-campaigns.md#write-fields-and-lifecycle) and [03-interview-setup.md](docs/api/03-interview-setup.md#put-request-fields), but input preservation, accessible field messages, PDF/word limits and duplicate-submit prevention have not been implemented or checked in the app. |
| 5. The contract and the mock | 15 | 3 | [API README](docs/api/README.md), [C1/C3 contract](docs/api/02-campaigns.md), [C4 contract](docs/api/03-interview-setup.md), [C8/C9 contract](docs/api/05-schedules.md) and [seed](mock/data/seed.mjs) provide shared conventions, 13 of 29 indexed endpoints and 36 paired HTTP exchanges. JSON, seed relationships and initial blockers pass static checks. No runnable mock, five remaining resource contracts, session examples or official HTTP checker results exist. Claim stays within the rubric's 0–3 band for no mock; it is not a proportional 13/29 runtime score. |
| 6. Responsive, semantic, valid | 5 | 0 | No PA#3 build or route list to inspect at 360/768/1280 px; no rendered React HTML, keyboard, console or W3C checks. Existing `screenshots/` and `checks/validator-*.txt` verify PA#2 only and are not counted here. |
| 7. The brief and the rules file | 10 | 8 | [brief.md](brief.md#prompts-already-sent) records real PA#3 prompts; [AGENTS.md](AGENTS.md) records React/Vite, ownership, contract-first rules, API boundaries, four states and responsive/accessibility constraints. The brief's future handoff is clearly labelled as prepared, rather than a prompt already sent. It includes the expected implementation and verification constraints, but has not yet been handed to a frontend implementation task and its effectiveness has not been checked against generated consumers. No top-band claim yet. |
| 8. AI-LOG.md | 10 | 8 | [AI-LOG.md](AI-LOG.md#pa3) retains PA#2 entries and records PA#3 tasks with Tool, Asked for, Kept, Changed, Rejected and Checks. Examples include the 2026-11-26 rubric alignment rejecting 422/header-based mock modes, the 2026-11-27 publication-example ordering correction, and separate Vietnamese translations preserving the source contracts. No app-level failure/correction checks exist yet; recent entries and fixes are not committed for traceability, so 9–10 is not claimed. |
| 9. Commit history | 5 | 2 | Real PA#3 documentation commits include `38ebe97` (requirements), `a16765d` (plan), `a8ad75a` (foundation/rules) and `77f3a9e` (integration conventions). New contracts and fixtures remain untracked; no contract → mock → consumer commit sequence or per-feature implementation history exists. There has not been a commit before every assistant request. Partial named history supports the lower end of the 2–4 band only. |
| **Total** | **100** | **21** | **Provisional local evidence only; not ready for submission.** |

These are team marks against the current checkout, not an individual score or a prediction of the final grade. Undemonstrated runtime work receives no credit. Documentation and fixture checks do not establish authentication, role isolation, persistence or end-to-end contract compliance.

## Feature status

| Steps | Local evidence | Not yet implemented |
| --- | --- | --- |
| C1, C3 | Campaign contract with public/Executive response schemas, Draft save, publish validation, constrained Published edits and locks. | Mock handlers and React UI. |
| C4 | Interview-setup contract with catalogues, complete replacement, availability validation and confirmed locks. | Mock handler and React UI. |
| C8, C9 | Schedule contract with enriched rows, derived summary, complete Draft saves, generation, export, confirmation gates and lock scenarios. | Mock handlers and React UI. |
| C2, C5–C7, C10–C11 | Proposed routes, shared rules, timeline, demo accounts and Draft fixtures. | Resource contracts, handlers and React UI. No working sign-in, application/review, assessment or result flow. |

The seed contains five applications from four applicants. A01 and A02 belong to one applicant and different positions; A01–A04 are Shortlisted and A05 is Rejected. Its Draft intentionally starts with A01/A02 Conflict, A03 Proposed and A04 Unassigned. These are scenario inputs, not evidence of scheduling/conflict logic. Separate Vietnamese copies in `docs/translations/` are reference material and are outside the checker input directory.

## Checks performed for this assessment

- Read all 11 pages of the official PA#3 rubric and both pages of the report template with the bundled PDF library; visually inspected the official criterion/weight table on page 5.
- Inspected the file inventory, Git working tree, recent commits and report history. Confirmed that only the API README is currently tracked under `docs/api/`; the three resource documents and mock fixtures are untracked.
- Counted 29 endpoint rows in the API README, of which 13 point to initial contracts. Checked all 36 paired HTTP exchanges for request/response pairing and parseable JSON bodies; all three contracts contain `## Changes`. The C8/C9 documentation scenario was replayed in memory, independently checking generation order, conflicts, counts and confirmation prerequisites; this was not an HTTP handler test.
- Imported the seed through `mock/data.mjs` using Node built-ins. Checked application/applicant counts, A01/A02 ownership, initial blocker IDs A01/A02/A04 and nested clone independence. More detailed fixture checks are recorded in the seed-validation AI-log entry.
- Checked the assessment arithmetic and local evidence links; ran `git diff --check`. No frontend dependencies, mock server or browser flow were started.

The official script exists at `../contract-check.mjs`. It was **not run against an API** because `mock/server.mjs`, the sign-in contract and `FRONTEND.md` demo mapping are not implemented. Static JSON checks are not an official checker pass. The earlier AI-log entries saying the checker was absent from the checkout do not mean it is absent from the parent course-material directory.

## What we did not manage

The whole React app and production build are still missing. We have not implemented the Node mock, the four mock modes, restart-safe tokens, scoped data responses or any working C1–C11 interaction. Five resource contracts are missing: session, applications, interviews, results and notifications. `FRONTEND.md` is absent, including its route map, account table, run instructions, library list, sourced product-owner decisions and unfinished-work section.

We have not run the official contract checker, role/privacy checks, form/error-preservation checks, direct route/reload checks, three-width browser checks, console checks or W3C validation on rendered PA#3 screens. There is no fresh `client/dist/`, complete contract-first implementation history or final submission ZIP. Formatter, linter and CI planned for Nhân are also absent; they are pending project tasks rather than separate scored rows in this PA#3 rubric.

## What we would do differently

Finish and review each resource contract before its implementation, then preserve the actual contract → mock → UI sequence in separately authorized commits. Start the shared runner and client early enough to validate examples and role boundaries while each feature is built. Use one fresh mock for the full ordered checker scenario and reserve integration time for all roles, modes, routes and widths. Do not reconstruct history or award implementation points for prepared documentation.

## Before final submission

Complete the missing flow and documentation, run the rubric's checks against a fresh build with external network access blocked, then update each evidence row and the total. Package the actual team repository folder including `.git` and `client/dist/`, excluding every `node_modules/`. Use `24127094-24127347_<final-total>.zip`, with the final table total substituted; do not reuse PA#2's `_87.zip` name. No ZIP has been created by this assessment.

Deadline: 2026-11-30 at 22:00 (Asia/Saigon). No commit or push was made for this update.
