# ClubFlow PA#2 implementation brief

## Prompt to the assistant

Build a responsive, static HTML/CSS prototype for the ClubFlow Executive's main flow in this repository. Create exactly three linked pages:

1. `index.html` — Create Recruitment Campaign.
2. `review.html` — Application Review.
3. `schedule.html` — Interview Scheduling.

The screens follow one club, one recruitment campaign, and one Executive user. Use realistic ClubFlow sample data, including at least one long Vietnamese name or position title that must wrap on a phone. Keep all dates, application IDs, statuses, people, interviewers, rooms, counts, and links consistent across pages. Applicants and interviewers must be distinct people. Make the sample interview date later than the application closing date.

### Screen 1: Create Recruitment Campaign

- Show the campaign name, host club, description, opening and closing dates, and application instructions.
- Show departments and positions with their quotas, job descriptions, and requirements.
- Provide clear Save as Draft, Preview Campaign, and Publish Campaign controls. Show which fields are required and communicate the validation expected before publishing.
- Provide an Applications link to `review.html` for the same campaign after publication. Moving to Screen 2 does not itself create applications or approve any application; the sample applications represent later submissions.

### Screen 2: Application Review

- Use the correct page title. Show submitted applications with applicant, position, submission time, and status, plus application/applicant statistics.
- Provide search and filter controls and show sorting, pagination, and basic CSV export as part of the application-list interface.
- Show an application detail area with CV information, motivation statement, and an internal Executive-only note. Keep the list and the detail area readable at every target width; on a phone, stack them instead of covering the list with a large overlay.
- Provide Shortlist Candidate and Reject controls for the selected application. A decision for one position must not change another application from the same student. Closing a detail view should preserve the list context if such interaction is implemented.
- Provide a relative link to `schedule.html`. Only Shortlisted applications belong in scheduling; Shortlisted does not mean finally accepted or already assigned a confirmed interview.

### Screen 3: Interview Scheduling

- Show the shortlisted applications for the same campaign and the scheduling inputs: interview date, time window, one common slot duration of 15, 20, or 30 minutes, qualified interviewers and their availability, and available rooms.
- Show a draft timetable with applicant/application, position, date, time slot, interviewer, room, and Proposed, Conflict, or Unassigned status. Show a concrete reason for each Unassigned row.
- Include Generate/Regenerate Draft, Edit, Resolve, Assign Slot, Save Changes, Export Timetable, and Approve & Confirm Schedule controls as appropriate to the prototype state. Make it clear that Save Changes does not confirm the schedule.
- A sample conflict must be a real overlap involving an applicant, interviewer, or room; identify affected rows. Counts must equal the displayed rows. Never imply that an Unassigned applicant was rejected.
- Communicate the approval conditions: applications have closed; every application has been reviewed; every Shortlisted application has one valid assignment; no Conflict or Unassigned rows remain. A confirmed schedule is read-only. Confirmation is not a final recruitment result.

### Fix these: defects that must not appear

- Contradictory application and interview dates across screens.
- A Screen 2 header that still says Create Recruitment Campaign or Draft Mode.
- Application details that cover most of the list or make either area unreadable.
- Scheduling totals that do not match the visible rows.
- A conflict warning without a real overlapping assignment.
- The same sample person acting as both applicant and interviewer.
- Claims of university account or attachment verification, including "Verified Student" or "100% verified"; university verification is outside the project scope.
- Template footer text such as "© 2025 ClubFlow", Privacy Policy, Terms of Service, or Support Center.

### Stack, layout, and HTML constraints

- Use plain CSS in a local `styles.css` file. Do not add a dependency, CSS framework, CDN asset, or JavaScript framework. JavaScript may enhance a small interaction only if all essential content remains visible after JavaScript is disabled and the page is reloaded.
- Write content directly in the HTML. Pages must open from the local folder without a build step or network connection.
- Build mobile first. Use fluid layouts, no fixed page or panel widths, and breakpoints at `48rem` and `80rem`. Test at exactly 360, 768, and 1280 CSS pixels. A table may scroll within its own wrapper, but the page itself must not scroll sideways or hide clipped content with `overflow-x: hidden`.
- Use one spacing scale throughout: 4, 8, 12, 16, 24, 32, and 48 px, expressed as CSS custom properties. Use body text at least 16 px; body text and buttons need at least 4.5:1 contrast. Do not use `!important` in our CSS. At 360 px, standalone buttons and links must be at least 44 px tall.
- Use semantic `header`, `nav`, `main`, and `footer` where appropriate. Give each page exactly one `h1` and do not skip heading levels. Every input needs a visible associated `label`; every image needs suitable `alt` text.
- Use real `<a href="relative-file.html">` links for navigation, or a form submit with a relative `action`. Do not use `#`, missing targets, root-relative paths, or an `onclick`-only button for a main-flow transition. Use buttons for actions rather than clickable `div` elements.
- Include `<meta name="viewport" content="width=device-width, initial-scale=1">` on every page. Produce valid HTML with zero errors in the W3C Nu checker.
- Keep the most important action or information visually clear on each page. Explain any control that is shown but not wired to a working prototype interaction in `PROTOTYPE.md`; do not claim persistence or backend behavior that the prototype does not have.

### Definition of done and evidence

- Open each page directly from the folder with JavaScript disabled. Follow every main-flow link and confirm it reaches an existing next page.
- At 360, 768, and 1280 px on all three pages, confirm no overlap, cut-off content, unreadable long item, or page-level horizontal scrolling. In DevTools, `document.documentElement.clientWidth` must equal the selected width and `document.documentElement.scrollWidth > document.documentElement.clientWidth` must be `false`. Inspect elements past the right edge; the result should be `[]` outside a deliberate table scroll wrapper.
- Check heading structure, labels, buttons versus links, and image alternatives in the browser Accessibility pane. Run the W3C Nu checker on each page and save proof of zero errors.
- Save nine full-page screenshots with JavaScript off in `screenshots/`: `<page>-360.png`, `<page>-768.png`, and `<page>-1280.png` for `index`, `review`, and `schedule`. Save the three checker results in `checks/` as `validator-<page>.png` or `.txt`.
- Maintain a root rules file (`AGENTS.md` or another rubric-accepted format), `PROTOTYPE.md`, `AI-LOG.md`, and `SELF_ASSESSMENT_REPORT.md`. These files and this brief must be in English. The page text may be Vietnamese.
- Keep a useful Git history: first commit with the rules file, at least one commit per page, and a separate responsive-pass commit. The final zip must contain the repository's `.git` directory.

## Source documents

- `../ClubFlow-final-project-brief.pdf` — main flow, screen features, scope, and Fix these list.
- `../PA2-rubric-responsive-prototype.pdf` — scoring, technical constraints, required evidence, and submission rules.
- `../SELF_ASSESSMENT_REPORT template.pdf` — evidence-based report format.

## Later prompts and changes

Append each later prompt here verbatim before or when giving it to the assistant. Record the resulting accepted, changed, and rejected work in `AI-LOG.md`.

### Follow-up prompt — scheduling rules and consistent sample state

Use one explicit, consistent sample dataset across all three pages. Treat the pages as successive snapshots of the same campaign: Screen 1 prepares and publishes it; the sample applications on Screen 2 were submitted later; Screen 3 uses only applications marked Shortlisted. Moving between pages must not imply that publishing, submission, screening, or saving happened automatically.

Use these campaign dates throughout: applications open on 2026-10-20, close on 2026-11-05, and interviews take place on 2026-11-10. Every sample submission must fall within the application period. This campaign has one interview date. Keep the campaign name, club, position names, application IDs, people, statuses, and totals identical wherever they reappear.

Use five sample applications from four distinct applicants. A01 and A02 belong to the same student but apply for different positions. A01, A02, A03, and A04 are Shortlisted; A05 is Rejected. All five applications have been reviewed. Screen 2 statistics must therefore show 5 applications, 4 applicants, 4 Shortlisted, and 1 Rejected. A05 must not appear in the Screen 3 timetable. No applicant may also appear as an interviewer.

For the draft timetable, show four rows, one for each Shortlisted application:

- A01 and A02: separate interviews for the same applicant, both on 2026-11-10 from 09:00 to 09:20. Give them different qualified interviewers and different rooms. Mark both rows Conflict and explain that this applicant cannot attend two interviews at the same time.
- A03: one valid assignment, marked Proposed.
- A04: no assignment, marked Unassigned. State a concrete reason, such as no time slot shared by the applicant and a qualified interviewer. Do not present A04 as rejected.

The timetable summary must match its four rows exactly: 1 Proposed, 2 Conflict, and 1 Unassigned. If the team changes the sample data, update every affected row, status, statistic, date, and explanation across all pages.

Explain the scheduling rules near the scheduling controls or draft:

- Each Shortlisted application can receive at most one interview, with one qualified interviewer.
- Every interview in this campaign uses the same selected duration: 15, 20, or 30 minutes.
- A valid assignment requires a slot within the selected time window, availability shared by the applicant and interviewer, and an available room.
- An applicant, interviewer, or room cannot be booked for overlapping interviews. A room hosts only one interview at a time.
- When generating a draft, the intended system behavior is to select the first valid combination of time slot, qualified interviewer, and room in sequence. Do not claim that the static prototype actually calculates this.
- After an edit, the intended system behavior is to check the applicant, interviewer, slot, and room again. Name both affected rows when showing a conflict.

Show why Approve & Confirm Schedule is unavailable in the sample draft: although applications have closed and all five have been reviewed, two rows still conflict and A04 is unassigned. Approval requires every Shortlisted application to have one valid assignment and zero Conflict or Unassigned rows. Save Changes only saves a draft; it does not approve or confirm it. Confirmation is not a final Pass/Fail recruitment decision.

Communicate the confirmed-state rule in a concise note or preview: after confirmation, the campaign configuration, applications, and timetable become read-only; editing and draft regeneration are disabled. Do not show the sample draft as already confirmed.

Keep the prototype honest about interaction. A real relative link must perform each main-flow page transition. For every other displayed control, either implement a small accessible interaction that still leaves essential content visible with JavaScript disabled, or identify it precisely as a visual-only control in `PROTOTYPE.md`. Do not claim that static HTML stores data, validates publication, generates schedules, exports files, or confirms a schedule unless that behavior has actually been implemented and checked.

In `PROTOTYPE.md`, include every team member's full name and student ID; opening instructions and network requirements; a row for each page and its links; the main design choices and reasons; every control not wired yet; and the CSS choice, spacing scale, and breakpoints. In `AI-LOG.md`, record each assistant task as it happens, including the tool, request, what was kept, what was changed, what was rejected, and the check that revealed any error. Update the self-assessment only after the screenshots, validator results, and commits provide evidence for the scores claimed.

### Follow-up prompt — showing Confirmed without confirming the sample draft

English rendering of the team's request: Clarify how Screen 3 should show the Confirmed state while keeping the conflicting draft as its primary sample data.

Keep the page's main header, four-row timetable, status counters, conflict explanation, and approval checklist in **Draft — action required** state. The primary sample remains 1 Proposed, 2 Conflict, and 1 Unassigned. The Approve & Confirm Schedule control is disabled or clearly unavailable, with the exact blockers named: A01/A02 overlap and A04 has no slot. Do not label any of these four draft assignments Confirmed.

Below the main draft, add one compact, visually secondary section titled **After confirmation — state preview**. Label it explicitly as an illustration of the future state, not the current campaign state. It should show a Confirmed badge and explain that, only after all four shortlisted applications have valid non-overlapping assignments and the Executive approves, the campaign settings, application decisions, and timetable become read-only; Edit, Assign Slot, and Regenerate Draft are disabled, while confirmed schedules remain viewable to the relevant applicant and interviewer. Confirmation does not publish final Pass/Fail results.

Do not place another timetable or numerical status counters in this preview. That keeps the only displayed schedule totals tied to the four-row draft and avoids implying that the sample conflicts were silently resolved. If a real interactive Confirmed view is implemented later, it must first resolve A01/A02 and assign A04, recalculate the counters, and block confirmation until all conditions pass; otherwise keep this as a clearly labeled explanatory preview and document the non-working approval control in `PROTOTYPE.md`.

### Follow-up prompt — create the first page

User prompt (verbatim): `tạo index.html`

### Follow-up prompt — create application review

User prompt (verbatim): `tạo review.html`

### Follow-up prompt — create interview scheduling

User prompt (verbatim): `tạo schedule.html`

### Follow-up prompt — resolve review and schedule logic

User prompt (verbatim):

**Logic chưa ổn:**

1. **Nguồn gốc xung đột chưa được giải thích.** Trang lịch nói thuật toán dự kiến chọn tổ hợp hợp lệ đầu tiên, nhưng lịch nháp lại xếp A01 và A02 cùng 09:00–09:20 dù A02 có thể chuyển sang 09:20–09:40. Nếu đây là xung đột do Executive sửa lịch thủ công, cần nói rõ; nếu đây là lịch vừa tự tạo, nó trái quy tắc tạo lịch đã ghi. [schedule.html (line 34)](D:/24127094/WebDev/project/clubflow/schedule.html:34) · [dòng A01–A02 (line 45)](D:/24127094/WebDev/project/clubflow/schedule.html:45)
2. **Trang duyệt chỉ cho xem chi tiết A01.** A02–A05 hiện là các thẻ tĩnh, không có cách chọn để đọc CV hay lời trình bày của từng đơn. Vì thế giao diện chưa thể hiện đầy đủ bước “xét từng đơn”, dù các quyết định và thống kê mẫu vẫn nhất quán. [review.html (line 48)](D:/24127094/WebDev/project/clubflow/review.html:48) · [chi tiết A01 (line 58)](D:/24127094/WebDev/project/clubflow/review.html:58)
3. **Vai trò người phỏng vấn được mô tả chưa đúng.** Trang lịch gọi họ là “thành viên Executive”, trong khi brief nguồn phân biệt **Executive** và **Interviewer** là hai vai trò. Nên mô tả họ là người phỏng vấn được CLB phân công, đủ chuyên môn cho vị trí. [schedule.html (line 38)](D:/24127094/WebDev/project/clubflow/schedule.html:38) D:\24127094\WebDev\project\ClubFlow-final-project-brief.pdf

Ngoài phần logic, ở **360 px** thanh điều hướng của cả ba trang vẫn có một mục vượt mép phải. Toàn trang không cuộn ngang, nhưng phép kiểm tra phần tử vượt mép của rubric vẫn phát hiện mục đó.

### Follow-up prompts — Tạ Đức Dũng's session (Claude Code), in order

These are Dũng's prompts, copied verbatim. The assistant also read `AGENTS.md` and this `brief.md` from the repository and followed them as the specification for `review.html`, `styles.css` and `PROTOTYPE.md`.

1. With a screenshot of the empty GitHub repository page: `setup cho toi`
2. With screenshots of the PA#2 assignment, the full rubric, and the team task table for Dũng (review.html with A01–A05, statistics, search/filter/sort, CV and motivation per application, internal note, Shortlisted/Rejected, link to schedule.html; shared styles.css usable at 360/768/1280 px with no sideways scroll, 44 px targets at 360 px, text and contrast per rubric; PROTOTYPE.md; screenshots/ and checks/; AI-LOG.md; a review.html commit and a separate responsive-pass commit): `/ak:brainstorm brainstorm đề bài này cho tôi`
3. Answers to the assistant's questions (has Nhân committed? which CSS? where is the brief? team? backup copy?): `1) Nhân chưa 2) CSS 3) https://drive.google.com/file/d/1BX2bYAWW2HS9bNyYMbyLW1J0fyvKtA2l/view 4) 2 người, mssv tí điền 5) cứ làm bản mới đi`
4. `dùng chrome mở link đi`
5. `repo mới được bạn kia commit đó, xử lý đi`
