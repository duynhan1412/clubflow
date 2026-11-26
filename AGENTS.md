# ClubFlow PA#3 project rules

## Scope

- Build C1–C11 in React with Vite and a router in `client/`. Use the PA#2 prototype as the design and sample-data reference.
- Follow the official PA#3 rubric, then `REQUIREMENTS.md` for product and milestone requirements. Use `PA3-PLAN.md` for the proposed ownership and schedule.
- Follow the Classroom rubric and checker format summarized in `docs/api/README.md`.

## Ownership

| Member | PA#3 responsibilities |
| --- | --- |
| Trịnh Duy Nhân (24127094) | C1, C3, C4, C8, C9 across contract, mock and UI. Owns `AGENTS.md`, `brief.md`, `mock/data.mjs`, `docs/api/README.md`, formatter, linter, CI and final self-assessment. |
| Tạ Đức Dũng (24127347) | C2, C5–C7, C10, C11 across contract, mock and UI. Owns the React scaffold, router, styles, API client, shared UI states, Vite proxy, mock server runner and `FRONTEND.md`. |

Coordinate before editing a teammate's files. Agree on the shared schedule shape before wiring C6, C9, C10 and C11. Both members review shared data, integration and each other's code.

## Contract, mock and UI

1. Write each slice's resource contracts in `docs/api/`. List every method and full path in the README and pair each executable request with its expected response. Use the shared error shape and add `## Changes` to each file. Git history must place the rules before implementation and each slice's contract before its mock handler and UI.
2. Implement the mock handler using Node built-ins. Integrate through `mock/server.mjs` and place the submitted fixtures in `mock/data/`.
3. Connect React through the shared API client using relative `/api` requests. Handle loading, error with Retry, empty and success states. Preserve valid input when a form submission fails.
4. Record API changes under `## Changes` before updating the implementation. PA#4 inherits the PA#3 contract.

Support all four `MOCK_MODE` values as documented in the API README. Demo tokens must work after a mock restart. Keep screening notes Executive-only, Applicant records owner-scoped and Interviewer interviews and CVs assignment-scoped.

## Business rules

- Keep PA#2 dates, people and IDs consistent. A01 and A02 belong to one applicant and different positions. A01–A04 are Shortlisted and A05 is Rejected. Applicants and interviewers are distinct people.
- Use one duration for the campaign (15, 20 or 30 minutes). The product rule is to take the first valid slot/interviewer/room combination in sequence for each Shortlisted application or mark it Unassigned. PA#3 may simulate generation with prepared responses. Show correct qualifications, availability and applicant, interviewer and room overlaps after edits.
- Confirm only after applications close, all applications are reviewed, each Shortlisted application has exactly one valid assignment and no Conflict or Unassigned rows remain. Save Changes keeps a draft. Confirmation locks campaign configuration, application and screening data, and the schedule. Assessments and result publication follow their own rules.

## UI and accessibility

- Build mobile first using the 48rem and 80rem breakpoints and the shared spacing tokens. Check at 360, 768 and 1280 px, including long Vietnamese names and titles.
- Use semantic landmarks, one logical `h1`, ordered headings, visible labels and keyboard focus. Provide useful alt text. Use links for navigation and buttons for actions.
- Use at least 16 px for body text and controls, 4.5:1 contrast for body text and buttons, and 44 px standalone targets at 360 px.

## Never

- Never hard-code business data in React, add mock server dependencies, or claim real account verification, authentication or persistence from the mock.
- During UI work, call only documented endpoints. Report missing endpoints and get explicit direction before changing a contract or mock to accommodate the UI.
- Never expose private data across roles or show draft assignments to Applicants or Interviewers.
- Never use placeholder navigation links, fixed page or panel widths, `overflow-x: hidden` to conceal a broken layout, or `!important` in project CSS.
- Never manufacture Git or CI history. Never commit or push without explicit authorization.

## Delivery

- Check C1–C11 across roles and mock modes. Run the official contract checker, check responsive and accessible behavior and produce a fresh `client/dist/`.
- Keep project documentation in English except verbatim prompts. Record real PA#3 prompts in `brief.md` and assistant work and checks in the cumulative `AI-LOG.md`.
- Complete the self-assessment against the official rubric with evidence and unfinished work. Follow the course packaging instructions. PA#3 is due 2026-11-30 at 22:00 (Asia/Saigon).
