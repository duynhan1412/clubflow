# PA#3 task plan — proposal for team review

Status: proposal by Tạ Đức Dũng on 2026-11-25; both members must agree before work starts. Product and milestone requirements are in `REQUIREMENTS.md`; this file only divides the PA#3 work.

Deadline: 2026-11-30 22:00. Target ZIP time: 2026-11-30 18:00 (a submission under two hours late loses 20%).

## 1. Division principles

- **Vertical slices.** Each member owns the contract, mock handler, and UI for their C-features. Commits are authored by the member doing the work and show contract → mock → UI order per slice (Contract and mock: 15 points; commit history: 5 points; PA#5 forbids reconstructing history later).
- **PA#2 ownership continues.** Nhân keeps campaign and scheduling; Dũng keeps review and styles.
- **Shared foundation is locked on the first day,** with one owner per part to avoid merge conflicts.

## 2. Shared foundation (2026-11-25 to 2026-11-26)

| Work | Owner |
|---|---|
| Get the detailed PA#3 rubric, the contract checker, and its run command from Classroom (missing from the repository, see `REQUIREMENTS.md` §11) | Both, first |
| `AGENTS.md` for PA#3: React/Vite stack, contract-first workflow, new ownership, never-list; commit before any code (`main` still holds the PA#2 version) | Nhân |
| PA#3 `brief.md`; each member appends their own real prompts | Nhân owns the file |
| Shared data catalogue `mock/data.mjs`: reuse the PA#2 campaign and A01–A05, add demo accounts for the three roles, interviewers, and rooms | Nhân |
| `docs/api/README.md`: one error shape, auth header, mock-mode selection, route map, `## Changes` section | Nhân |
| `client/` Vite + React + router; API client for relative `/api` requests; shared loading / error + Retry / empty / success component | Dũng |
| `mock/server.mjs` on Node built-ins with `normal`, `slow`, `error`, and `empty` modes; Vite `/api` proxy | Dũng |
| Formatter, linter, and CI on every push; PA#5 (gates: 25 points) needs real red-to-green CI history, so it starts now | Nhân |

## 3. Feature slices C1–C11

| Nhân | Dũng |
|---|---|
| **C1** Published campaign | **C2** Sign-in/sign-out, protected routes, role homes, return path after sign-in |
| **C3** Create, save draft, preview, publish; field-level publish errors | **C5** Apply: PDF CV ≤ 5 MB, statement ≤ 300 words, availability, same position reopens the existing application |
| **C4** Interview setup: interviewers, availability, rooms, duration | **C6** My applications |
| **C8** Draft schedule: Proposed / Conflict / Unassigned, recheck after every edit | **C7** Application review: statistics, search, filter, sort, pagination, CSV, detail panel, internal note |
| **C9** Confirm schedule: blocking conditions, read-only after confirmation | **C10** Interviewer: assigned interviews and assessment |
| | **C11** Pass/Fail results and in-app notification |

Nhân has fewer features, but the scheduling algorithm, conflict rechecks, and C3 validation are the heaviest logic. C6, C10, and C11 depend on the confirmed state from C9, so the schedule store shape in the mock is agreed on 2026-11-26.

## 4. Schedule

| Date | Nhân | Dũng |
|---|---|---|
| 11-25 | `AGENTS.md`, data catalogue, `docs/api/README.md` | Rubric and checker, `client/` scaffold, mock server runner |
| 11-26 | Contract for C1, C3, C4, C8, C9, committed; CI | Contract for C2, C5–C7, C10, C11, committed; auth context and protected routes |
| 11-27 | Mock + UI for C1, C3, C4 | Mock + UI for C2, C5, C6 |
| 11-28 | Mock + UI for C8, C9 | Mock + UI for C7, C10, C11 |
| 11-29 | Integration: F1–F11 for all three roles and four modes, contract checker, **review each other's code** (the PA#6 oral covers the partner's code) | Same, plus responsive 360/768/1280 px and accessibility pass |
| 11-30 | `SELF_ASSESSMENT_REPORT.md`, final `AI-LOG.md` check | Fresh `client/dist/` build, `FRONTEND.md` |

Throughout: log every assistant task in `AI-LOG.md` as it happens and copy real prompts into `brief.md`.

## 5. Risks

- **Contract checker not yet available.** It may dictate the `docs/api/` format (for example fenced `http` examples). Get it before writing the contract on 11-26, or the contract will be rewritten.
- **Mock uses Node built-ins only.** Keep the CV upload simple: check the `%PDF` signature and the 5 MB limit.
- **The contract binds PA#4** (due 2026-12-07). Any later change goes under `## Changes` before the implementation changes.
- **Late penalty.** Package the ZIP by 18:00 on 2026-11-30.
