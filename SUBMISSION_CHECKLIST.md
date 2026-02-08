# Submission Checklist

Use this to verify the project before submission.

---

## No runtime errors

- [x] **Missing API endpoint**: If `PROPERTY_LISTING_ENDPOINT` is not set, the app returns an error state instead of throwing (no `new URL(undefined)`).
- [x] **PropertyCard**: Handles missing `city`/`state` and empty `types` without rendering "undefined" or accessing invalid indices.
- [x] **formatPrice**: Handles null/undefined (returns `'N/A'`).

**How to verify:** Run the app with and without `.env.local`; use filters and pagination. No console errors or white screen.

---

## Loading & empty states exist

- [x] **Loading**: Skeleton grid (6 cards) while filters/sort/pagination are applied (`isNavigating`).
- [x] **Empty list**: "No properties available" when the API returns no results.
- [x] **Empty search**: "No properties match your search. Try a different name or filters." when search-by-name filters out all results.
- [x] **Error**: Dedicated error UI with icon, message, and "Try again" button.

---

## At least 1 bonus feature

- [x] **Search by name**: Text field "Search by name" filters the current page results by property name (client-side). Value is synced to URL (`?name=...`) and applied when clicking "Apply filters".

(Other bonus ideas from spec: location search, save filters — not required.)

---

## Responsive on mobile

- [x] **Container**: Responsive padding `px: { xs: 2, sm: 3 }`, `py: { xs: 2, sm: 3 }`.
- [x] **Filters**: Stack vertically on small screens (`flexDirection: { xs: "column", sm: "row" }`), full-width inputs on mobile.
- [x] **Typography**: Responsive title font size.
- [x] **Grid**: 1 column on xs, 2 on sm, 3 on md+; spacing scales.
- [x] **Touch**: Pagination and buttons use min height/width for tap targets.

**How to verify:** Resize to ~375px width or use DevTools device mode.

---

## README is clear

- [x] **What the project is**: Property listing frontend (Next.js, MUI, SSR).
- [x] **How to run**: Step 1 Install, Step 2 Set API env, Step 3 `npm run dev`, Step 4 Production build.
- [x] **API config**: Env var name and example `.env.local`; link to API spec.
- [x] **Verify command**: See "Quick verify" below.

---

## Repo builds with `npm install && npm run dev`

- [x] **Install**: No private or invalid packages; `npm install` completes.
- [x] **Dev**: `npm run dev` starts Next.js; app loads at http://localhost:3000. If the API endpoint is not set, the listing page shows the error state (no crash).

**Quick verify (from repo root):**

```bash
npm install && npm run dev
```

Then open http://localhost:3000. The page should load (listing, error, or empty list). No runtime errors in the console.
