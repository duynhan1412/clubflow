# ClubFlow Project Requirements and Milestones

## 1. Purpose and source precedence

ClubFlow is the CSC13008 final project for class 24KTPM1. The same team develops it through six milestones, PA#1 to PA#6. This document consolidates the product requirements and the work expected in each milestone.

Source precedence:

1. The rubric attached to a milestone is authoritative for that milestone.
2. The ClubFlow final-project brief is authoritative for product scope and behavior.
3. The final-project milestones document is the planning summary.
4. Product-owner decisions apply where the brief is silent, but they cannot change marks, deadlines, rubrics, or mandatory PA#2 requirements.
5. `AGENTS.md` and `brief.md` constrain how this repository is developed; they do not override the course documents.

The detailed PA#1 rubric is unavailable. The official Classroom PA#3 rubric and contract checker were supplied separately and inform §11.

## 2. Product objective

ClubFlow keeps a club recruitment campaign in one process instead of spreading campaign details, CVs, screening decisions, interview schedules, assessments, and final results across forms, spreadsheets, and chats.

The product must:

- keep decisions attached to the correct application;
- prevent applicant, interviewer, and room scheduling conflicts;
- give each role only the information and actions it owns;
- keep applicants informed about each separate application;
- preserve a confirmed schedule as a read-only record;
- carry one campaign from publication to final Pass/Fail results.

## 3. Users and access boundaries

### 3.1 Visitor

- Can view a published recruitment campaign.
- Must sign in before applying.
- Cannot access protected Applicant, Interviewer, or Executive screens.

### 3.2 Executive

- Creates, previews, saves, and publishes the campaign.
- Configures departments, positions, quotas, interviewers, availability, rooms, and interview duration.
- Reviews every application and manages internal screening notes.
- Generates, edits, resolves, saves, exports, and confirms the interview schedule.
- Records and publishes a Pass or Fail result per application.
- Can manage all applications within the campaign until confirmation makes the protected records read-only.

### 3.3 Applicant

- Applies for one or more positions using one application per position.
- Can view only their own applications, CV-screening status, confirmed interviews, and published results.
- Cannot see internal screening notes.
- Receives an in-app notification when a final result is published.

### 3.4 Interviewer

- Can view only interviews and CVs assigned to them.
- Submits one assessment for an assigned interview after the schedule is confirmed.
- Cannot see internal screening notes or applications assigned to another interviewer.

## 4. Product scope

### 4.1 In scope

- One club.
- One active recruitment campaign at a time.
- One interview date per campaign.
- Pre-created accounts for Executive, Applicant, and Interviewer roles.
- One CV-screening round per application.
- At most one interview and one interviewer per application.
- One assessment per interview.
- Confirmed schedules remain visible while applications proceed to final results.

### 4.2 Out of scope

- Multiple clubs or simultaneous active campaigns.
- Self-service registration, account recovery, university verification, or university SSO.
- Multi-level administration.
- Dynamic room creation, capacity management, or university room booking.
- Schedule checks outside the active campaign or large-scale optimization.
- AI CV screening/ranking, advanced analytics, audit trails, or customizable application forms.
- Post-recruitment member, event, and task management.
- Chat, video calls, payments, or a dedicated mobile application.

## 5. Required features C1-F11

The PA#3 flow labels are C1-C11. The final-build feature labels are F1-F11; each C number maps to the same-numbered F feature.

### C1/F1 - Published campaign

The Visitor can view:

- campaign name and host club;
- description, opening and closing dates, and application instructions;
- departments and positions;
- quota, description, and requirements for each position.

Selecting Apply while signed out sends the Visitor to sign-in.

### C2/F2 - Sign-in and roles

- Provide demo accounts for Executive, Applicant, and Interviewer.
- Each role lands on its own home and sees only its allowed screens.
- Sign-out clears the active session.
- A signed-out user opening a protected route is sent to sign-in and returned to the original destination after success.

PA#3 represents this behavior through the mock. PA#4 implements JWT verification and server-side authorization.

### C3/F3 - Create and publish a campaign

The Executive can:

- enter campaign details, dates, and application instructions;
- add and remove departments and positions;
- enter quotas, descriptions, and requirements;
- Save as Draft;
- Preview;
- Publish.

Publishing must be refused when required information is missing, dates are impossible, or a position has no valid quota. Errors identify the affected fields and the campaign remains a draft.

### C4/F4 - Interview setup

The Executive can:

- assign an interviewer to one or more positions;
- enter interviewer availability;
- select rooms from an existing list;
- select one duration for the entire campaign: 15, 20, or 30 minutes.

### C5/F5 - Apply

The fixed application form contains:

- student information;
- one selected position;
- a PDF CV of at most 5 MB;
- a motivation statement of at most 300 words;
- availability selected only from the club's slots.

Required behavior:

- a second position in the same campaign creates a separate application;
- applying for the same position again opens the existing application;
- a closed campaign refuses the submission and preserves valid entered data;
- invalid files, statements, availability, or missing fields are explained and do not create an application.

### C6/F6 - My applications

The Applicant sees one row per application with:

- position;
- Submitted, Shortlisted, or Rejected status;
- interview time and room after schedule confirmation;
- Pass or Fail after result publication.

Only the signed-in Applicant's applications are returned.

### C7/F7 - Application review

The Executive has:

- application and applicant statistics;
- search, filter, sort, and pagination;
- basic CSV export;
- a list of applications and a readable detail drawer/panel;
- CV and motivation-statement viewing;
- an Executive-only internal note;
- Shortlist and Reject actions.

Closing the detail view keeps list filters. A decision changes only the selected application.

### C8/F8 - Draft schedule

The Executive selects the interview date, time window, and common duration, then generates a draft.

The draft:

- includes only Shortlisted applications;
- labels valid rows Proposed;
- labels impossible placements Unassigned and gives a concrete reason;
- labels overlaps Conflict and names the affected applications;
- supports Edit, Resolve, Assign Slot, Save Changes, and export;
- rechecks applicant, interviewer, room, position qualification, and availability after every edit.

### C9/F9 - Confirm schedule

Confirmation is refused unless:

- applications are closed;
- every application is reviewed;
- each Shortlisted application has exactly one valid assignment;
- no row is Conflict or Unassigned.

The refusal identifies the applications needing attention. After confirmation, campaign configuration, applications, and schedule are read-only. Confirmation is not the final recruitment result.

### C10/F10 - Interviews and assessments

- An Interviewer sees only their assigned interviews and those applications' CVs.
- The assigned Interviewer submits one assessment per interview.
- Assessment is allowed only after schedule confirmation.

### C11/F11 - Results and notifications

- The Executive records Pass or Fail per application and publishes the result.
- The Applicant sees the result on that application.
- The Applicant receives an in-app notification.
- One application's result never changes another application by the same student.

## 6. Shared data and business rules

### 6.1 Required example timeline

- Applications open: 2026-10-20.
- Applications close: 2026-11-05.
- Interview date: 2026-11-10.
- Every example submission is within the application period.

### 6.2 Application identity

- A01 and A02 belong to the same Applicant but different positions.
- They remain separate through screening, scheduling, assessment, and result publication.
- Applicants and Interviewers are distinct people.

### 6.3 Scheduling

A valid interview requires:

- a Shortlisted application;
- an interviewer assigned and qualified for the position;
- shared Applicant and Interviewer availability;
- a free room;
- the campaign's common duration.

No Applicant, Interviewer, or room can have overlapping interviews. The intended generation rule selects the first valid time-slot/interviewer/room combination in sequence. An application that cannot be placed remains Unassigned; it is not automatically rejected.

### 6.4 Confirmation and immutability

- Save Changes stores a draft only.
- Confirmation is blocked until every confirmation condition holds.
- After confirmation, attempts to change the campaign, applications, or schedule are refused.
- Applicants and Interviewers can then view only their own confirmed interview information.

### 6.5 Privacy and ownership

- Applicants see only their applications.
- Interviewers see only assigned interviews and CVs.
- Screening notes never appear in Applicant or Interviewer responses.
- Role and ownership checks must be enforced by the PA#4 API, not only by hidden UI controls.

## 7. Non-functional requirements

### 7.1 Responsive and accessible UI

- Mobile-first layouts at 360, 768, and 1280 px.
- No page-level horizontal scroll, clipped content, or overlap.
- Long names and titles wrap without widening the page.
- Standalone controls are at least 44 px tall at 360 px.
- Body text and controls are at least 16 px; text/button contrast is at least 4.5:1.
- Use semantic landmarks, one logical `h1`, ordered headings, visible labels, useful alternative text, and visible keyboard focus.
- Use links for navigation and buttons for actions.

### 7.2 PA#3 front-end states

Every API-backed screen has:

- loading;
- error with Retry;
- empty;
- success.

The UI must work against `normal`, `slow`, `error`, and `empty` mock modes. Business data comes from relative `/api` requests, not hard-coded component records.

### 7.3 Contract and implementation order

For PA#3 and later:

1. Write and commit the API contract.
2. Implement the mock or server behavior.
3. Implement the consumer.
4. Record every later contract change under `## Changes` before changing implementation.

### 7.4 Documentation and history

- `AI-LOG.md` is cumulative across the project and grows as work happens.
- `brief.md` contains the real prompts for the current milestone; earlier milestone versions remain in Git history.
- `AGENTS.md` contains the current stack, workflow, ownership, and never-list.
- Commits are small, descriptive, and authored by the member who performed the work.
- Do not rewrite history to manufacture contract-first, test-first, incidents, or gate evidence.

## 8. Milestone overview

| Milestone | Weight | Due | Main outcome |
|---|---:|---|---|
| PA#1 | 3% | 2026-10-19 22:00 | Idea and wireframe |
| PA#2 | 3% | 2026-11-09 22:00 | Responsive three-screen prototype |
| PA#3 | 7% | 2026-11-30 22:00 | React front end, API contract, and mock |
| PA#4 | 7% | 2026-12-07 22:00 | Express server, database, security, and tests |
| PA#5 | 5% | 2026-12-07 22:00 | Final build, harness, and AI dossier |
| PA#6 | 15% | 2026-12-08; reserve 2026-12-14 to 2026-12-19 | Team demo and individual oral |

When this overview conflicts with a milestone rubric, the milestone rubric wins.

## 9. PA#1 - Idea and wireframe

### Purpose

- Define a project idea and initial wireframes.
- Establish the team and initial product direction.

### ClubFlow outcome

The winning PA#1 concept became the shared ClubFlow final-project brief for the class. Other teams keep their own PA#1 mark and implement ClubFlow from PA#2 onward.

### Evidence limitation

The detailed PA#1 rubric is not present in this workspace. Do not treat this section as a replacement for that rubric.

## 10. PA#2 - Responsive prototype

### Purpose

Turn the three Executive screens into a responsive prototype:

1. Create Recruitment Campaign.
2. Application Review.
3. Interview Scheduling.

### Work

- Build static HTML/CSS or React pages beginning at `index.html`.
- Link the three screens in the correct main-flow order.
- Use realistic ClubFlow sample data and at least one long item.
- Fix every issue in the final-project brief's Fix these list.
- Check 360, 768, and 1280 px.
- Produce semantic, valid HTML with zero W3C errors.
- Save nine full-page screenshots and one validator result per page.
- Document opening instructions, screens, design choices, unwired controls, spacing, and breakpoints in `PROTOTYPE.md`.
- Keep the actual prompts, AI log, rules file, self-assessment, and Git history.

### Deliverables

- Three linked pages and CSS, or React source plus built `dist/`.
- Rules file.
- `PROTOTYPE.md`.
- `screenshots/`.
- `checks/`.
- `brief.md`.
- `AI-LOG.md`.
- `SELF_ASSESSMENT_REPORT.md`.
- Repository ZIP including `.git`, excluding `node_modules/`.

### Rubric

| Criterion | Points |
|---|---:|
| Three linked screens | 20 |
| Responsive behavior | 25 |
| Semantic, valid HTML | 20 |
| Checkable design system | 10 |
| Brief and rules file | 10 |
| AI log | 10 |
| Commit history | 5 |

## 11. PA#3 - React front end, contract, and mock

### Purpose

Build the complete C1-C11 front end in React against a written API contract and a local mock. PA#3 defines the interface that PA#4 must implement.

### Work

- Create a Vite React application in `client/` with React Router. Configure the relative `/api` proxy in both Vite development and preview.
- Implement C1-C11 for Visitor, Executive, Applicant, and Interviewer roles.
- Implement sign-in, sign-out, protected routes, role homes, and post-sign-in return paths.
- Read all business data from relative `/api` requests.
- Show loading, Retry/error, empty, and success states on every API-backed screen.
- Build and validate forms without discarding valid input after refusal.
- Write `docs/api/` before mock and consumer code. The README lists base path, auth header, shared error shape, status codes, and each method, full path, role and resource file.
- In each resource file, specify parameters, field types and limits, success responses and applicable errors (400 with field messages for validation). Provide at least one paired request and expected response per endpoint and keep a dated `## Changes` section with reasons for changes.
- Implement `mock/server.mjs` using Node built-ins only. Default `PORT` to 3001, load fixtures from `mock/data/`, keep changes in memory and log method, path and status per request. The PA#3 mock may use prepared scheduling responses that demonstrate the required states and actions in §5. The product generation rule still applies to the real implementation.
- Read `MOCK_MODE` at startup. Use about 150 ms for `normal`, about 2 seconds for `slow`, 500 with the shared error shape for `error` except sign-in, and empty lists at every JSON depth for `empty` while keeping single objects available. Keep demo tokens usable across restarts.
- Start a fresh normal-mode mock and run the Classroom checker from the repository root with `node /path/to/contract-check.mjs --base http://localhost:3001`. It compares status and JSON field names, verifies endpoint coverage and uses `FRONTEND.md` demo aliases for request tokens.
- Preserve responsive, semantic, and accessible behavior.
- Build and commit a fresh `client/dist/`.

### Expected deliverables

- `client/` source and `client/dist/`.
- `docs/api/`.
- `mock/server.mjs` and `mock/data/`.
- `FRONTEND.md` with team, run instructions, Demo accounts, routes and their endpoints, product-owner decisions with sources, libraries and unfinished work. Include `exec`, `studentA`, `int-content` and `int-comms` in the demo account aliases. The rubric describes `int-comms` as the Communications interviewer. Reconcile that example with the PA#2 position names before finalizing fixtures.
- Current `brief.md` and `AGENTS.md`.
- Cumulative `AI-LOG.md`.
- `SELF_ASSESSMENT_REPORT.md`.
- Git history showing contract-first work.

### Rubric summary

| Criterion | Points |
|---|---:|
| Complete React main flow | 25 |
| Routing, sign-in, and shared state | 10 |
| API data: loading, errors, and empty states | 10 |
| Forms | 10 |
| Contract and mock | 15 |
| Responsive, semantic, valid | 5 |
| Brief and rules file | 10 |
| AI log | 10 |
| Commit history | 5 |

### Official materials

Use the Classroom files `PA3-rubric-react-front-end.pdf`, `contract-check-README.md` and `contract-check.mjs` for grading details and executable example syntax.

## 12. PA#4 - Express back end

### Purpose

Replace the PA#3 mock with a real Express API implementing the same contract, persistent database state, server-side rules, authentication, uploads, and security checks.

### Work

- Create an Express server in `server/`, API under `/api`, listening on `PORT` on every interface.
- Implement every endpoint and example in `docs/api/`.
- Use PostgreSQL by default, or MongoDB, reached only through `DATABASE_URL`.
- Provide schema/migrations and an idempotent `npm run seed`.
- Create required Executive, Applicant, and Interviewer demo accounts.
- Hash passwords and issue JWTs signed with `JWT_SECRET`, expiring within 24 hours.
- Validate body, path, and query values and return one error shape with no stack traces.
- Accept PDF CV uploads up to 5 MB with Multer and server-generated filenames under `UPLOAD_DIR`.
- Enforce R1-R8 on direct API requests.
- Close security flaws S1-S5.
- Write real HTTP tests that run offline with `npm test` against an empty database.
- Write each rule/security test first, run it red, commit it, and then implement the fix without weakening the test.
- Run the PA#3 front end against the real API and rebuild `client/dist/`.

### Server rules R1-R8

| ID | Rule |
|---|---|
| R1 | A campaign publishes only when complete and its dates/quotas are valid |
| R2 | An application is validated before storage |
| R3 | One application per position per Applicant; other positions remain allowed |
| R4 | A screening decision and note affect one application only |
| R5 | Draft scheduling follows qualification, availability, room, duration, and Shortlisted-only rules |
| R6 | Every manual schedule edit is revalidated for Applicant, Interviewer, and room conflicts |
| R7 | Confirmation has strict conditions; confirmed records cannot change |
| R8 | Only assigned Interviewers assess once after confirmation; results are per application |

### Security checks S1-S5

| ID | Required protection |
|---|---|
| S1 | Parameterized queries and allow-listed sort/filter fields prevent injection |
| S2 | No real secret in code or Git; startup fails without `JWT_SECRET` |
| S3 | No unrestricted CORS or reflection of an attacker origin |
| S4 | Authentication, role, ownership, CV access, and note secrecy are enforced by the API |
| S5 | Upload size, PDF signature, generated filename, storage path, and served content type are enforced |

### Deliverables

- `server/package.json` and committed lockfile.
- `server/.env.example` without real values.
- `server/src/` modules, schema/migrations, seed, and tests.
- Updated `docs/api/` and fresh `client/dist/`.
- `BACKEND.md` with team, setup, accounts, model, R/S checks, uploads, sign-in storage decision, product-owner decisions, and not-done section.
- PA#4 `brief.md`, cumulative `AI-LOG.md`, current rules file, and self-assessment.

### Rubric

| Criterion | Points |
|---|---:|
| Contract served | 15 |
| Rules R1-R8 | 15 |
| Whole flow on the real API | 10 |
| Structure, database, and seed | 5 |
| Sign-in, JWT, and roles | 10 |
| Security flaws S1-S5 | 15 |
| Tests | 10 |
| Brief and rules file | 5 |
| AI log | 10 |
| Commit history | 5 |

## 13. PA#5 - Harness and AI dossier

### Purpose

Submit the final build and evidence that the project was developed inside a working harness throughout the semester.

### Work

- Tag the submitted final-build commit as `final`.
- Keep formatter check, linter, tests, and CI executable from a fresh copy.
- Make CI run the same commands on every push.
- Preserve real red-to-green gate/CI history; do not manufacture failures.
- Maintain a short, current rules file whose timeline traces changes to real incidents or decisions.
- Document at least three concrete assistant incidents from at least two milestones, including the check that caught each one and the fix commit.
- Maintain the cumulative AI log without rewriting older submissions.
- Document human gates and work deliberately not delegated.

### Deliverables

- Final front end and back end at tag `final`.
- Project rules file.
- Formatter, linter, test, CI, and optional pre-commit configuration.
- `HARNESS.md`.
- Cumulative `AI-LOG.md`.
- `checks/gates-final.txt` from the `final` commit in a fresh copy.
- `checks/ci-runs.png` showing multiple milestones and at least one genuine red run followed by green.
- `SELF_ASSESSMENT_REPORT.md`.
- Repository ZIP including `.git`, excluding `node_modules/` and `.env`.

### `HARNESS.md` sections

1. Team and ownership.
2. Gates.
3. How to run the gates from a fresh copy.
4. Rules-file timeline.
5. Self-review incidents.
6. Human gates.
7. What the team would change next time.

### Rubric

| Criterion | Points |
|---|---:|
| Rules file and its evolution | 15 |
| Gates that run and can fail | 25 |
| Self-review incidents | 25 |
| Whole-project AI log | 20 |
| Human gates | 10 |
| Harness commit history | 5 |

## 14. PA#6 - Final demo and individual oral

### Purpose

Demonstrate the `final` PA#5 build as one working product and individually explain the team's code, decisions, checks, and assistant use.

### Before the slot

Submit by the PA#5 deadline:

- `<StudentIDs>_slides.pdf`, at most three slides in English:
  1. scope and relied-on product-owner decisions;
  2. architecture diagram covering front end, API, database, sign-in, and roles;
  3. unfinished work;
- `<StudentIDs>_main-flow.mp4` or a link, at most four minutes.

Bring:

- the charged demo laptop and adapter;
- a second laptop at the same `final` commit;
- the application already running with a seeded database, front end, back end, and one signed-in window per role;
- student ID cards.

### Demo work

- Show F1-F11 through the real API.
- Create the example applications during the demo rather than editing database rows by hand.
- Reload at two points to prove persistence and show API requests in Network tools.
- Demonstrate the Applicant conflict, resolve it, and confirm the schedule.
- Show the confirmed read-only state, assessment, result publication, and notification.
- Execute two server-rule failure cases chosen by the examiner.
- Execute one role/ownership refusal chosen by the examiner.
- Show one beyond-the-brief feature if claiming B5; it must work through the API and should be documented in `docs/api/`.

### Build score shared by the team

| Criterion | Points |
|---|---:|
| B1 - F1-F11 through the real back end | 22 |
| B2 - Persistent real data and visible API requests | 4 |
| B3 - Two server-rule failure cases | 6 |
| B4 - Role or ownership refusal | 4 |
| B5 - Beyond-the-brief feature | 4 |
| Total | 40 |

### Individual oral

Each member receives up to 60 individual points for explaining:

- their commits and the other member's code;
- what a selected line does, why it exists, and how it was checked;
- rules, ownership, scheduling conflicts, and failure cases shown in the demo;
- AI-log or harness incidents and human gates;
- code written by an assistant as well as code written manually.

The assistant remains closed during the oral. The editor, repository, Git history, terminal, tests, browser, and DevTools may remain open. The oral is in Vietnamese; technical terms may remain in English.

PA#6 has no self-assessment and no honesty adjustment.

## 15. Cross-milestone dependency

```text
PA#1 idea/wireframe
    -> PA#2 responsive three-screen prototype
        -> PA#3 C1-C11 React front end + contract + mock
            -> PA#4 same contract on Express + database + tests
                -> PA#5 final build + harness evidence + final tag
                    -> PA#6 demo and individual explanation
```

Important consequences:

- PA#3 contract decisions directly constrain PA#4.
- PA#4 must not require a different front-end API without first changing and recording the contract.
- PA#5 history is produced during PA#2-PA#4; it cannot be recreated honestly in the last week.
- PA#6 uses the exact final build submitted with PA#5.
- Every member must understand the full repository, not only their owned feature area.

## 16. Submission rules shared by PA#1-PA#5

- One member submits one repository-folder ZIP for the team.
- The ZIP includes hidden `.git` and excludes `node_modules/`, `.env`, secrets, and uploaded files.
- The filename lists student IDs in ascending order and the claimed self-assessment total.
- `SELF_ASSESSMENT_REPORT.md` has one evidence-backed row per rubric criterion and an honest unfinished-work section.
- The total in the self-assessment matches the total in the ZIP filename.
- Submission uses a `<StudentID>@student.hcmus.edu.vn` account.
- The latest submission before the deadline is graded.
- Late penalties: under two hours -20%; two to 24 hours -50%; after 24 hours not accepted.
- A missing self-assessment incurs the rubric's penalty, and unsupported claimed points count against calibration.

## 17. Current PA#3 focus as of 2026-11-23

The immediate priority is:

1. Prepare and review the PA#3 rules on a dedicated branch before starting implementation.
2. Create the React/Vite foundation, router, shared API client, contract structure, mock runner, and gates.
3. Lock the common error shape, route map, and shared data catalogue.
4. Implement contract-first vertical slices for C1-C11.
5. Integrate daily instead of waiting for all screens to finish.
6. Complete failure-state, responsive, accessibility, contract, and production-build checks before documentation and packaging.

Do not start PA#4 implementation by silently inventing a server API. PA#4 starts from the reviewed and committed PA#3 contract.

## 18. Source documents in the workspace

- `ClubFlow-final-project-brief.pdf` - product problem, users, main flow, scope, screens, Fix these list, and product-owner process.
- `Final project - milestones, features and rubrics (24KTPM1).pdf` - milestone dates, weights, feature map, and summary criteria.
- `PA2-rubric-responsive-prototype.pdf` - detailed PA#2 requirements and scoring.
- `PA4-rubric-express-back-end.pdf` - detailed PA#4 server, rule, security, test, and submission requirements.
- `PA5-rubric-harness-and-ai-dossier.pdf` - detailed PA#5 harness and dossier requirements.
- `PA6-rubric-final-demo-and-oral.pdf` - detailed PA#6 demo and oral requirements.
