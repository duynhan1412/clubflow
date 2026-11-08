# ClubFlow project rules

## Project

Build the three-page ClubFlow PA#2 prototype in this order: `index.html` (Create Recruitment Campaign) -> `review.html` (Application Review) -> `schedule.html` (Interview Scheduling). Follow the requirements and sample-data constraints in `brief.md`. This repository uses static HTML and CSS.

## Stack and ownership

- Use plain HTML and a local `styles.css` file. Pages must open from the folder without a build step or network connection.
- Do not add dependencies, a CSS framework, a CDN, or a JavaScript framework. Small JavaScript enhancements are allowed only when all essential content remains visible with JavaScript disabled.
- Trịnh Duy Nhân owns `index.html`, `schedule.html`, and `brief.md`.
- Tạ Đức Dũng owns `review.html`, `styles.css`, and `PROTOTYPE.md`.
- Coordinate before editing a file owned by the other person. Both members review shared data, links, evidence, and final documentation.

## Shared sample data and scheduling

- Use the single campaign dataset specified in `brief.md`: applications open on 2026-10-20, close on 2026-11-05, and interviews take place on 2026-11-10. Keep all submissions within the application period. The campaign has one interview date.
- Keep IDs, positions, people, application statuses, dates, rooms, and statistics consistent across pages. A01 and A02 are separate applications by one student for different positions; decisions remain application-specific. Applicants and interviewers must be distinct people.
- Show five reviewed applications from four applicants: A01–A04 Shortlisted and A05 Rejected. Only the four Shortlisted applications appear in scheduling. In the sample draft, A01 and A02 conflict because their shared applicant has overlapping interviews; A03 is Proposed; A04 is Unassigned with a concrete reason. The timetable totals are 1 Proposed, 2 Conflict, and 1 Unassigned.
- A valid interview requires one qualified interviewer, shared applicant/interviewer availability, a free room, and the campaign's common 15-, 20-, or 30-minute duration. No applicant, interviewer, or room may have overlapping interviews. The intended generation rule is the first valid time-slot/interviewer/room combination in sequence; static HTML must not claim to run that algorithm.
- Approval requires closed applications, every application reviewed, exactly one valid assignment for each Shortlisted application, and no Conflict or Unassigned rows. Save Changes is draft-only. After confirmation, the campaign configuration, applications, and schedule are read-only; confirmation is not the final recruitment result.

## Never

- Never use broken links, `href="#"`, root-relative page links, or `onclick`-only navigation for the main flow.
- Never hide essential content when JavaScript is disabled.
- Never use fixed page or panel widths, or `overflow-x: hidden` to conceal a broken layout.
- Never use `!important` in project CSS.
- Never claim backend persistence, university account verification, or other behavior that the prototype does not provide.
- Never commit or push unless the person requesting the work explicitly asks.

## HTML and design

- Use semantic `header`, `nav`, `main`, and `footer` where appropriate.
- Use one `h1` per page, ordered heading levels, visible associated labels for inputs, and suitable `alt` text for images.
- Use links for navigation and buttons for actions.
- Build mobile first with fluid layouts and breakpoints at `48rem` and `80rem`.
- Use the spacing scale 4, 8, 12, 16, 24, 32, and 48 px through CSS custom properties.
- Body text must be at least 16 px; body text and buttons must meet 4.5:1 contrast.
- Standalone buttons and links must be at least 44 px tall at 360 px.
- Include the viewport meta element on every page and keep every page valid in the W3C Nu checker.

## Definition of done

- Open all three pages directly from the folder with JavaScript disabled and follow every main-flow link.
- Check each page at 360, 768, and 1280 px with no page-level horizontal scroll, clipped content, or overlap. Test a long name or title at 360 px.
- Check every item in the ClubFlow brief's Fix these list against the finished pages.
- Run the W3C Nu checker: zero errors on every page. Inspect headings, labels, and controls in the browser Accessibility pane.
- Save nine full-page screenshots in `screenshots/` and three validator results in `checks/`.
- Keep `brief.md` as the actual prompts given to the assistant, in order. Record assistant work and checks in `AI-LOG.md` as the work happens.
- In `PROTOTYPE.md`, include team names and student IDs, opening instructions, a screen/link table, design choices, controls not wired yet, and the CSS spacing scale and breakpoints. Name every visual-only control rather than implying that it works.
- Keep `brief.md`, `AI-LOG.md`, `PROTOTYPE.md`, and `SELF_ASSESSMENT_REPORT.md` in English. Log each assistant task with its tool, request, kept work, changes, rejections, and checks while the work happens.
- Complete `SELF_ASSESSMENT_REPORT.md` with one evidence-backed score for each of the seven rubric criteria, a matching total, and an honest section on unfinished work. Replace its provisional scores and add student IDs before submission.
- When commits are explicitly authorized, make the first commit include this rules file, then record at least one commit per page and a separate responsive-pass commit. Include `.git` in the final ZIP; use the final self-assessment total in its filename.
