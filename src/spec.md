# Specification

## Summary
**Goal:** Fix the missing “Our Mission” image on the Home page and provide a clear fallback message if the image fails to load.

**Planned changes:**
- Verify the Mission image file exists at the exact `MISSION_IMAGE_PATH` and is served as a static frontend asset at `/assets/generated/img-20260210-wa0017-uploaded.dim_1536x307.jpg`.
- Update the Home page Mission image element to handle load errors client-side and display an in-page English fallback message instead of a broken image when loading fails.

**User-visible outcome:** The “Our Mission” section image reliably renders on the Home page; if it can’t be loaded, users see a clear fallback message in place of the image.
