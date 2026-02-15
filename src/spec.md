# Specification

## Summary
**Goal:** Make all key website text sections admin-editable (not hard-coded) and add a simple preview mode so admins can view draft content on public pages before publishing.

**Planned changes:**
- Add backend site-content data models and APIs to store and serve draft vs published content for the editable sections referenced in the admin guide (Home, Mission, Testimonials/Reviews, and About/Contact text blocks).
- Update the frontend pages to fetch and render these sections from backend site-content data (published for public users; draft only when in admin preview mode).
- Extend the Admin Panel with dedicated editing forms for the new editable sections (e.g., Home hero fields, Mission title/body, Reviews heading, Contact intro) with Save actions and success/error toasts.
- Add an Admin Panel Preview workflow that opens pages in a URL-based preview mode (e.g., `preview=1`), includes an easy “Exit preview” control, and prevents draft content from being shown to non-admin users.
- Implement a safe Motoko upgrade path so existing persisted canister data is preserved while introducing new site-content state.

**User-visible outcome:** Admins can edit key page text content from the Admin Panel, save it as draft, and preview how it looks on the live site via an easy preview toggle—while regular visitors continue to see only published content.
