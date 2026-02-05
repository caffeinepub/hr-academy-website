# Specification

## Summary
**Goal:** Adjust homepage hero branding text, remove Courses-related CTAs/links from public navigation, and make submitted reviews publicly visible with admin deletion moderation (no email-related changes).

**Planned changes:**
- Update the Home page hero title so “HR” stays in the current white styling while only “ACADEMY” renders in the existing red theme color.
- Remove public UI entries labeled “Explore Courses” and “Our Courses” (including the Home hero CTA button and the Footer Quick Links entry).
- Remove the “Courses” item from the Header navigation on both desktop and mobile menus.
- In the Footer, remove the standalone “ACADEMY” text near the logo while keeping the logo image unchanged.
- Add a public Home page reviews list that shows submitted reviews (name or “Anonymous”, rating, content) and updates immediately after a successful submission without a page refresh.
- Add an admin-only backend API to delete submitted reviews by ID, and add delete controls in the Admin Reviews tab so deletions remove reviews from both admin and public lists.

**User-visible outcome:** The Home hero shows “HR ACADEMY” with only “ACADEMY” in red, Courses links/CTAs are no longer visible in header/footer/hero, visitors can submit reviews and see them appear immediately on the Home page, and admins can delete any submitted review so it disappears everywhere.
