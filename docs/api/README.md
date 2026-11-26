# ClubFlow PA#3 API conventions

Status: shared conventions aligned with the official PA#3 rubric and checker. The endpoint paths and resource filenames below are proposals for team review.

## Requests and authorization

- React makes same-origin requests to relative `/api` URLs. Vite forwards those requests to the local Node mock. Feature docs specify each request body, response body, status and content type.
- Use `Authorization: Bearer <token>` on protected requests. Sign-in returns a demo token and a safe user record. The token remains usable after a mock restart so Retry works when the mode changes. Sign-out clears the client session. Use 401 for missing or invalid authentication and 403 for authenticated requests outside the permitted role.
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

## Proposed endpoint table

Each row is one full method and path. The file column names the planned resource contracts. Keep the table and examples in sync as feature owners add them.

| Method | Path | Access | Contract file | Feature |
| --- | --- | --- | --- | --- |
| GET | `/api/campaigns` | Public | `campaigns.md` | C1 |
| GET | `/api/campaigns/:campaignId` | Public | `campaigns.md` | C1 |
| POST | `/api/session` | Public | `01-session.md` | C2 |
| GET | `/api/session` | Signed in | `01-session.md` | C2 |
| DELETE | `/api/session` | Signed in | `01-session.md` | C2 |
| POST | `/api/executive/campaigns` | Executive | `campaigns.md` | C3 |
| GET | `/api/executive/campaigns/:campaignId` | Executive | `campaigns.md` | C3 |
| PATCH | `/api/executive/campaigns/:campaignId` | Executive | `campaigns.md` | C3 |
| POST | `/api/executive/campaigns/:campaignId/publish` | Executive | `campaigns.md` | C3 |
| GET | `/api/executive/campaigns/:campaignId/interview-setup` | Executive | `interview-setup.md` | C4 |
| PUT | `/api/executive/campaigns/:campaignId/interview-setup` | Executive | `interview-setup.md` | C4 |
| POST | `/api/campaigns/:campaignId/applications` | Applicant | `applications.md` | C5 |
| GET | `/api/me/applications` | Applicant, own records | `applications.md` | C6 |
| GET | `/api/me/applications/:applicationId` | Applicant, own record | `applications.md` | C6 |
| GET | `/api/executive/campaigns/:campaignId/applications` | Executive | `applications.md` | C7 |
| GET | `/api/executive/campaigns/:campaignId/applications/export` | Executive | `applications.md` | C7 |
| GET | `/api/executive/applications/:applicationId` | Executive | `applications.md` | C7 |
| PATCH | `/api/executive/applications/:applicationId` | Executive | `applications.md` | C7 |
| GET | `/api/executive/campaigns/:campaignId/schedule` | Executive | `schedules.md` | C8 |
| PUT | `/api/executive/campaigns/:campaignId/schedule` | Executive | `schedules.md` | C8 |
| POST | `/api/executive/campaigns/:campaignId/schedule/generate` | Executive | `schedules.md` | C8 |
| GET | `/api/executive/campaigns/:campaignId/schedule/export` | Executive | `schedules.md` | C8 |
| POST | `/api/executive/campaigns/:campaignId/schedule/confirm` | Executive | `schedules.md` | C9 |
| GET | `/api/me/interviews` | Interviewer, assigned confirmed interviews | `interviews.md` | C10 |
| PUT | `/api/me/interviews/:applicationId/assessment` | Interviewer, assigned confirmed interview | `interviews.md` | C10 |
| GET | `/api/applications/:applicationId/cv` | Executive or assigned Interviewer after confirmation | `applications.md` | C7/C10 |
| PUT | `/api/executive/applications/:applicationId/result` | Executive | `results.md` | C11 |
| POST | `/api/executive/campaigns/:campaignId/results/publish` | Executive | `results.md` | C11 |
| GET | `/api/me/notifications` | Applicant, own notifications | `notifications.md` | C11 |

The C3 UI can preview current form values without a separate endpoint. The C5 contract must define the response that reopens an existing application for the same position. The C7 contract must cover filters, statistics, pagination and export.

## Executable examples

- Write one Markdown contract per resource. For each endpoint, document access, path and query parameters, request fields with types, required fields and limits, the success response and every applicable error response. Include at least one executable example per endpoint.
- Pair each fenced `http` request with a fenced `http` response. Include the HTTP status and show all expected JSON fields, including nested fields. A non-JSON response such as PDF or CSV can omit the body in the example. Use a fenced `sh` block with one `curl` command for multipart uploads.
- Use `Authorization: Bearer {{token:<name>}}` with the name from the `Demo accounts` table in `FRONTEND.md`. Provide a sign-in example whose response contains a token. The checker sends real example requests, so request bodies need concrete values.
- Start a fresh normal-mode mock, then run `node /path/to/contract-check.mjs --base http://localhost:3001` from the repository root with the Classroom script. It runs README examples first and other files alphabetically, top to bottom, against one instance. Order state-changing examples accordingly. The checker compares HTTP status and JSON field names and reports value differences as notes unless `--strict-values` is enabled.
- Add a `## Changes` section to every contract file. Record the date, what changed and why before changing implementation.

## Shared mock data

- The current catalogue exposes `createSeedData()` in `mock/data.mjs`. Each call returns independent mutable data. Put the submitted fixtures under `mock/data/` and initialize one shared store across feature handlers at startup.
- Use the PA#2 timeline and application IDs. To demonstrate open and closed flows with the same fixed dates, provide a controllable mock clock in the runner. Use the campaign date zone (`Asia/Ho_Chi_Minh`) for application dates and local interview times.
- Demo accounts include `executive@clubflow.test`, `applicant-1@clubflow.test` and `interviewer-1@clubflow.test`. The local fixture password is `clubflow-demo`. Seeded CVs are filenames only. The CV handler will need its own demo PDF content.
- Join schedule rows by `applicationId`, `interviewerId` and `roomId`. Use `application.applicantId` to detect overlapping interviews across applications. Candidate availability refers to campaign slot IDs. Merge adjacent availability ranges when checking interview windows. Schedule rows carry their assigned start and end times independently of the input slots. Treat adjacent interviews as non-overlapping.
- `schedule.status` is `Draft` or `Confirmed`. `confirmedAt` stays null until confirmation succeeds. Row statuses describe draft validity. C6 and C10 read assigned interviews only from a confirmed schedule. C11 keeps results and notifications separate from schedule confirmation. The seed starts in Draft with A01/A02 Conflict, A03 Proposed and A04 Unassigned.
- Counts come from the store. The seed has five applications from four people (four Shortlisted, one Rejected) and four schedule rows. Keep the A05 availability slot as demo-only data added for PA#3. It does not affect the schedule.

## Changes

| Date | Change |
| --- | --- |
| 2026-11-26 | Proposed shared authorization, error format, mock mode selection, route map and seed conventions. |
| 2026-11-26 | Updated endpoint rows and example rules for the official checker. Aligned validation errors, mock modes and demo token lifetime with the PA#3 rubric. |
