# Specification

## Summary
**Goal:** Make it easy to confirm which frontend bundle and backend canister version are currently running, and reduce confusion when the preview or deployed site appears stale.

**Planned changes:**
- Add a backend public query endpoint that returns a human-readable buildVersion and buildTimestamp.
- Embed frontend buildVersion and buildTimestamp at build time as a single source of truth, and display it in a subtle always-visible location (e.g., footer).
- Add an Admin dashboard “Diagnostics” section that shows both frontend and backend build info and indicates whether they match (with a clear warning when they do not).
- Add a user-facing “Refresh preview” action (at least in Admin Diagnostics) that attempts best-effort cache clearing (when available) and then performs a full page reload.

**User-visible outcome:** Admins can view frontend and backend build/version timestamps side-by-side, see whether they match, and use a “Refresh preview” action to help resolve stale preview/deployment mismatches.
