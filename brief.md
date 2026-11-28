# ClubFlow PA#3 implementation brief

## Prompts already sent

These prompts are recorded verbatim in order. Append each implementation prompt here when it is actually sent. Record what changed and how it was checked in `AI-LOG.md`.

### 2026-11-25 · Tạ Đức Dũng · Task planning

> bạn tôi vừa push requirements đồ án lên, chia task thử cho tôi đi

> tạo một branch mới, đẩy plan này lên cho tôi đi

### 2026-11-26 · Trịnh Duy Nhân · Shared foundation and documentation

> phân tích, liệt kê nhiệm vụ của Nhân trong PA3-PLAN.md và những phần cần thực hiện, những phần có liên quan đến phần cũng Dũng

> cập nhật AGENTS.md, chuẩn bị dữ liêu và API README, không commit

> cập nhật readme và các tài liệu liên quan

> cập nhật brief thành brief cho PA3

> commit phần tài liệu và nêu chi tiết hơn những phần cần thống nhất: đã có những đề xuất gì, những điểm mơ hồ

### 2026-11-27 · Trịnh Duy Nhân · Shared API decisions

> sửa theo đề xuất

> cập nhật 2 nội dung này

> gộp các AI-LOG vào các nhóm cho phù hợp

> gộp các AI-LOG mới cập nhật 2 ngày gần đây vào các nhóm cho phù hợp

### 2026-11-27 · Trịnh Duy Nhân · Seed validation and organization

> kiểm tra và chỉnh sửa dữ liệu mẫu đã đúng contract chưa

> PLEASE IMPLEMENT THIS PLAN:
> ### Hoàn thiện dữ liệu mẫu theo quy ước hiện có
>
> **Thay đổi**
>
> - Chuyển nội dung seed sang `mock/data/seed.mjs`; giữ `mock/data.mjs` làm entry point re-export `createSeedData()` để giữ đường import đã được tài liệu hóa.
> - Giữ nguyên dữ liệu nghiệp vụ và lịch Draft hiện tại; không tự sửa các conflict hoặc mở rộng availability của interviewer trong seed.
> - Cập nhật API README để phân biệt dữ liệu lưu nội bộ với response API. Ghi thay đổi vị trí fixture trong `## Changes`.
> - Ghi prompt và kết quả kiểm tra thực tế vào `brief.md`, `AI-LOG.md`.
>
> **Kiểm tra**
>
> - Chạy lại kiểm tra ID duy nhất, tham chiếu, alias, ngày nộp, trạng thái, qualification, availability và thời lượng.
> - Xác nhận blocker ban đầu vẫn là A01, A02, A04; hai lần tạo seed không chia sẻ dữ liệu mutable.
> - Kiểm tra đường import cũ hoạt động và `git diff --check` đạt.
>
> **Giới hạn và mặc định**
>
> - Chỉ chỉnh tổ chức fixture; chưa thêm trường response, token, PDF hay handler khi chưa có contract tương ứng.
> - Chưa xác nhận API end-to-end hoặc phân quyền bằng kiểm tra seed.
> - Không commit hoặc push.

### 2026-11-27 · Trịnh Duy Nhân · C1/C3/C4 resource contracts

> tạo contract C1, C3, C4

Planning choices: allow a separate Draft alongside the existing Published campaign; allow constrained Published edits before schedule confirmation. The approved plan defines two resource documents, seed-preserving checker examples and documentation-only changes.

> Please implement the plan.

### 2026-11-27 · API contract review

> kiểm tra các contract api đánh giá mức độ phù hợp với yêu cầu project và tài liệu PA3

### 2026-11-28 · Campaign publication and room selection

> cập nhật 2 phương án 1

## Handoff for future implementation prompts

This section is the prepared handoff. The prompts above record work already requested. For each new task, name the feature, allowed files and expected checks, and refer to this handoff.

### Project and ownership

Build the ClubFlow PA#3 main flow from the visitor viewing a published campaign to the applicant seeing a published result. Use the Classroom PA#3 rubric, `REQUIREMENTS.md`, `AGENTS.md` and the API contract in `docs/api/`. Reuse the PA#2 pages as design and sample-data references.

Use React with Vite in `client/`, React Router, bundled plain CSS and accessible native form controls with React state. Ask before adding any other dependency. Nhân owns C1, C3, C4, C8 and C9. Dũng owns C2, C5–C7, C10 and C11, the shared frontend and the mock runner. Coordinate shared contracts and cross-feature data with the other owner before wiring the screens.

### Main flow

| Step | Role | What must work |
| --- | --- | --- |
| C1 | Visitor | Show the published campaign, instructions, dates, departments, positions, quotas, descriptions and requirements. Apply takes a signed-out visitor to sign-in. |
| C2 | All roles | Sign in with a demo account and land on the corresponding home. Redirect signed-out users from protected routes and return them to their requested route after sign-in. Clear the session on sign-out. Show a not-found screen for unknown routes. |
| C3 | Executive | Create a campaign with editable department and position rows. Save a draft, preview and publish. Show field messages for invalid data and preserve the draft. |
| C4 | Executive | Assign qualified interviewers to positions, enter availability, select rooms and set one interview duration of 15, 20 or 30 minutes. |
| C5 | Applicant | Submit an application with student details, a PDF CV up to 5 MB, a statement up to 300 words and availability from club slots. Reopen the existing application for the same position. A second position creates a separate application. A closed campaign refuses submission and preserves input. |
| C6 | Applicant | Show only the signed-in applicant's applications, each with its own screening status. Show time and room after confirmation, and Pass or Fail after publication. |
| C7 | Executive | Review applications with computed statistics, search, filter, sort, pagination and CSV export. Show CV, statement and an Executive-only note in a detail panel alongside the list. Keep list filters when closing the panel. Shortlist or reject only the selected application. |
| C8 | Executive | Generate and edit the draft schedule. Show Proposed, Conflict with the affected applications, or Unassigned with a reason. Support Edit, Resolve, Assign Slot, Save Changes and export. Recheck qualification, availability and overlaps after each edit. |
| C9 | Executive | Confirm only after applications close, all applications are reviewed and every shortlisted application has one valid interview. Identify blocking applications. Keep campaign configuration, screening and schedule read-only after confirmation. |
| C10 | Interviewer | Show only assigned confirmed interviews and their CVs. Allow one assessment per interview. |
| C11 | Executive and Applicant | Record and publish Pass or Fail per application. Show the result and an in-app notification to the application owner. |

Use one timeline everywhere: applications 2026-10-20 through 2026-11-05 and interviews on 2026-11-10. A01/A02 belong to the same student and different positions. Keep their decisions independent. Use separate people for applicants and interviewers. The PA#2 draft illustrates a real A01/A02 overlap, A03 Proposed and A04 Unassigned. Fix the blockers before showing a confirmed schedule. Derive counts from API data. Keep the list and review panel readable at every width, omit verification claims and omit template footers.

### Contract and integration

- Use the resource contracts in `docs/api/` as the source for methods, paths, fields, roles and responses. The proposed table in the API README is a route index. Wait for the resource contract before implementing a consumer. If a needed endpoint or response is missing, stop that part and report what is missing.
- During frontend tasks, leave `docs/api/` and `mock/` untouched. Handle contract and mock authoring as explicitly scoped tasks. Keep the order contract, mock, then UI in Git and record later API changes under `## Changes`. Commit and push only when asked.
- Call only relative `/api` paths through the shared client. Send the Bearer token on protected calls. Proxy `/api` to the mock in Vite development and preview. Keep business records in the API. Render loading, error with Retry, empty and success on each data screen. Retry works without a reload after switching the mock back to normal.
- Validate forms before sending. Show API `400` field errors beside the matching controls, including dynamic rows, with accessible associations. Preserve valid input on refusal and prevent duplicate submissions while busy.

### Review and evidence

1. Walk C1–C11 using the Executive, Applicant and Interviewer demo accounts and the public visitor entry. Check independent decisions for A01/A02, refusal before schedule confirmation, read-only state afterward and private data boundaries.
2. Start the mock in `normal`, `slow`, `error` and `empty` via `MOCK_MODE`. Check loading, visible errors, Retry after restart, empty list messages and zero counts. Use the request log to check repeated requests and compare the frontend's request paths with the contract.
3. Open and reload every browser route listed in `FRONTEND.md` directly on the production preview. Check 360, 768 and 1280 px with no page overflow or clipping. Check long Vietnamese names, 44 px standalone controls at 360 px, visible keyboard focus, meaningful landmarks, one logical `h1`, ordered headings, labelled inputs and links versus buttons. Validate the rendered HTML of the main screens in the W3C checker.
4. Run the Classroom contract checker against a fresh normal-mode mock. Build a fresh `client/dist/` and check the preview with external network access off. Record actual results and remaining gaps in `AI-LOG.md`, `FRONTEND.md` and `SELF_ASSESSMENT_REPORT.md`.
