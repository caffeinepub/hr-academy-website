# Specification

## Summary
**Goal:** Use the uploaded photo “HR Academy 1-2.jpeg” exactly as-is in the Home page “Our Mission” section.

**Planned changes:**
- Copy the uploaded file “HR Academy 1-2.jpeg” into `frontend/public/assets/generated/` as a static asset without any processing or modification.
- Update the Home page “Our Mission” section on `/` to render the image via a direct `<img src="/assets/generated/...">` reference.
- Remove/avoid any CSS or UI styling on that image that visually alters it (no cropping, clipping/rounded corners, overlays, opacity changes, filters), while keeping it responsive without changing aspect ratio.

**User-visible outcome:** The Home page “Our Mission” section displays the exact uploaded rectangular photo with no visual alterations, while still scaling responsively.
