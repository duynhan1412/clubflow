# ClubFlow PA#3 API conventions

Status: shared conventions aligned with the official PA#3 rubric and checker. C1/C3, C4 and C8/C9 have initial resource contracts; other endpoint rows remain proposals pending their owners' resource contracts. C1/C3 has a feature module ready for runner registration.

## Shared implementation decisions

Use these defaults when drafting the resource contracts. Nhân maintains the endpoint table and shared fixtures. Dũng owns the mock runner and shared client. Each feature owner writes their resource contract and keeps their handlers in separate modules. When proposing a new route, send Nhân its method, full path, roles and resource filename.

### Mock handler interface

- Each feature module exposes a `registerRoutes(register)` function. The runner calls it at startup and supplies `register(method, path, handler)`. Register the full `/api` path with the same parameter names used in the contract.
- Register C1/C3 through [`mock/routes/campaigns.mjs`](../../mock/routes/campaigns.mjs). Pass `body: undefined` for requests without a body. The runner owns malformed JSON handling and the four mock modes.
- The runner creates one shared store. It matches routes, parses the incoming request, resolves a Bearer token to a user, applies mock mode behavior and logs the response. It passes `{ store, user, params, query, body }` to the handler. Use `user: null` for an unauthenticated request. Handlers enforce the route's required role, record ownership and assignment rules.
- A handler can be async and returns `{ status, body, headers }`. Omit `headers` for JSON and omit `body` for a bodyless response such as `204`. For CSV return a string with `Content-Type: text/csv; charset=utf-8`. For PDF return a Node `Buffer` with `Content-Type: application/pdf`. The runner serializes JSON and sends the CSV string or PDF bytes directly. The applications contract specifies the multipart upload fields.

## Requests and authorization

- React makes same-origin requests to relative `/api` URLs. Vite forwards those requests to the local Node mock. Feature docs specify each request body, response body, status and content type.
- Use `Authorization: Bearer <token>` on protected requests. For the C2 contract, use `POST /api/session` with a `200` response containing `{ token, user }`, `GET /api/session` with `200` and `{ user }`, and `DELETE /api/session` with `204` and no body on success. Use `id`, `name` and `role` for the safe user record. Match the seed's role values exactly: `Executive`, `Applicant` and `Interviewer`. The demo token remains usable after a mock restart so Retry works when the mode changes. The mock sign-out acknowledges the request. The client clears its session even if the mock is unavailable. Use 401 for missing or invalid authentication and 403 for authenticated requests outside the permitted role.
- Public reads return only published campaign information. Scope private reads to the caller's role and ownership or assignment. Use 404 for private resource IDs outside the caller's visible set. Never send account passwords or Executive-only notes to other roles.
- Use JSON by default. Document upload, PDF and CSV content types in their feature contracts. Document success and failure exchanges with fenced `http` examples.

## Error shape

Every API error uses one JSON object. `code` is stable for UI decisions. `message` is readable. `fieldErrors` maps form field paths to messages. `applicationIds` identifies blocked or conflicting applications. Use empty collections when these details do not apply.

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Check the highlighted fields.",
    "fieldErrors": {"departments.0.positions.0.quota": "Enter a positive whole number."},
    "applicationIds": []
  }
}
```

Use 400 for malformed requests and invalid fields, 404 for resources that are missing or outside the caller's visible set, 409 for incompatible state (such as a locked campaign or blocked confirmation), and 500 for simulated service failures. A refused write leaves the store unchanged. The UI keeps entered values and maps field errors back to controls.

## Mock modes

Start the runner with `node mock/server.mjs`. It reads `PORT` (default 3001) and `MOCK_MODE` (default `normal`) from the environment. Restart the runner to change modes. Vite forwards `/api` to `http://localhost:3001` in both development and preview.

| Mode | Behavior |
| --- | --- |
| `normal` | Return the ordinary response after about 150 ms. |
| `slow` | Return the ordinary response after about 2 seconds. |
| `error` | Return 500 with the shared error shape and code `MOCK_UNAVAILABLE` for every request except sign-in. Apply no writes on simulated failures. |
| `empty` | Return every JSON list as `[]`, including lists inside objects. Keep single objects available and report zero counts for emptied lists. |

Retry reissues the failed request without reloading the page after the mock is restarted in normal mode. The runner keeps changes in memory, resets them at startup and logs method, path and status for each request.

## Endpoint table and contract status

Each row is one full method and path. The status column distinguishes initial documented contracts from proposed resources. Keep the table and examples in sync as feature owners add them.

| Method | Path | Access | Contract file | Feature | Status |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/campaigns` | Public | `02-campaigns.md` | C1 | Initial contract |
| GET | `/api/campaigns/:campaignId` | Public | `02-campaigns.md` | C1 | Initial contract |
| POST | `/api/session` | Public | `01-session.md` | C2 | Proposed |
| GET | `/api/session` | Signed in | `01-session.md` | C2 | Proposed |
| DELETE | `/api/session` | Signed in | `01-session.md` | C2 | Proposed |
| POST | `/api/executive/campaigns` | Executive | `02-campaigns.md` | C3 | Initial contract |
| GET | `/api/executive/campaigns/:campaignId` | Executive | `02-campaigns.md` | C3 | Initial contract |
| PATCH | `/api/executive/campaigns/:campaignId` | Executive | `02-campaigns.md` | C3 | Initial contract |
| POST | `/api/executive/campaigns/:campaignId/publish` | Executive | `02-campaigns.md` | C3 | Initial contract |
| GET | `/api/executive/campaigns/:campaignId/interview-setup` | Executive | `03-interview-setup.md` | C4 | Initial contract |
| PUT | `/api/executive/campaigns/:campaignId/interview-setup` | Executive | `03-interview-setup.md` | C4 | Initial contract |
| POST | `/api/campaigns/:campaignId/applications` | Applicant | `04-applications.md` | C5 | Proposed |
| GET | `/api/me/applications` | Applicant, own records | `04-applications.md` | C6 | Proposed |
| GET | `/api/me/applications/:applicationId` | Applicant, own record | `04-applications.md` | C6 | Proposed |
| GET | `/api/executive/campaigns/:campaignId/applications` | Executive | `04-applications.md` | C7 | Proposed |
| GET | `/api/executive/campaigns/:campaignId/applications/export` | Executive | `04-applications.md` | C7 | Proposed |
| GET | `/api/executive/applications/:applicationId` | Executive | `04-applications.md` | C7 | Proposed |
| PATCH | `/api/executive/applications/:applicationId` | Executive | `04-applications.md` | C7 | Proposed |
| GET | `/api/executive/campaigns/:campaignId/schedule` | Executive | `05-schedules.md` | C8 | Initial contract |
| PUT | `/api/executive/campaigns/:campaignId/schedule` | Executive | `05-schedules.md` | C8 | Initial contract |
| POST | `/api/executive/campaigns/:campaignId/schedule/generate` | Executive | `05-schedules.md` | C8 | Initial contract |
| GET | `/api/executive/campaigns/:campaignId/schedule/export` | Executive | `05-schedules.md` | C8 | Initial contract |
| POST | `/api/executive/campaigns/:campaignId/schedule/confirm` | Executive | `05-schedules.md` | C9 | Initial contract |
| GET | `/api/me/interviews` | Interviewer, assigned confirmed interviews | `06-interviews.md` | C10 | Proposed |
| PUT | `/api/me/interviews/:applicationId/assessment` | Interviewer, assigned confirmed interview | `06-interviews.md` | C10 | Proposed |
| GET | `/api/applications/:applicationId/cv` | Executive or assigned Interviewer after confirmation | `04-applications.md` | C7/C10 | Proposed |
| PUT | `/api/executive/applications/:applicationId/result` | Executive | `07-results.md` | C11 | Proposed |
| POST | `/api/executive/campaigns/:campaignId/results/publish` | Executive | `07-results.md` | C11 | Proposed |
| GET | `/api/me/notifications` | Applicant, own notifications | `08-notifications.md` | C11 | Proposed |

The C3 UI can preview current form values without a separate endpoint. The C7 contract must cover filters, statistics, pagination and export.

### Campaign, applications and scheduling inputs

- C1 campaign detail returns `availabilitySlots` with `id`, `start` and `end` for C5 to select from. These are applicant input windows. Once a campaign has applications, preserve those windows and IDs. Changing interview duration or the scheduling window recalculates appointments against saved availability. Applicants' original selections still refer to the same time ranges.
- Store each application's `id`, `campaignId`, `positionId`, `applicantId`, `availabilitySlotIds` and `status` alongside its other details. C7 changes screening status by application ID. C8 takes only Shortlisted applications and uses applicant ID to detect overlaps across separate applications.
- C5 checks for an existing application for the signed-in applicant, campaign and position first. Return `200` with that application so the UI can reopen it, even after closing. A new valid submission returns `201` with the same response shape. For a new submission to a closed campaign, return `409` with `CAMPAIGN_CLOSED` in the shared error shape. Preserve form input. Neither a refused submission nor reopening a record writes a new application.

### Confirmed schedule and result visibility

- Join the schedule and applications by `applicationId`. C6 returns `interview: null` until an assignment is confirmed. For the applicant's own confirmed assignment, return `interview` with `date`, `start`, `end` and `roomName`. C10 returns only the signed-in interviewer's confirmed assignments. Keep CV access scoped to the assignment.
- C9 returns `409` with `SCHEDULE_CONFIRMATION_BLOCKED` when confirmation fails. Populate `error.applicationIds` with the applications that need attention, without duplicates. For the initial draft these are A01, A02 and A04. Keep each row's specific reason in the C8 schedule response. Use an empty ID list when the only blocking condition applies to the campaign as a whole.
- After confirmation, lock campaign configuration, application and screening writes, and scheduling writes. Assessments and Pass/Fail follow separate operations. Leave assessment completion out of the result publication gate unless the rubric or a recorded product-owner decision requires it.

### C1/C3/C4 contract decisions

- C1/C3 use { campaigns: [...] } and { campaign: {...} }; C4 uses { interviewSetup: {...} }. These are response views, not raw fixture serialization. Public campaign views omit interviewer/room configuration and all private recruitment records.
- Creation accepts a client-supplied unique ID. Multiple campaign records may retain Published status, with at most one application period accepting submissions at a time. A new publication requires no currently open intake and no overlap with any Published campaign's inclusive application dates. A Published edit before confirmation also preserves non-overlapping dates, referenced position IDs and applicant availability. The public collection selects the open campaign, otherwise the next upcoming or most recently closed campaign. Earlier Published campaigns remain accessible by ID. Repeating publication is idempotent unless the campaign is locked.
- C3 owns recruitment content; C4 owns interview date/window, duration, selected rooms and campaign-scoped interviewer configuration. PUT setup is full replacement, permits incomplete empty selections, and rechecks an existing Draft schedule without moving assignments. Before applications exist, input slots follow the configured duration/window; after applications exist, their IDs/time ranges and interview date remain protected. See the resource files for exact schemas and validation.
- Checker examples in 02-campaigns.md create an isolated contract-draft. After setting its interview date in 03-interview-setup.md, they reject overlapping application dates, move the Draft to November 8–9 and publish it on the default mock date, November 6. The seed campaign and its assignments remain available by the explicit fall-2026 ID for C5–C11 examples. The 01-session.md sign-in contract and FRONTEND.md aliases remain dependencies owned by C2.

### C8/C9 schedule contract decisions

- 05-schedules.md defines the five existing schedule routes. JSON reads/writes return { schedule, summary }; schedule rows include joined applicant/position/interviewer/room labels, original availabilitySlotIds and derived validation details. The summary includes application/review and row counts, closing/review gates, canConfirm and distinct blockingApplicationIds. These response views need not be stored in fixtures.
- C4 remains the configuration write boundary. Save date/window/duration there before generating. Schedule PUT accepts the complete set of Shortlisted assignment rows only; Edit, Resolve and Assign Slot use the same method. Well-formed invalid assignments are saved as Conflict, including a known catalogue room deselected in C4. Malformed/incomplete assignment tuples and unknown room IDs return 400. Save and generate keep Draft.
- Generation processes application IDs, then duration-aligned start times, interviewer IDs and selected room IDs in ascending order, choosing the first valid combination. The seed Conflict snapshot follows a manual edit; fresh generation resolves that overlap and leaves A04 Unassigned until its qualified interviewer's availability is extended.
- Confirmation rechecks all gates against stored data, stamps and locks the schedule atomically, and leaves assessment/result publication separate. Repeat confirmation and all configuration/schedule writes after confirmation return 409 CAMPAIGN_LOCKED; read/export remain available. C6/C10 must use only confirmed rows through their own scoped endpoints. Review this shared shape with the other owner before wiring those consumers.
- The checker scenario in 05-schedules.md reads/refuses the original seed, saves/resolves/regenerates, then extends C4 availability and deselects Lab 2. It saves A04 while A03 retains its deselected room as Conflict, checks the unknown-room error and confirms only after repairing the conflicts and restoring the closing date. It leaves the confirmed seed available for later C10/C11 files. Session/application examples and FRONTEND.md remain integration dependencies.

## Executable examples

- Write one Markdown contract per resource. For each endpoint, document access, path and query parameters, request fields with types, required fields and limits, the success response and every applicable error response. Include at least one executable example per endpoint.
- Pair each fenced `http` request with a fenced `http` response. Include the HTTP status and show all expected JSON fields, including nested fields. A non-JSON response such as PDF or CSV can omit the body in the example. Use a fenced `sh` block with one `curl` command for multipart uploads.
- Use `Authorization: Bearer {{token:<name>}}` with the name from the `Demo accounts` table in `FRONTEND.md`. Provide a sign-in example whose response contains a token. The checker sends real example requests, so request bodies need concrete values.
- Start a fresh normal-mode mock, then run `node /path/to/contract-check.mjs --base http://localhost:3001` from the repository root with the Classroom script. It runs README examples first and other files alphabetically, top to bottom, against one instance. Order state-changing examples accordingly. The checker compares HTTP status and JSON field names and reports value differences as notes unless `--strict-values` is enabled.
- Add a `## Changes` section to every contract file. Record the date, what changed and why before changing implementation.

### Shared checker scenario

1. Establish sign-in, published campaign access and interview setup. Publish the isolated next intake after checking overlapping dates, then use fall-2026 explicitly for the rest of the shared scenario.
2. Exercise duplicate application, new submission, closed-campaign refusal and review. Use different unused applicant/position pairs for the new submission and closed refusal. Reject the new application during review so it adds no interview to the PA#2 schedule scenario.
3. Read the seeded draft and show refused confirmation. Resolve A02 by moving it to 09:20–09:40. Extend the qualified content interviewer's availability through 10:20 and assign A04 at 10:00–10:20 in Lab 1 while saving A03 with its deselected room. Repair the conflict, recheck the schedule and confirm.
4. Read the now-visible C6 and C10 interviews, record the assessment, then publish and read results and notifications.

For deterministic examples, the mock runner may read `MOCK_DATE` (`YYYY-MM-DD`, default `2026-11-06` for the closed seed). In the checker scenario use the mock-only request header `X-ClubFlow-Mock-Date` on eligible application examples that need a different date. Use `2026-10-25` for a new submission while open, then use the default date for a closed submission. Evaluate dates in `Asia/Ho_Chi_Minh` with the closing day included. The header does not change the store clock for later requests. Keep it out of the React client and the PA#4 business API. Use numbered resource filenames so the examples execute in the order above. Put cross-resource reads that need confirmed or published data in a final scenario file if their resource file runs earlier.

## Shared mock data

- The catalogue lives in `mock/data/seed.mjs`. The existing `mock/data.mjs` entry point re-exports `createSeedData()` so callers can keep their documented import. Each call returns independent mutable data. Initialize one shared store across feature handlers at startup.
- Fixtures describe the internal store, not API response schemas. Resource contracts define the response fields; handlers must construct role-scoped responses rather than serialize the store directly. For example, C6 returns `interview: null` before confirmation and the documented interview fields afterward. Account passwords and Executive-only notes must remain outside responses to unauthorized roles. C1/C3, C4 and C8/C9 response schemas are documented in their resource files. End-to-end contract and authorization checks require the shared runner.
- Use the PA#2 timeline and application IDs. Use the campaign date zone (`Asia/Ho_Chi_Minh`) for application dates and local interview times.
- Demo accounts include `executive@clubflow.test`, `applicant-1@clubflow.test` and `interviewer-1@clubflow.test`. The local fixture password is `clubflow-demo`. Seeded CVs are filenames only. The CV handler will need its own demo PDF content.
- Join schedule rows by `applicationId`, `interviewerId` and `roomId`. Use `application.applicantId` to detect overlapping interviews across applications. Candidate availability refers to campaign slot IDs. Merge adjacent availability ranges when checking interview windows. Schedule rows carry their assigned start and end times independently of the input slots. Treat adjacent interviews as non-overlapping.
- `schedule.status` is `Draft` or `Confirmed`. `confirmedAt` stays null until confirmation succeeds. Row statuses describe draft validity. C6 and C10 read assigned interviews only from a confirmed schedule. C11 keeps results and notifications separate from schedule confirmation. The seed starts in Draft with A01/A02 Conflict, A03 Proposed and A04 Unassigned.
- Counts come from the store. The seed has five applications from four people (four Shortlisted, one Rejected) and four schedule rows. Keep the A05 availability slot as demo-only data added for PA#3. It does not affect the schedule.

### Demo account mapping

| Alias for `FRONTEND.md` and checker | Fixture account ID | Role or assignment |
| --- | --- | --- |
| `exec` | `executive-1` | Executive |
| `studentA` | `applicant-1` | Applicant, owner of A01 and A02 |
| `int-content` | `interviewer-1` | Đặng Thu Hà, qualified for `pos-content` |
| `int-comms` | `interviewer-2` | Võ Quốc Khánh, qualified for `pos-communications` and assigned to A02 in the seed |

The PA#3 fixture uses Communications (Điều phối viên Truyền thông) for A02 and A05. A02 keeps its application ID, applicant and seeded interviewer. A05 remains Rejected. This position is called Sự kiện in the PA#2 snapshot. Copy the PA#3 fixture's `accounts[].alias` values into the Demo accounts table in `FRONTEND.md` and use them in checker requests.

## Changes

| Date | Change |
| --- | --- |
| 2026-11-26 | Proposed shared authorization, error format, mock mode selection, route map and seed conventions. |
| 2026-11-26 | Updated endpoint rows and example rules for the official checker. Aligned validation errors, mock modes and demo token lifetime with the PA#3 rubric. |
| 2026-11-27 | Documented the shared handler boundary, session and duplicate submission responses, scheduling inputs and confirmed views, demo account mapping and checker scenario so both owners can draft compatible resource contracts. |
| 2026-11-27 | Specified route registration and JSON, CSV and PDF responses. Updated the PA#3 demo account and position mapping to match the rubric's Communications example. |
| 2026-11-27 | Located fixtures under `mock/data/seed.mjs` while preserving the `mock/data.mjs` import. Distinguished internal store records from resource responses; preserved the seed's business data and intentional draft blockers. |
| 2026-11-27 | Added initial C1/C3 and C4 resource contracts and route status. Recorded response views, Draft coexistence, constrained Published edits, full setup replacement and checker ordering before implementation. |
| 2026-11-27 | Added the initial C8/C9 schedule contract and marked its five routes documented. Specified complete Draft saves, response labels/summary, generation order, confirmation gates/locks and the ordered cross-resource checker scenario before implementation. |
| 2026-11-28 | Adopted non-overlapping campaign intakes with continued access to closed campaigns. Allowed Draft saves with a deselected catalogue room so unrelated edits can be preserved. Updated the shared checker scenario for both rules. |
