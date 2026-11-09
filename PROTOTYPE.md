# PROTOTYPE.md — ClubFlow PA#2 responsive prototype

## 1. Team

| Full name | Student ID | Owns |
|---|---|---|
| Trịnh Duy Nhân | 24127094 | `index.html`, `schedule.html`, `brief.md` |
| Tạ Đức Dũng | 24127347 | `review.html`, `styles.css`, `PROTOTYPE.md` |

## 2. How to open it

Open `index.html` directly from the folder (double-click it). No build step, server, or network connection is needed: the pages are static HTML with one local stylesheet, `styles.css`, and no framework, CDN file, web font, or JavaScript. All content is visible with JavaScript turned off.

## 3. Screens

| File | ClubFlow screen | What the user does there | Links on the page |
|---|---|---|---|
| `index.html` | Create Recruitment Campaign | The Executive fills in the campaign name, host club, description, application dates, interview date, instructions, and the three positions with quota, job description and requirements, then reviews the pre-publish checklist and a static campaign preview. | "Xem đơn ứng tuyển" → `review.html` (main flow). Skip link → `#main-content`. |
| `review.html` | Application Review | The Executive sees statistics (5 applications, 4 applicants, 4 Shortlisted, 1 Rejected), search/status/position/sort controls, the application list A01–A05, and for each application the CV information, motivation statement, internal Executive-only note, and Shortlist Candidate / Reject controls. | "Xếp lịch cho 4 đơn Shortlisted" and nav "3. Xếp lịch" → `schedule.html` (main flow). Nav "1. Tạo chiến dịch" → `index.html`. "Xem chi tiết A0x" → `#detail-a0x` on the same page. The filter form submits to `review.html`. |
| `schedule.html` | Interview Scheduling | The Executive sees the four Shortlisted applications, scheduling settings (date, time window, 20-minute duration), interviewers and rooms with availability, the draft timetable (1 Proposed, 2 Conflict, 1 Unassigned) with reasons, the approval conditions, and a clearly labelled preview of the future Confirmed state. | Nav "1. Tạo chiến dịch" → `index.html`, "2. Duyệt đơn" → `review.html`. |

All links are relative file links; none uses `#` alone, a root-relative path, or `onclick`.

## 4. Design choices

- **One campaign, three snapshots.** The pages follow one campaign (applications 2026-10-20 to 2026-11-05, interviews 2026-11-10) and the same five applications A01–A05, so every date, ID, person, status and count matches across pages (the brief's *Fix these* list forbids contradictory dates and mismatched totals).
- **Review list and detail side by side, never overlaid.** The *Fix these* list rejects application details that cover most of the list, so there is no modal or overlay. At 1280 px the list (2/5) and detail (3/5) sit side by side; at 360 and 768 px they stack, list first.
- **Native `<details>` for each application's detail.** Every application (not only A01) has its own CV, motivation, note and decision controls. `<details>` opens and closes without JavaScript, and the "Xem chi tiết" links jump to (and open) the matching application.
- **A01 and A02 decided separately.** The same student applied for two positions; each detail states that its decision does not change the other application.
- **Honest controls.** Controls that cannot work in static HTML are disabled or labelled as illustrations on the page itself, and listed below.
- **No verification claims and no template footer.** No "Verified Student" badge, no copyright, Privacy Policy, Terms or Support links (all on the *Fix these* list).
- **Long Vietnamese data.** "Tôn Nữ Hoàng Phương Thảo Nguyên" (A05) and "Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng" wrap at 360 px instead of widening the page.

## 5. Not wired yet

| Page | Control | Current behaviour |
|---|---|---|
| `index.html` | Lưu bản nháp, Công bố chiến dịch | Disabled; nothing is saved, validated or published. |
| `index.html` | Form fields | Editable but not stored; the form submits nowhere outside `index.html`. |
| `review.html` | Search box, Trạng thái, Vị trí, Sắp xếp, Áp dụng | Áp dụng reloads `review.html`; the list is not filtered or sorted. |
| `review.html` | Xuất CSV, Trang trước, Trang sau | Disabled; no export or pagination (all five applications fit on one page). |
| `review.html` | Shortlist Candidate, Reject, internal note | Buttons disabled; notes are editable but not saved. Decisions shown are sample data. |
| `schedule.html` | Date, time window and duration fields; Tạo lại lịch nháp | Disabled; no schedule is generated. |
| `schedule.html` | Giải quyết, Chỉnh sửa, Gán khung giờ, Xuất lịch | Disabled; the draft timetable does not change. |
| `schedule.html` | Lưu thay đổi bản nháp, Phê duyệt & xác nhận lịch | Disabled; approval is blocked in the sample by the A01/A02 conflict and the unassigned A04. |

## 6. CSS

- **Framework:** none — plain CSS in one file, `styles.css`.
- **Spacing scale:** `--space-1` … `--space-7` = 4, 8, 12, 16, 24, 32, 48 px (0.25–3 rem). Margins, paddings and gaps use only these tokens.
- **Type:** body and buttons 16 px (`--text-base`); headings use `--text-lg`, `--text-xl`, `--text-2xl`, `--text-3xl`. No text is smaller than 16 px.
- **Colour:** tokens on `:root` (`--color-*`); body text `#1b2333` and muted text `#4a5568` on white or `#f4f6fb`, primary button white on `#3341b8` — all above 4.5:1.
- **Tap targets:** `--tap: 2.75rem` (44 px) minimum height for buttons, nav links, form controls and `<summary>`.
- **Breakpoints (mobile first):** base styles for 360 px; `@media (min-width: 48rem)` (768 px) adds two-column forms, cards and a four-column stats row; `@media (min-width: 80rem)` (1280 px) adds the campaign side column, side-by-side review list and detail, and a four-column scheduling form.
- **Overflow:** no fixed widths and no `overflow-x: hidden`; only the scheduling table scrolls, inside its own `.table-wrap`. No `!important`.
