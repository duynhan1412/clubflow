# Interview setup — C4

Owner: Trịnh Duy Nhân. Status: initial resource contract; handlers and UI are not implemented. Executive only. JSON requests/responses. Path campaignId is a non-empty ID of a Draft or Published campaign. No query parameters are supported; unknown ones return 400 VALIDATION_FAILED with query.<name> field paths.

## Response schema

Both endpoints return `{ interviewSetup: InterviewSetup }`. All listed properties are present. This is an Executive configuration response, never a public campaign response.

| InterviewSetup field | Type and meaning |
| --- | --- |
| campaignId | Non-empty campaign ID. |
| interviewDate | YYYY-MM-DD or null before configuration. |
| interviewWindow | { start: HH:mm, end: HH:mm } or null before configuration. |
| durationMinutes | 15, 20 or 30; default 20. |
| roomIds | Selected existing room IDs, string[]. |
| interviewers | All existing interviewers, ordered by ID: { id, name, positionIds: string[], availability: { start, end }[] }. Assignments and availability are campaign-scoped. Omitted interviewers in a PUT have empty assignments and availability. |
| rooms | Read-only existing-room catalogue ordered by ID: { id, name, availability: { start, end }[] }. |
| positions | Read-only campaign position catalogue ordered by department/position array order: { id, title }[]. |

Never include account credentials, applicant records, screening notes, draft schedule assignments or results. Names come from the catalogue, not from PUT. Return all catalogue records even when no room/interviewer is selected; in empty mock mode every array is recursively emptied.

## PUT request fields

PUT replaces the complete campaign setup atomically. All five properties below are required; unknown properties, nulls and incomplete objects return 400. GET has no body. GET remains available after confirmation.

| Field | Type and validation |
| --- | --- |
| interviewDate | Real YYYY-MM-DD; after closesOn when closesOn is set. |
| interviewWindow | Exactly { start: HH:mm, end: HH:mm }; local same-day times, start < end, window length >= durationMinutes. |
| durationMinutes | Integer enum 15, 20, 30. |
| roomIds | Array of unique existing room IDs; [] is allowed. |
| interviewers | Array of unique existing interviewer entries with exactly { id, positionIds, availability }. May be []. |

Each interviewer positionIds is an array of unique IDs from this campaign. Each availability is an array of { start, end }; start < end, ranges lie within interviewWindow, duplicate/overlapping ranges for one interviewer are invalid. Adjacent ranges are allowed and merged when checking appointment coverage. Empty positionIds/availability are allowed for incomplete setup. Availability length need not be a multiple of duration. Selected rooms need not cover the entire window; scheduling must check their catalogue availability for each assignment. PUT cannot create/remove catalogue people or rooms, edit names, or create positions.

Times use 24-hour HH:mm with hours 00–23 and minutes 00–59. Dates/times are interpreted in Asia/Ho_Chi_Minh. No overnight window is supported. Blank IDs and unknown references produce 400 VALIDATION_FAILED with zero-based field paths such as interviewers.0.positionIds.0 or roomIds.0.

When the campaign has no applications, generate availabilitySlots from the configured window in duration-sized consecutive ranges (slot-1, slot-2, ...), omitting a trailing interval shorter than the duration. Their IDs are unique within the campaign. When applications exist, preserve all existing slot IDs and time ranges even if duration/window changes; these are saved applicant input windows, not appointment IDs. Changing interviewDate after applications exist returns 409 REFERENCED_DATA_LOCKED with affected applicationIds because saved availability refers to that date.

A Published campaign must remain valid under the C3 publication rules after setup edits. Changes are allowed only before schedule confirmation. PUT stores configuration and, if a Draft schedule exists, synchronizes its date/window/duration and rechecks all existing rows using the new configuration. Do not silently move/delete assigned rows, generate a replacement schedule, or confirm it. Invalid rows become Conflict or remain Unassigned with concrete reasons under C8; return those rows through the schedule endpoint, not in this response. Preserve applicant availability selections. Save Changes remains a draft operation.

## Errors and mock modes

| Status | Code | Applies to / condition |
| --- | --- | --- |
| 400 | VALIDATION_FAILED | GET/PUT unknown query; PUT malformed JSON, invalid fields, types or references. |
| 401 | UNAUTHENTICATED | GET/PUT missing or invalid token. |
| 403 | FORBIDDEN | GET/PUT authenticated non-Executive. |
| 404 | CAMPAIGN_NOT_FOUND | GET/PUT unknown campaign after role checks. |
| 409 | CAMPAIGN_LOCKED | PUT campaign schedule already Confirmed. |
| 409 | REFERENCED_DATA_LOCKED | PUT attempts to change interview date with applications. |
| 500 | MOCK_UNAVAILABLE | GET/PUT simulated error mode. |

Use the README error envelope with fieldErrors and applicationIds always present; empty collections when not applicable. Invalid JSON has empty fieldErrors. Auth/role checks precede resource lookup; confirmation lock precedes PUT validation. Every refusal leaves configuration and schedule unchanged. Normal/slow schemas are identical (about 150 ms / 2 s); error mode returns 500 and writes nothing; empty mode recursively empties response arrays and has no count fields. The runner applies simulated failure before route checks.

## Executable examples

Run after 01-session.md and 02-campaigns.md on the same fresh normal-mode mock. Alias exec must already be signed in and contract-draft must exist. C2's contract, runner and official checker execution are pending. These exchanges preserve the seed setup and A01/A02/A04 blockers. Setup of the isolated Draft enables a valid second-campaign publication refusal without replacing the seed.

### GET /api/executive/campaigns/:campaignId/interview-setup

Returns 200 with the current setup and catalogues. Applicable errors: 400, 401, 403, 404, 500.

```http
GET /api/executive/campaigns/fall-2026/interview-setup HTTP/1.1
Authorization: Bearer {{token:exec}}

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
            "end": "10:00"
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

### PUT /api/executive/campaigns/:campaignId/interview-setup

Returns 200 with the saved setup and catalogues. The seed example is a configuration no-op. Applicable errors: 400, 401, 403, 404, 409 CAMPAIGN_LOCKED / REFERENCED_DATA_LOCKED, 500.

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
          "end": "10:00"
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
            "end": "10:00"
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

Invalid duration refuses the whole write:

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
  "durationMinutes": 25,
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
          "end": "10:00"
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
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Check the highlighted fields.",
    "fieldErrors": {
      "durationMinutes": "Choose 15, 20 or 30 minutes."
    },
    "applicationIds": []
  }
}
```

Set only the isolated Draft's setup; empty selections are allowed:

```http
PUT /api/executive/campaigns/contract-draft/interview-setup HTTP/1.1
Authorization: Bearer {{token:exec}}
Content-Type: application/json

{
  "interviewDate": "2026-11-10",
  "interviewWindow": {
    "start": "09:00",
    "end": "11:00"
  },
  "durationMinutes": 20,
  "roomIds": [],
  "interviewers": []
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "interviewSetup": {
    "campaignId": "contract-draft",
    "interviewDate": "2026-11-10",
    "interviewWindow": {
      "start": "09:00",
      "end": "11:00"
    },
    "durationMinutes": 20,
    "roomIds": [],
    "interviewers": [
      {
        "id": "interviewer-1",
        "name": "Đặng Thu Hà",
        "positionIds": [],
        "availability": []
      },
      {
        "id": "interviewer-2",
        "name": "Võ Quốc Khánh",
        "positionIds": [],
        "availability": []
      },
      {
        "id": "interviewer-3",
        "name": "Bùi Mai Linh",
        "positionIds": [],
        "availability": []
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
        "id": "contract-writer",
        "title": "Writer"
      }
    ]
  }
}
```

### Cross-resource publication refusal

The Draft now meets C3 field requirements, but fall-2026 remains Published. The refusal changes neither campaign:

```http
POST /api/executive/campaigns/contract-draft/publish HTTP/1.1
Authorization: Bearer {{token:exec}}

```

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": {
    "code": "ACTIVE_CAMPAIGN_EXISTS",
    "message": "Another campaign is already Published.",
    "fieldErrors": {},
    "applicationIds": []
  }
}
```

## Changes

| Date | Change and reason |
| --- | --- |
| 2026-11-27 | Defined Executive setup read/full replacement, catalogues, validation, campaign-scoped assignments, stable applicant availability after submissions, Draft rechecks and confirmed locks before implementation. Added ordered examples preserving the seed's draft blockers. |
