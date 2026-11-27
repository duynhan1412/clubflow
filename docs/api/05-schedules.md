# Interview schedules — C8 and C9

Owner: Trịnh Duy Nhân. Status: initial resource contract, written before mock handlers and React consumers. No implementation is claimed. This contract adopts the five existing schedule routes in [README](README.md#endpoint-table-and-contract-status) and the persisted campaign setup from [C4](03-interview-setup.md). All five routes require an Executive Bearer token. Applicant and Interviewer views use their own scoped endpoints after confirmation, never these Executive routes.

## Endpoint overview and common inputs

| Method | Full path | Feature | Success | Applicable errors |
| --- | --- | --- | --- | --- |
| GET | /api/executive/campaigns/:campaignId/schedule | C8/C9 | 200 JSON snapshot and summary | 400, 401, 403, 404 CAMPAIGN_NOT_FOUND, 500 |
| PUT | /api/executive/campaigns/:campaignId/schedule | C8 | 200 saved Draft and summary | 400, 401, 403, 404 CAMPAIGN_NOT_FOUND, 409 CAMPAIGN_LOCKED / INTERVIEW_SETUP_INCOMPLETE, 500 |
| POST | /api/executive/campaigns/:campaignId/schedule/generate | C8 | 200 generated Draft and summary | 400, 401, 403, 404 CAMPAIGN_NOT_FOUND, 409 CAMPAIGN_LOCKED / INTERVIEW_SETUP_INCOMPLETE, 500 |
| GET | /api/executive/campaigns/:campaignId/schedule/export | C8 | 200 CSV | 400, 401, 403, 404 CAMPAIGN_NOT_FOUND / SCHEDULE_NOT_FOUND, 500 |
| POST | /api/executive/campaigns/:campaignId/schedule/confirm | C9 | 200 Confirmed snapshot and summary | 400, 401, 403, 404 CAMPAIGN_NOT_FOUND, 409 CAMPAIGN_LOCKED / SCHEDULE_CONFIRMATION_BLOCKED, 500 |

Path campaignId is a non-empty campaign ID. All routes accept no query parameters; unknown ones return 400 VALIDATION_FAILED with fieldErrors keyed by query.<name>. GET has no request body. POST generate/confirm accept an absent body or {}; other properties or non-object bodies return 400. PUT accepts only the schema below. All JSON responses use Content-Type: application/json; export successes use CSV, but export errors still use JSON. Unknown campaign IDs return 404 after authentication/role checks.

## JSON response schemas

GET, PUT, generate and confirm use exactly { schedule: Schedule | null, summary: Summary }. Only GET may return schedule: null, meaning no draft has been saved/generated yet. This is 200, not an error; the UI shows a Generate Draft prompt. PUT and generate create/replace a Draft and return 200 whether or not a previous draft existed. No bodyless success is used.

### Schedule

| Field | Type and meaning |
| --- | --- |
| campaignId | Non-empty string, matching the URL campaign. |
| date | YYYY-MM-DD, matching the configured interviewDate. |
| window | { start: HH:mm, end: HH:mm }, matching interviewWindow. |
| durationMinutes | Integer 15, 20 or 30, matching the campaign's common duration. |
| status | Draft or Confirmed. Saving/generating never sets Confirmed. |
| confirmedAt | null for Draft; ISO 8601 timestamp with timezone for Confirmed, assigned by the server once. |
| rows | ScheduleRow[], ordered by applicationId using ascending code-point order. |

ScheduleRow contains all fields below, even for Unassigned rows. This is an enriched response view; internal seed rows need not store labels or summary values.

| Field | Type and meaning |
| --- | --- |
| applicationId | Current Shortlisted application's non-empty ID. One row per application in a valid schedule. |
| applicantId, applicantName | Applicant ID and display name, joined from this application. Applicant identity is used to detect A01/A02 overlaps. |
| positionId, positionTitle | Position ID and display title, joined from this application. |
| availabilitySlotIds | string[] of the application's original selected slot IDs; unchanged by scheduling. Resolve their ranges through C1 campaign availabilitySlots. |
| time | { start: HH:mm, end: HH:mm } for an assignment, or null. |
| interviewerId, interviewerName | Existing interviewer ID and catalogue name, or both null. |
| roomId, roomName | Selected existing room ID and catalogue name, or both null. |
| status | Proposed, Conflict or Unassigned. These describe row validity; confirmation is a schedule-level state. Valid Confirmed rows retain Proposed. |
| conflictingApplicationIds | Other overlapping application IDs, unique and ascending; [] when none. Qualification/availability errors can be Conflict with this array empty. |
| reason | null for Proposed; a concrete human-readable reason for Conflict or Unassigned. Include which availability/qualification/resource failed and name overlapping applications when present. |

No account credentials, student contact details, CV content, statements, screening notes, assessments, results or notifications are embedded. C8 may display its list entirely from these row labels; editing choices come from documented C1 and C4 reads, without requiring an undocumented applications endpoint.

### Summary and confirmation preview

| Field | Type and meaning |
| --- | --- |
| totalApplications | Non-negative integer; all applications in this campaign. |
| reviewedApplications | Count with status Shortlisted or Rejected. |
| shortlistedApplications | Count with status Shortlisted, by application ID, not unique applicant. |
| proposed, conflict, unassigned | Non-negative row counts after rechecking. For an ordinary valid Draft these sum to shortlistedApplications. Missing assignments count as Unassigned. |
| applicationsClosed | Boolean; current campaign-local date is strictly after closesOn. The closing day is included. False if closesOn is absent/invalid. |
| allApplicationsReviewed | Boolean; no application remains Submitted or otherwise unreviewed. |
| canConfirm | Boolean; true only for a saved Draft with valid setup and every confirmation gate satisfied. Always false when Confirmed or schedule is null. |
| blockingApplicationIds | Unique ascending IDs for unreviewed applications and Shortlisted applications with missing, duplicate or invalid assignments. Campaign-wide blockers alone add no IDs. |

Summary is computed from the current campaign, applications, configuration and schedule, not stored UI counts. No saved schedule means schedule: null, proposed/conflict 0, unassigned equal to shortlistedApplications, and canConfirm false. Newly Shortlisted applications without a stored row appear as Unassigned in a Draft read; rows for applications no longer Shortlisted are omitted from the current Draft view and removed on the next PUT/generate. Reads do not create a stored schedule. If stored duplicate assignments exist, retain and mark the affected rows Conflict and include the application ID in blockers; counts describe the returned rows until repaired. Confirmation independently rejects duplicates; it never trusts a displayed count or client-provided status. Confirmed snapshots cannot be reconciled by later screening edits because screening writes are locked.

## PUT — save a full Draft

The only request property is required rows, an array of DraftRow. Each DraftRow has exactly four required properties:

| Property | Type and limits |
| --- | --- |
| applicationId | Non-empty string; unique in the request; belongs to this campaign and is currently Shortlisted. |
| time | null, or exactly { start: HH:mm, end: HH:mm }; real 24-hour times (00–23 / 00–59), same day, start < end. |
| interviewerId | Existing interviewer ID or null. |
| roomId | Existing room ID selected in the campaign's roomIds, or null. |

Send exactly one row for every current Shortlisted application. rows: [] is valid only when none are Shortlisted. An omitted/duplicate/foreign/non-Shortlisted application, missing property, partial assignment, unknown ID, non-selected room, unsupported field or malformed time returns 400 VALIDATION_FAILED with zero-based fieldErrors such as rows.1.time.start or rows.1.applicationId. A fully unassigned row must have time, interviewerId and roomId all null; an assigned row must have all three non-null. Do not send status, reason, names, counts, campaignId, date, window, durationMinutes or confirmedAt. Invalid JSON uses empty fieldErrors. A refused write changes neither configuration nor schedule.

Syntactically valid assignments may still violate duration, window, qualification or availability, or overlap another assignment. Save those rows as Conflict with reasons and the current blockers; do not refuse the whole Draft just because it cannot yet be confirmed. PUT rechecks every row, including both sides of a new or resolved overlap, before returning the saved Draft. Save Changes preserves Draft and confirmedAt: null. Edit, Resolve and + Assign Slot all use this PUT; there are no additional action endpoints. Preserve unsaved valid form input on a refused write.

The user may edit locally, but each submitted edit must be rechecked from the PUT response before presenting its validity as authoritative. The server returns a complete updated Draft, not a patch. No revision/concurrency token is introduced in this PA#3 contract.

## Validity checks and deterministic generation

Configure date, window and common duration through C4 PUT interview-setup before generate; C4 also assigns interviewers/positions, their availability and selected rooms. C8 does not duplicate those writable configuration fields. If C4 saves but generation fails, the saved setup remains; a generate failure does not roll back a preceding separate C4 request. C4 rechecks an existing Draft as its own contract specifies.

PUT/generate require a real interviewDate after closesOn when closesOn is set, a valid same-day window long enough for the common duration, and duration 15/20/30. Missing/invalid date/window/duration returns 409 INTERVIEW_SETUP_INCOMPLETE with fieldErrors naming the C4 fields. Empty interviewer/room selections are not setup errors: generation returns Unassigned rows with concrete reasons. Changing the interview date after applications exist remains forbidden by C4.

For every assigned row check: current Shortlisted status, date/window, exactly durationMinutes, interviewer qualification for the position, full Applicant availability, full Interviewer availability, full room availability and no Applicant/Interviewer/room overlap. Merge adjacent availability ranges before checking full containment. An interval [start,end) overlaps another only when start < other.end and other.start < end; adjacent interviews do not overlap. Check all existing assigned intervals, even if another validity check already fails. Mark every participant in each overlap Conflict; conflictingApplicationIds excludes self, is unique and sorted, and reason identifies applicant/interviewer/room overlaps separately. A non-overlapping invalid assignment is still Conflict with its specific reason. Fully null rows are Unassigned with an explanation, never an automatic rejection.

Generation replaces the entire saved Draft; it does not edit screening status, application availability or setup. Process Shortlisted applications by ascending application ID. For each, enumerate start times from window.start in common-duration increments, ignoring a trailing interval shorter than duration, then qualified interviewers by ascending ID, then selected rooms by ascending ID. Take the first combination satisfying all checks against earlier placements, or emit an Unassigned row with a concrete failure reason (for example no qualified interviewer, no shared availability or no free selected room). This makes the generation sequence explicit. PA#3 may serve prepared responses only if they demonstrate the same valid states; PA#4 implements the rule. Generation must not manufacture the seed's manual-edit conflict.

The seed Draft is a snapshot after A02 was manually moved onto A01. It is not the expected output of fresh generation. Initial reads show A01/A02 Conflict, A03 Proposed and A04 Unassigned. Generation with the original setup instead places A01 at 09:00–09:20 in room-1, A02 at 09:20–09:40 in room-1, A03 at 09:20–09:40 in room-2, and leaves A04 Unassigned because its qualified interviewer ends at 10:00. Replacing the generated rooms manually with other valid selected rooms is allowed.

## Confirm — C9

POST confirm has no client-supplied confirmation flags or rows. It rechecks the current persisted configuration, all current applications and the stored Draft atomically at confirmation time. A previously saved summary is not authorization to confirm.

All of these conditions must hold: applications are closed; every application is reviewed; valid interview setup exists; a saved Draft exists; each current Shortlisted application has exactly one complete valid assignment; there is no Conflict or Unassigned row. An empty Shortlisted set does not itself add a new gate, but every other condition still applies. Missing or duplicate assignments block the affected application. Unreviewed applications are also included in blockers. Respond 409 SCHEDULE_CONFIRMATION_BLOCKED with the shared envelope, all distinct affected applicationIds in ascending order, and fieldErrors for campaign-wide issues: closesOn (applications still open/missing close date), applications (reviews incomplete), interviewDate/interviewWindow/durationMinutes (setup invalid), or schedule (no saved Draft). Use multiple fields when multiple campaign-wide gates fail. Row-level reasons remain in GET schedule; do not add extra fields to the shared error object. When only a campaign-wide condition blocks confirmation, applicationIds is []. A failure writes nothing.

Success is 200 with status Confirmed and a server-assigned confirmedAt timestamp; assignments remain unchanged. The timestamp in the example is illustrative (normal checker mode reports value differences as notes); do not require the runner to hard-code a wall-clock timestamp. The application-close gate uses the existing MOCK_DATE default 2026-11-06 in PA#3 and Asia/Ho_Chi_Minh. No scheduling-specific date-override header is added; X-ClubFlow-Mock-Date remains limited to eligible application examples. PA#4 evaluates the gate using its server clock.

After confirmation, PUT schedule, generate and repeat confirm return 409 CAMPAIGN_LOCKED without modification. C3 campaign edits/publish, C4 setup and application/screening writes are also locked; their handlers must enforce the same campaign state. GET schedule and CSV export remain available. A retry after an uncertain successful confirm should GET the schedule to discover its Confirmed state. C6 joins own confirmed rows into interview { date, start, end, roomName }; C10 exposes only the caller's assigned confirmed rows/CVs. Confirmation itself neither creates assessments nor publishes Pass/Fail or notifications; those follow their own C10/C11 operations.

## CSV export

Export the saved current Draft or Confirmed snapshot after rechecking. No saved schedule returns 404 SCHEDULE_NOT_FOUND. Use Content-Type: text/csv; charset=utf-8 and Content-Disposition: attachment; filename="<campaignId>-schedule.csv". Filename content is sanitized to letters, digits, hyphen and underscore (replace other characters with underscore), while the URL retains the original campaign ID. Columns, in order: applicationId,applicantName,positionTitle,date,start,end,interviewerName,roomName,status,reason. One row per displayed schedule row, ordered by application ID. Unassigned start/end/interviewer/room are empty cells. Include the header even when there are no rows. Quote/escape CSV cells containing commas, quotes or newlines using doubled quotes. Do not include internal notes or credentials. The paired CSV response example intentionally omits its body, as allowed by the official checker.

## Errors and mock modes

Every error is { error: { code: string, message: string, fieldErrors: object mapping field paths to strings, applicationIds: string[] } }. Empty details are {} and []; do not omit them. The method table lists applicability.

| Status | Code | Meaning |
| --- | --- | --- |
| 400 | VALIDATION_FAILED | Invalid JSON, unsupported fields/query/body, malformed times, invalid row coverage/IDs or partial assignment. Field messages identify the offending input. |
| 401 | UNAUTHENTICATED | Missing or invalid Bearer token. |
| 403 | FORBIDDEN | Authenticated user is not Executive. |
| 404 | CAMPAIGN_NOT_FOUND | Unknown campaign, after authentication and role checks. |
| 404 | SCHEDULE_NOT_FOUND | Export requested before any saved/generated schedule. |
| 409 | CAMPAIGN_LOCKED | A schedule write/confirmation attempt after Confirmed. |
| 409 | INTERVIEW_SETUP_INCOMPLETE | PUT/generate cannot use missing/invalid campaign date/window/duration. |
| 409 | SCHEDULE_CONFIRMATION_BLOCKED | Confirm failed one or more business gates; applicationIds names all affected applications. |
| 500 | MOCK_UNAVAILABLE | Simulated failure; no write is applied. |

Runner-level simulated error takes precedence. Otherwise authenticate and authorize, look up campaign, check confirmation lock for writes, validate request shape/query, then validate setup/rows or evaluate confirmation gates. Unknown query parameters on an unlocked resource use 400. Export looks up a saved schedule after validating its request. Normal answers arrive after about 150 ms; slow uses the same schemas after about 2 seconds. Error returns 500 in the shared shape. Empty recursively replaces response arrays with [], including schedule.rows, availabilitySlotIds and blocker IDs, preserves single objects/scalars, and sets all numeric Summary counts to 0. It is a response projection, not a deletion of the store: writes and confirmation gates still evaluate real data. Boolean gates retain their real values and status remains Draft or Confirmed. No empty response may reveal an extra draft assignment to another role. Retry after restarting in normal mode uses the same demo token and does not reload the page.

## Executable examples — one ordered scenario

Use a fresh normal-mode mock with default MOCK_DATE=2026-11-06. The checker runs README, 01-session.md, 02-campaigns.md, 03-interview-setup.md, then 04-applications.md before this file. C2 must establish exec and the FRONTEND.md Demo accounts table. C5/C7 examples must leave A01–A04 Shortlisted and A05 Rejected, and must not change the seed setup/schedule; any extra submission must be reviewed as Rejected. Complete response values below assume exactly the original five applications. If 04 adds a rejected application, totalApplications and reviewedApplications differ together by that count; ordinary checker mode reports this as a value note, not a field/status failure. Coordinate the final integrated examples before strict-values checking; do not add a fake application to this contract or silently reset the shared store.

Session/applications contracts, FRONTEND.md and the runner are still pending, so these are static, checker-formatted examples, not a claimed official checker pass. Future C6/C10/C11 confirmed reads belong after this file or in a final scenario file; they cannot assume confirmation earlier in alphabetical order.

### GET /api/executive/campaigns/:campaignId/schedule — initial Draft

```http
GET /api/executive/campaigns/fall-2026/schedule HTTP/1.1
Authorization: Bearer {{token:exec}}

```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "schedule": {
    "campaignId": "fall-2026",
    "date": "2026-11-10",
    "window": {
      "start": "09:00",
      "end": "11:00"
    },
    "durationMinutes": 20,
    "status": "Draft",
    "confirmedAt": null,
    "rows": [
      {
        "applicationId": "A01",
        "status": "Conflict",
        "time": {
          "start": "09:00",
          "end": "09:20"
        },
        "interviewerId": "interviewer-1",
        "roomId": "room-1",
        "conflictingApplicationIds": [
          "A02"
        ],
        "reason": "Applicant overlaps with A02.",
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Đặng Thu Hà",
        "roomName": "Lab 1"
      },
      {
        "applicationId": "A02",
        "status": "Conflict",
        "time": {
          "start": "09:00",
          "end": "09:20"
        },
        "interviewerId": "interviewer-2",
        "roomId": "room-2",
        "conflictingApplicationIds": [
          "A01"
        ],
        "reason": "Applicant overlaps with A01.",
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-communications",
        "positionTitle": "Điều phối viên Truyền thông",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Võ Quốc Khánh",
        "roomName": "Lab 2"
      },
      {
        "applicationId": "A03",
        "status": "Proposed",
        "time": {
          "start": "09:20",
          "end": "09:40"
        },
        "interviewerId": "interviewer-3",
        "roomId": "room-3",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-2",
        "applicantName": "Trần Quang Huy",
        "positionId": "pos-design",
        "positionTitle": "Thiết kế Trải nghiệm",
        "availabilitySlotIds": [
          "slot-2",
          "slot-3"
        ],
        "interviewerName": "Bùi Mai Linh",
        "roomName": "Lab 3"
      },
      {
        "applicationId": "A04",
        "status": "Unassigned",
        "time": null,
        "interviewerId": null,
        "roomId": null,
        "conflictingApplicationIds": [],
        "reason": "The applicant is free from 10:00 to 11:00, after the qualified interviewer’s availability ends.",
        "applicantId": "applicant-3",
        "applicantName": "Lê Hoàng Phúc",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-4",
          "slot-5",
          "slot-6"
        ],
        "interviewerName": null,
        "roomName": null
      }
    ]
  },
  "summary": {
    "totalApplications": 5,
    "reviewedApplications": 5,
    "shortlistedApplications": 4,
    "proposed": 1,
    "conflict": 2,
    "unassigned": 1,
    "applicationsClosed": true,
    "allApplicationsReviewed": true,
    "canConfirm": false,
    "blockingApplicationIds": [
      "A01",
      "A02",
      "A04"
    ]
  }
}
```

### POST /api/executive/campaigns/:campaignId/schedule/confirm — initial refusal

The shared seed has three blockers and no campaign-wide failure:

```http
POST /api/executive/campaigns/fall-2026/schedule/confirm HTTP/1.1
Authorization: Bearer {{token:exec}}

```

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": {
    "code": "SCHEDULE_CONFIRMATION_BLOCKED",
    "message": "Resolve the listed applications before confirming.",
    "fieldErrors": {},
    "applicationIds": [
      "A01",
      "A02",
      "A04"
    ]
  }
}
```

### PUT /api/executive/campaigns/:campaignId/schedule — Save Changes keeps Draft

Submitting the current assignments rechecks them; it does not convert them to Confirmed or silently resolve the overlap:

```http
PUT /api/executive/campaigns/fall-2026/schedule HTTP/1.1
Authorization: Bearer {{token:exec}}
Content-Type: application/json

{
  "rows": [
    {
      "applicationId": "A01",
      "time": {
        "start": "09:00",
        "end": "09:20"
      },
      "interviewerId": "interviewer-1",
      "roomId": "room-1"
    },
    {
      "applicationId": "A02",
      "time": {
        "start": "09:00",
        "end": "09:20"
      },
      "interviewerId": "interviewer-2",
      "roomId": "room-2"
    },
    {
      "applicationId": "A03",
      "time": {
        "start": "09:20",
        "end": "09:40"
      },
      "interviewerId": "interviewer-3",
      "roomId": "room-3"
    },
    {
      "applicationId": "A04",
      "time": null,
      "interviewerId": null,
      "roomId": null
    }
  ]
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "schedule": {
    "campaignId": "fall-2026",
    "date": "2026-11-10",
    "window": {
      "start": "09:00",
      "end": "11:00"
    },
    "durationMinutes": 20,
    "status": "Draft",
    "confirmedAt": null,
    "rows": [
      {
        "applicationId": "A01",
        "status": "Conflict",
        "time": {
          "start": "09:00",
          "end": "09:20"
        },
        "interviewerId": "interviewer-1",
        "roomId": "room-1",
        "conflictingApplicationIds": [
          "A02"
        ],
        "reason": "Applicant overlaps with A02.",
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Đặng Thu Hà",
        "roomName": "Lab 1"
      },
      {
        "applicationId": "A02",
        "status": "Conflict",
        "time": {
          "start": "09:00",
          "end": "09:20"
        },
        "interviewerId": "interviewer-2",
        "roomId": "room-2",
        "conflictingApplicationIds": [
          "A01"
        ],
        "reason": "Applicant overlaps with A01.",
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-communications",
        "positionTitle": "Điều phối viên Truyền thông",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Võ Quốc Khánh",
        "roomName": "Lab 2"
      },
      {
        "applicationId": "A03",
        "status": "Proposed",
        "time": {
          "start": "09:20",
          "end": "09:40"
        },
        "interviewerId": "interviewer-3",
        "roomId": "room-3",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-2",
        "applicantName": "Trần Quang Huy",
        "positionId": "pos-design",
        "positionTitle": "Thiết kế Trải nghiệm",
        "availabilitySlotIds": [
          "slot-2",
          "slot-3"
        ],
        "interviewerName": "Bùi Mai Linh",
        "roomName": "Lab 3"
      },
      {
        "applicationId": "A04",
        "status": "Unassigned",
        "time": null,
        "interviewerId": null,
        "roomId": null,
        "conflictingApplicationIds": [],
        "reason": "The applicant is free from 10:00 to 11:00, after the qualified interviewer’s availability ends.",
        "applicantId": "applicant-3",
        "applicantName": "Lê Hoàng Phúc",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-4",
          "slot-5",
          "slot-6"
        ],
        "interviewerName": null,
        "roomName": null
      }
    ]
  },
  "summary": {
    "totalApplications": 5,
    "reviewedApplications": 5,
    "shortlistedApplications": 4,
    "proposed": 1,
    "conflict": 2,
    "unassigned": 1,
    "applicationsClosed": true,
    "allApplicationsReviewed": true,
    "canConfirm": false,
    "blockingApplicationIds": [
      "A01",
      "A02",
      "A04"
    ]
  }
}
```

A partial assignment is a field error, not a saved Conflict:

```http
PUT /api/executive/campaigns/fall-2026/schedule HTTP/1.1
Authorization: Bearer {{token:exec}}
Content-Type: application/json

{
  "rows": [
    {
      "applicationId": "A01",
      "time": {
        "start": "09:00",
        "end": "09:20"
      },
      "interviewerId": "interviewer-1",
      "roomId": "room-1"
    },
    {
      "applicationId": "A02",
      "time": {
        "start": "09:00",
        "end": "09:20"
      },
      "interviewerId": "interviewer-2",
      "roomId": null
    },
    {
      "applicationId": "A03",
      "time": {
        "start": "09:20",
        "end": "09:40"
      },
      "interviewerId": "interviewer-3",
      "roomId": "room-3"
    },
    {
      "applicationId": "A04",
      "time": null,
      "interviewerId": null,
      "roomId": null
    }
  ]
}
```

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Check the highlighted fields.",
    "fieldErrors": {
      "rows.1.roomId": "Choose a room for this assignment, or clear time and interviewerId too."
    },
    "applicationIds": []
  }
}
```

Resolve A02 without changing A01's application or interviewer. Both sides of its previous overlap become Proposed; A04 still blocks confirmation:

```http
PUT /api/executive/campaigns/fall-2026/schedule HTTP/1.1
Authorization: Bearer {{token:exec}}
Content-Type: application/json

{
  "rows": [
    {
      "applicationId": "A01",
      "time": {
        "start": "09:00",
        "end": "09:20"
      },
      "interviewerId": "interviewer-1",
      "roomId": "room-1"
    },
    {
      "applicationId": "A02",
      "time": {
        "start": "09:20",
        "end": "09:40"
      },
      "interviewerId": "interviewer-2",
      "roomId": "room-2"
    },
    {
      "applicationId": "A03",
      "time": {
        "start": "09:20",
        "end": "09:40"
      },
      "interviewerId": "interviewer-3",
      "roomId": "room-3"
    },
    {
      "applicationId": "A04",
      "time": null,
      "interviewerId": null,
      "roomId": null
    }
  ]
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "schedule": {
    "campaignId": "fall-2026",
    "date": "2026-11-10",
    "window": {
      "start": "09:00",
      "end": "11:00"
    },
    "durationMinutes": 20,
    "status": "Draft",
    "confirmedAt": null,
    "rows": [
      {
        "applicationId": "A01",
        "status": "Proposed",
        "time": {
          "start": "09:00",
          "end": "09:20"
        },
        "interviewerId": "interviewer-1",
        "roomId": "room-1",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Đặng Thu Hà",
        "roomName": "Lab 1"
      },
      {
        "applicationId": "A02",
        "status": "Proposed",
        "time": {
          "start": "09:20",
          "end": "09:40"
        },
        "interviewerId": "interviewer-2",
        "roomId": "room-2",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-communications",
        "positionTitle": "Điều phối viên Truyền thông",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Võ Quốc Khánh",
        "roomName": "Lab 2"
      },
      {
        "applicationId": "A03",
        "status": "Proposed",
        "time": {
          "start": "09:20",
          "end": "09:40"
        },
        "interviewerId": "interviewer-3",
        "roomId": "room-3",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-2",
        "applicantName": "Trần Quang Huy",
        "positionId": "pos-design",
        "positionTitle": "Thiết kế Trải nghiệm",
        "availabilitySlotIds": [
          "slot-2",
          "slot-3"
        ],
        "interviewerName": "Bùi Mai Linh",
        "roomName": "Lab 3"
      },
      {
        "applicationId": "A04",
        "status": "Unassigned",
        "time": null,
        "interviewerId": null,
        "roomId": null,
        "conflictingApplicationIds": [],
        "reason": "The applicant is free from 10:00 to 11:00, after the qualified interviewer’s availability ends.",
        "applicantId": "applicant-3",
        "applicantName": "Lê Hoàng Phúc",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-4",
          "slot-5",
          "slot-6"
        ],
        "interviewerName": null,
        "roomName": null
      }
    ]
  },
  "summary": {
    "totalApplications": 5,
    "reviewedApplications": 5,
    "shortlistedApplications": 4,
    "proposed": 3,
    "conflict": 0,
    "unassigned": 1,
    "applicationsClosed": true,
    "allApplicationsReviewed": true,
    "canConfirm": false,
    "blockingApplicationIds": [
      "A04"
    ]
  }
}
```

```http
POST /api/executive/campaigns/fall-2026/schedule/confirm HTTP/1.1
Authorization: Bearer {{token:exec}}

```

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": {
    "code": "SCHEDULE_CONFIRMATION_BLOCKED",
    "message": "Resolve the listed applications before confirming.",
    "fieldErrors": {},
    "applicationIds": [
      "A04"
    ]
  }
}
```

### POST /api/executive/campaigns/:campaignId/schedule/generate — replace the Draft

The deterministic sequence uses room-1 for A02 and room-2 for A03. A04 remains Unassigned under the original setup:

```http
POST /api/executive/campaigns/fall-2026/schedule/generate HTTP/1.1
Authorization: Bearer {{token:exec}}

```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "schedule": {
    "campaignId": "fall-2026",
    "date": "2026-11-10",
    "window": {
      "start": "09:00",
      "end": "11:00"
    },
    "durationMinutes": 20,
    "status": "Draft",
    "confirmedAt": null,
    "rows": [
      {
        "applicationId": "A01",
        "status": "Proposed",
        "time": {
          "start": "09:00",
          "end": "09:20"
        },
        "interviewerId": "interviewer-1",
        "roomId": "room-1",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Đặng Thu Hà",
        "roomName": "Lab 1"
      },
      {
        "applicationId": "A02",
        "status": "Proposed",
        "time": {
          "start": "09:20",
          "end": "09:40"
        },
        "interviewerId": "interviewer-2",
        "roomId": "room-1",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-communications",
        "positionTitle": "Điều phối viên Truyền thông",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Võ Quốc Khánh",
        "roomName": "Lab 1"
      },
      {
        "applicationId": "A03",
        "status": "Proposed",
        "time": {
          "start": "09:20",
          "end": "09:40"
        },
        "interviewerId": "interviewer-3",
        "roomId": "room-2",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-2",
        "applicantName": "Trần Quang Huy",
        "positionId": "pos-design",
        "positionTitle": "Thiết kế Trải nghiệm",
        "availabilitySlotIds": [
          "slot-2",
          "slot-3"
        ],
        "interviewerName": "Bùi Mai Linh",
        "roomName": "Lab 2"
      },
      {
        "applicationId": "A04",
        "status": "Unassigned",
        "time": null,
        "interviewerId": null,
        "roomId": null,
        "conflictingApplicationIds": [],
        "reason": "The applicant is free from 10:00 to 11:00, after the qualified interviewer’s availability ends.",
        "applicantId": "applicant-3",
        "applicantName": "Lê Hoàng Phúc",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-4",
          "slot-5",
          "slot-6"
        ],
        "interviewerName": null,
        "roomName": null
      }
    ]
  },
  "summary": {
    "totalApplications": 5,
    "reviewedApplications": 5,
    "shortlistedApplications": 4,
    "proposed": 3,
    "conflict": 0,
    "unassigned": 1,
    "applicationsClosed": true,
    "allApplicationsReviewed": true,
    "canConfirm": false,
    "blockingApplicationIds": [
      "A04"
    ]
  }
}
```

### Cross-resource repair — extend the qualified interviewer's availability

This is the already documented C4 PUT, performed here after the initial confirmation refusal, not a new route. It extends interviewer-1 through 10:20; it preserves Applicant input slots. Its response schema is exactly C4's:

```http
PUT /api/executive/campaigns/fall-2026/interview-setup HTTP/1.1
Authorization: Bearer {{token:exec}}
Content-Type: application/json

{
  "interviewDate": "2026-11-10",
  "interviewWindow": {
    "start": "09:00",
    "end": "11:00"
  },
  "durationMinutes": 20,
  "roomIds": [
    "room-1",
    "room-2",
    "room-3"
  ],
  "interviewers": [
    {
      "id": "interviewer-1",
      "positionIds": [
        "pos-content"
      ],
      "availability": [
        {
          "start": "09:00",
          "end": "10:20"
        }
      ]
    },
    {
      "id": "interviewer-2",
      "positionIds": [
        "pos-communications"
      ],
      "availability": [
        {
          "start": "09:00",
          "end": "11:00"
        }
      ]
    },
    {
      "id": "interviewer-3",
      "positionIds": [
        "pos-design"
      ],
      "availability": [
        {
          "start": "09:00",
          "end": "11:00"
        }
      ]
    }
  ]
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "interviewSetup": {
    "campaignId": "fall-2026",
    "interviewDate": "2026-11-10",
    "interviewWindow": {
      "start": "09:00",
      "end": "11:00"
    },
    "durationMinutes": 20,
    "roomIds": [
      "room-1",
      "room-2",
      "room-3"
    ],
    "interviewers": [
      {
        "id": "interviewer-1",
        "name": "Đặng Thu Hà",
        "positionIds": [
          "pos-content"
        ],
        "availability": [
          {
            "start": "09:00",
            "end": "10:20"
          }
        ]
      },
      {
        "id": "interviewer-2",
        "name": "Võ Quốc Khánh",
        "positionIds": [
          "pos-communications"
        ],
        "availability": [
          {
            "start": "09:00",
            "end": "11:00"
          }
        ]
      },
      {
        "id": "interviewer-3",
        "name": "Bùi Mai Linh",
        "positionIds": [
          "pos-design"
        ],
        "availability": [
          {
            "start": "09:00",
            "end": "11:00"
          }
        ]
      }
    ],
    "rooms": [
      {
        "id": "room-1",
        "name": "Lab 1",
        "availability": [
          {
            "start": "09:00",
            "end": "11:00"
          }
        ]
      },
      {
        "id": "room-2",
        "name": "Lab 2",
        "availability": [
          {
            "start": "09:00",
            "end": "11:00"
          }
        ]
      },
      {
        "id": "room-3",
        "name": "Lab 3",
        "availability": [
          {
            "start": "09:00",
            "end": "11:00"
          }
        ]
      }
    ],
    "positions": [
      {
        "id": "pos-content",
        "title": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng"
      },
      {
        "id": "pos-communications",
        "title": "Điều phối viên Truyền thông"
      },
      {
        "id": "pos-design",
        "title": "Thiết kế Trải nghiệm"
      }
    ]
  }
}
```

Assign A04 10:00–10:20 in Lab 1. The other rooms may be restored to their seed values because those assignments are valid. Save remains Draft:

```http
PUT /api/executive/campaigns/fall-2026/schedule HTTP/1.1
Authorization: Bearer {{token:exec}}
Content-Type: application/json

{
  "rows": [
    {
      "applicationId": "A01",
      "time": {
        "start": "09:00",
        "end": "09:20"
      },
      "interviewerId": "interviewer-1",
      "roomId": "room-1"
    },
    {
      "applicationId": "A02",
      "time": {
        "start": "09:20",
        "end": "09:40"
      },
      "interviewerId": "interviewer-2",
      "roomId": "room-2"
    },
    {
      "applicationId": "A03",
      "time": {
        "start": "09:20",
        "end": "09:40"
      },
      "interviewerId": "interviewer-3",
      "roomId": "room-3"
    },
    {
      "applicationId": "A04",
      "time": {
        "start": "10:00",
        "end": "10:20"
      },
      "interviewerId": "interviewer-1",
      "roomId": "room-1"
    }
  ]
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "schedule": {
    "campaignId": "fall-2026",
    "date": "2026-11-10",
    "window": {
      "start": "09:00",
      "end": "11:00"
    },
    "durationMinutes": 20,
    "status": "Draft",
    "confirmedAt": null,
    "rows": [
      {
        "applicationId": "A01",
        "status": "Proposed",
        "time": {
          "start": "09:00",
          "end": "09:20"
        },
        "interviewerId": "interviewer-1",
        "roomId": "room-1",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Đặng Thu Hà",
        "roomName": "Lab 1"
      },
      {
        "applicationId": "A02",
        "status": "Proposed",
        "time": {
          "start": "09:20",
          "end": "09:40"
        },
        "interviewerId": "interviewer-2",
        "roomId": "room-2",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-communications",
        "positionTitle": "Điều phối viên Truyền thông",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Võ Quốc Khánh",
        "roomName": "Lab 2"
      },
      {
        "applicationId": "A03",
        "status": "Proposed",
        "time": {
          "start": "09:20",
          "end": "09:40"
        },
        "interviewerId": "interviewer-3",
        "roomId": "room-3",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-2",
        "applicantName": "Trần Quang Huy",
        "positionId": "pos-design",
        "positionTitle": "Thiết kế Trải nghiệm",
        "availabilitySlotIds": [
          "slot-2",
          "slot-3"
        ],
        "interviewerName": "Bùi Mai Linh",
        "roomName": "Lab 3"
      },
      {
        "applicationId": "A04",
        "status": "Proposed",
        "time": {
          "start": "10:00",
          "end": "10:20"
        },
        "interviewerId": "interviewer-1",
        "roomId": "room-1",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-3",
        "applicantName": "Lê Hoàng Phúc",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-4",
          "slot-5",
          "slot-6"
        ],
        "interviewerName": "Đặng Thu Hà",
        "roomName": "Lab 1"
      }
    ]
  },
  "summary": {
    "totalApplications": 5,
    "reviewedApplications": 5,
    "shortlistedApplications": 4,
    "proposed": 4,
    "conflict": 0,
    "unassigned": 0,
    "applicationsClosed": true,
    "allApplicationsReviewed": true,
    "canConfirm": true,
    "blockingApplicationIds": []
  }
}
```

### Campaign-wide refusal — applications are still open

Temporarily move the closing date to 2026-11-07 through the documented C3 PATCH. The current mock date remains 2026-11-06. All assignments are valid; only the closing gate blocks confirmation, so applicationIds is empty:

```http
PATCH /api/executive/campaigns/fall-2026 HTTP/1.1
Authorization: Bearer {{token:exec}}
Content-Type: application/json

{
  "closesOn": "2026-11-07"
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "campaign": {
    "id": "fall-2026",
    "name": "Tuyển thành viên CLB Công nghệ Mùa Thu 2026",
    "hostClub": "CLB Công nghệ và Sáng tạo",
    "description": "ClubFlow tìm kiếm những thành viên yêu thích công nghệ, sáng tạo nội dung và tổ chức hoạt động cộng đồng. Hãy chọn vị trí phù hợp với thế mạnh của bạn và cùng xây dựng các dự án dành cho sinh viên trong năm học 2026–2027.",
    "instructions": "Chọn vị trí bạn quan tâm, điền thông tin liên hệ, đính kèm CV và viết ngắn gọn lý do muốn tham gia. Bạn có thể nộp đơn cho nhiều vị trí; mỗi đơn được xét riêng. Vui lòng gửi trước ngày 05/11/2026.",
    "status": "Published",
    "opensOn": "2026-10-20",
    "closesOn": "2026-11-07",
    "interviewDate": "2026-11-10",
    "timeZone": "Asia/Ho_Chi_Minh",
    "interviewWindow": {
      "start": "09:00",
      "end": "11:00"
    },
    "durationMinutes": 20,
    "availabilitySlots": [
      {
        "id": "slot-1",
        "start": "09:00",
        "end": "09:20"
      },
      {
        "id": "slot-2",
        "start": "09:20",
        "end": "09:40"
      },
      {
        "id": "slot-3",
        "start": "09:40",
        "end": "10:00"
      },
      {
        "id": "slot-4",
        "start": "10:00",
        "end": "10:20"
      },
      {
        "id": "slot-5",
        "start": "10:20",
        "end": "10:40"
      },
      {
        "id": "slot-6",
        "start": "10:40",
        "end": "11:00"
      }
    ],
    "roomIds": [
      "room-1",
      "room-2",
      "room-3"
    ],
    "departments": [
      {
        "id": "content",
        "name": "Ban Nội dung",
        "positions": [
          {
            "id": "pos-content",
            "title": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
            "quota": 3,
            "description": "Lên ý tưởng và biên tập bài viết, kể câu chuyện về dự án và thành viên trên các kênh truyền thông của CLB.",
            "requirements": "Viết rõ ràng, biết phối hợp nhóm và có thể dành ít nhất 4 giờ mỗi tuần cho hoạt động của ban."
          }
        ]
      },
      {
        "id": "communications",
        "name": "Ban Truyền thông",
        "positions": [
          {
            "id": "pos-communications",
            "title": "Điều phối viên Truyền thông",
            "quota": 2,
            "description": "Lập kế hoạch truyền thông, điều phối lịch đăng và phối hợp đưa tin cho workshop, ngày hội và buổi gặp gỡ.",
            "requirements": "Chủ động, giao tiếp tốt và có thể tham gia đưa tin trực tiếp theo lịch hoạt động của CLB."
          }
        ]
      },
      {
        "id": "design",
        "name": "Ban Thiết kế",
        "positions": [
          {
            "id": "pos-design",
            "title": "Thiết kế Trải nghiệm",
            "quota": 2,
            "description": "Thiết kế ấn phẩm và giao diện đơn giản để truyền tải thông tin hoạt động một cách dễ hiểu.",
            "requirements": "Có sản phẩm mẫu, nắm kiến thức thiết kế cơ bản và sẵn sàng nhận phản hồi để cải thiện."
          }
        ]
      }
    ]
  }
}
```

```http
POST /api/executive/campaigns/fall-2026/schedule/confirm HTTP/1.1
Authorization: Bearer {{token:exec}}

```

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": {
    "code": "SCHEDULE_CONFIRMATION_BLOCKED",
    "message": "Applications must close before confirming.",
    "fieldErrors": {
      "closesOn": "Wait until the application closing day has ended."
    },
    "applicationIds": []
  }
}
```

Restore the original closing date. This does not change any application or interview assignment:

```http
PATCH /api/executive/campaigns/fall-2026 HTTP/1.1
Authorization: Bearer {{token:exec}}
Content-Type: application/json

{
  "closesOn": "2026-11-05"
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "campaign": {
    "id": "fall-2026",
    "name": "Tuyển thành viên CLB Công nghệ Mùa Thu 2026",
    "hostClub": "CLB Công nghệ và Sáng tạo",
    "description": "ClubFlow tìm kiếm những thành viên yêu thích công nghệ, sáng tạo nội dung và tổ chức hoạt động cộng đồng. Hãy chọn vị trí phù hợp với thế mạnh của bạn và cùng xây dựng các dự án dành cho sinh viên trong năm học 2026–2027.",
    "instructions": "Chọn vị trí bạn quan tâm, điền thông tin liên hệ, đính kèm CV và viết ngắn gọn lý do muốn tham gia. Bạn có thể nộp đơn cho nhiều vị trí; mỗi đơn được xét riêng. Vui lòng gửi trước ngày 05/11/2026.",
    "status": "Published",
    "opensOn": "2026-10-20",
    "closesOn": "2026-11-05",
    "interviewDate": "2026-11-10",
    "timeZone": "Asia/Ho_Chi_Minh",
    "interviewWindow": {
      "start": "09:00",
      "end": "11:00"
    },
    "durationMinutes": 20,
    "availabilitySlots": [
      {
        "id": "slot-1",
        "start": "09:00",
        "end": "09:20"
      },
      {
        "id": "slot-2",
        "start": "09:20",
        "end": "09:40"
      },
      {
        "id": "slot-3",
        "start": "09:40",
        "end": "10:00"
      },
      {
        "id": "slot-4",
        "start": "10:00",
        "end": "10:20"
      },
      {
        "id": "slot-5",
        "start": "10:20",
        "end": "10:40"
      },
      {
        "id": "slot-6",
        "start": "10:40",
        "end": "11:00"
      }
    ],
    "roomIds": [
      "room-1",
      "room-2",
      "room-3"
    ],
    "departments": [
      {
        "id": "content",
        "name": "Ban Nội dung",
        "positions": [
          {
            "id": "pos-content",
            "title": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
            "quota": 3,
            "description": "Lên ý tưởng và biên tập bài viết, kể câu chuyện về dự án và thành viên trên các kênh truyền thông của CLB.",
            "requirements": "Viết rõ ràng, biết phối hợp nhóm và có thể dành ít nhất 4 giờ mỗi tuần cho hoạt động của ban."
          }
        ]
      },
      {
        "id": "communications",
        "name": "Ban Truyền thông",
        "positions": [
          {
            "id": "pos-communications",
            "title": "Điều phối viên Truyền thông",
            "quota": 2,
            "description": "Lập kế hoạch truyền thông, điều phối lịch đăng và phối hợp đưa tin cho workshop, ngày hội và buổi gặp gỡ.",
            "requirements": "Chủ động, giao tiếp tốt và có thể tham gia đưa tin trực tiếp theo lịch hoạt động của CLB."
          }
        ]
      },
      {
        "id": "design",
        "name": "Ban Thiết kế",
        "positions": [
          {
            "id": "pos-design",
            "title": "Thiết kế Trải nghiệm",
            "quota": 2,
            "description": "Thiết kế ấn phẩm và giao diện đơn giản để truyền tải thông tin hoạt động một cách dễ hiểu.",
            "requirements": "Có sản phẩm mẫu, nắm kiến thức thiết kế cơ bản và sẵn sàng nhận phản hồi để cải thiện."
          }
        ]
      }
    ]
  }
}
```

### Confirm a valid saved Draft

```http
POST /api/executive/campaigns/fall-2026/schedule/confirm HTTP/1.1
Authorization: Bearer {{token:exec}}

```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "schedule": {
    "campaignId": "fall-2026",
    "date": "2026-11-10",
    "window": {
      "start": "09:00",
      "end": "11:00"
    },
    "durationMinutes": 20,
    "status": "Confirmed",
    "confirmedAt": "2026-11-06T09:00:00+07:00",
    "rows": [
      {
        "applicationId": "A01",
        "status": "Proposed",
        "time": {
          "start": "09:00",
          "end": "09:20"
        },
        "interviewerId": "interviewer-1",
        "roomId": "room-1",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Đặng Thu Hà",
        "roomName": "Lab 1"
      },
      {
        "applicationId": "A02",
        "status": "Proposed",
        "time": {
          "start": "09:20",
          "end": "09:40"
        },
        "interviewerId": "interviewer-2",
        "roomId": "room-2",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-communications",
        "positionTitle": "Điều phối viên Truyền thông",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Võ Quốc Khánh",
        "roomName": "Lab 2"
      },
      {
        "applicationId": "A03",
        "status": "Proposed",
        "time": {
          "start": "09:20",
          "end": "09:40"
        },
        "interviewerId": "interviewer-3",
        "roomId": "room-3",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-2",
        "applicantName": "Trần Quang Huy",
        "positionId": "pos-design",
        "positionTitle": "Thiết kế Trải nghiệm",
        "availabilitySlotIds": [
          "slot-2",
          "slot-3"
        ],
        "interviewerName": "Bùi Mai Linh",
        "roomName": "Lab 3"
      },
      {
        "applicationId": "A04",
        "status": "Proposed",
        "time": {
          "start": "10:00",
          "end": "10:20"
        },
        "interviewerId": "interviewer-1",
        "roomId": "room-1",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-3",
        "applicantName": "Lê Hoàng Phúc",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-4",
          "slot-5",
          "slot-6"
        ],
        "interviewerName": "Đặng Thu Hà",
        "roomName": "Lab 1"
      }
    ]
  },
  "summary": {
    "totalApplications": 5,
    "reviewedApplications": 5,
    "shortlistedApplications": 4,
    "proposed": 4,
    "conflict": 0,
    "unassigned": 0,
    "applicationsClosed": true,
    "allApplicationsReviewed": true,
    "canConfirm": false,
    "blockingApplicationIds": []
  }
}
```

### Read the Confirmed snapshot

```http
GET /api/executive/campaigns/fall-2026/schedule HTTP/1.1
Authorization: Bearer {{token:exec}}

```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "schedule": {
    "campaignId": "fall-2026",
    "date": "2026-11-10",
    "window": {
      "start": "09:00",
      "end": "11:00"
    },
    "durationMinutes": 20,
    "status": "Confirmed",
    "confirmedAt": "2026-11-06T09:00:00+07:00",
    "rows": [
      {
        "applicationId": "A01",
        "status": "Proposed",
        "time": {
          "start": "09:00",
          "end": "09:20"
        },
        "interviewerId": "interviewer-1",
        "roomId": "room-1",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Đặng Thu Hà",
        "roomName": "Lab 1"
      },
      {
        "applicationId": "A02",
        "status": "Proposed",
        "time": {
          "start": "09:20",
          "end": "09:40"
        },
        "interviewerId": "interviewer-2",
        "roomId": "room-2",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-1",
        "applicantName": "Nguyễn Thị Minh Anh",
        "positionId": "pos-communications",
        "positionTitle": "Điều phối viên Truyền thông",
        "availabilitySlotIds": [
          "slot-1",
          "slot-2"
        ],
        "interviewerName": "Võ Quốc Khánh",
        "roomName": "Lab 2"
      },
      {
        "applicationId": "A03",
        "status": "Proposed",
        "time": {
          "start": "09:20",
          "end": "09:40"
        },
        "interviewerId": "interviewer-3",
        "roomId": "room-3",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-2",
        "applicantName": "Trần Quang Huy",
        "positionId": "pos-design",
        "positionTitle": "Thiết kế Trải nghiệm",
        "availabilitySlotIds": [
          "slot-2",
          "slot-3"
        ],
        "interviewerName": "Bùi Mai Linh",
        "roomName": "Lab 3"
      },
      {
        "applicationId": "A04",
        "status": "Proposed",
        "time": {
          "start": "10:00",
          "end": "10:20"
        },
        "interviewerId": "interviewer-1",
        "roomId": "room-1",
        "conflictingApplicationIds": [],
        "reason": null,
        "applicantId": "applicant-3",
        "applicantName": "Lê Hoàng Phúc",
        "positionId": "pos-content",
        "positionTitle": "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng",
        "availabilitySlotIds": [
          "slot-4",
          "slot-5",
          "slot-6"
        ],
        "interviewerName": "Đặng Thu Hà",
        "roomName": "Lab 1"
      }
    ]
  },
  "summary": {
    "totalApplications": 5,
    "reviewedApplications": 5,
    "shortlistedApplications": 4,
    "proposed": 4,
    "conflict": 0,
    "unassigned": 0,
    "applicationsClosed": true,
    "allApplicationsReviewed": true,
    "canConfirm": false,
    "blockingApplicationIds": []
  }
}
```

### GET /api/executive/campaigns/:campaignId/schedule/export

CSV is available after confirmation. Its body is omitted in the expected block; column/encoding rules are specified above:

```http
GET /api/executive/campaigns/fall-2026/schedule/export HTTP/1.1
Authorization: Bearer {{token:exec}}

```

```http
HTTP/1.1 200 OK
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="fall-2026-schedule.csv"

```

### Confirmed writes are refused

Generation, manual saves, repeat confirmation and C4 configuration edits all respect the same lock:

```http
POST /api/executive/campaigns/fall-2026/schedule/generate HTTP/1.1
Authorization: Bearer {{token:exec}}

```

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": {
    "code": "CAMPAIGN_LOCKED",
    "message": "The confirmed campaign is read-only.",
    "fieldErrors": {},
    "applicationIds": []
  }
}
```

```http
PUT /api/executive/campaigns/fall-2026/schedule HTTP/1.1
Authorization: Bearer {{token:exec}}
Content-Type: application/json

{
  "rows": [
    {
      "applicationId": "A01",
      "time": {
        "start": "09:00",
        "end": "09:20"
      },
      "interviewerId": "interviewer-1",
      "roomId": "room-1"
    },
    {
      "applicationId": "A02",
      "time": {
        "start": "09:20",
        "end": "09:40"
      },
      "interviewerId": "interviewer-2",
      "roomId": "room-2"
    },
    {
      "applicationId": "A03",
      "time": {
        "start": "09:20",
        "end": "09:40"
      },
      "interviewerId": "interviewer-3",
      "roomId": "room-3"
    },
    {
      "applicationId": "A04",
      "time": {
        "start": "10:00",
        "end": "10:20"
      },
      "interviewerId": "interviewer-1",
      "roomId": "room-1"
    }
  ]
}
```

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": {
    "code": "CAMPAIGN_LOCKED",
    "message": "The confirmed campaign is read-only.",
    "fieldErrors": {},
    "applicationIds": []
  }
}
```

```http
POST /api/executive/campaigns/fall-2026/schedule/confirm HTTP/1.1
Authorization: Bearer {{token:exec}}

```

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": {
    "code": "CAMPAIGN_LOCKED",
    "message": "The confirmed campaign is read-only.",
    "fieldErrors": {},
    "applicationIds": []
  }
}
```

```http
PUT /api/executive/campaigns/fall-2026/interview-setup HTTP/1.1
Authorization: Bearer {{token:exec}}
Content-Type: application/json

{
  "interviewDate": "2026-11-10",
  "interviewWindow": {
    "start": "09:00",
    "end": "11:00"
  },
  "durationMinutes": 20,
  "roomIds": [
    "room-1",
    "room-2",
    "room-3"
  ],
  "interviewers": [
    {
      "id": "interviewer-1",
      "positionIds": [
        "pos-content"
      ],
      "availability": [
        {
          "start": "09:00",
          "end": "10:20"
        }
      ]
    },
    {
      "id": "interviewer-2",
      "positionIds": [
        "pos-communications"
      ],
      "availability": [
        {
          "start": "09:00",
          "end": "11:00"
        }
      ]
    },
    {
      "id": "interviewer-3",
      "positionIds": [
        "pos-design"
      ],
      "availability": [
        {
          "start": "09:00",
          "end": "11:00"
        }
      ]
    }
  ]
}
```

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": {
    "code": "CAMPAIGN_LOCKED",
    "message": "The confirmed campaign is read-only.",
    "fieldErrors": {},
    "applicationIds": []
  }
}
```

### Authentication and missing-campaign errors

A missing token returns 401 even though the campaign is Confirmed:

```http
GET /api/executive/campaigns/fall-2026/schedule HTTP/1.1

```

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Sign in to continue.",
    "fieldErrors": {},
    "applicationIds": []
  }
}
```

An authenticated Executive reading an unknown campaign gets 404:

```http
GET /api/executive/campaigns/missing-campaign/schedule HTTP/1.1
Authorization: Bearer {{token:exec}}

```

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": {
    "code": "CAMPAIGN_NOT_FOUND",
    "message": "Campaign not found.",
    "fieldErrors": {},
    "applicationIds": []
  }
}
```

## Changes

| Date | Change and reason |
| --- | --- |
| 2026-11-27 | Defined C8/C9 reads, complete Draft saves, deterministic generation, CSV export, derived summaries, validation, atomic confirmation gates and cross-resource locks before handlers/UI. Added ordered seed-based refusal/repair/confirmation examples and documented C4 configuration ownership, missing-schedule behavior and scoped confirmed-read dependencies. |
