# Sarvagya website enhancement plan

## What will be added

1. **Google Calendar and Meet booking automation**
   - Create a calendar event immediately after a consultation slot is booked.
   - Add the visitor as an attendee and generate a Google Meet link.
   - Include the meeting details in the visitor and owner emails.
   - Keep the booking successful even if Google Calendar is temporarily unavailable.
   - Save the calendar event reference and Meet link with the booking for staff visibility.

2. **A separate Finance Tools area**
   - Add a dedicated `/tools` page, separate from the homepage.
   - Include five working tools: GST calculator, break-even calculator, working-capital calculator, receivables health check, and bookkeeping-readiness checklist.
   - Show clear results, short interpretations, sensible validation, reset controls, and consultation links.
   - Add Finance Tools to site navigation and the footer.

3. **Illustrative case studies**
   - Add a dedicated case-studies page using realistic example situations and Sarvagya’s approach.
   - Mark every example prominently as illustrative, not a real client engagement or claimed result.
   - Avoid invented client names, testimonials, statistics, or guarantees.

4. **Visual upgrades**
   - Strengthen the existing homepage financial dashboard with scroll-triggered chart, status, and metric reveals while respecting reduced-motion settings.
   - Add a visual process diagram showing the journey from messy records to clear monthly reporting.
   - Give each service category a distinctive finance-relevant symbol and visual treatment.
   - Retain the approved “Professional Corporate Polish” logo treatment already applied to the header and footer.

## Technical details

- Calendar requests will run only on the server through the connected Google Calendar account.
- A small database update will store the calendar event ID and Meet link; existing booking records remain unchanged.
- Tools will calculate locally in the browser and will not store financial inputs.
- New pages will receive complete page titles, descriptions, social metadata, canonical links, semantic headings, and mobile layouts.
- Existing design tokens and UI controls will be reused; no new visual system will be introduced.

## Verification

- Test one complete booking flow and confirm Calendar event creation, Meet link generation, saved booking details, and emails.
- Test every calculator and checklist with empty, normal, and edge-case values.
- Check desktop and mobile layouts, navigation, animation behavior, accessibility labels, console errors, and the final build.
