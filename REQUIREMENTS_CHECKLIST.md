# Requirements Compliance Checklist

Reference: Frontend submission guidelines (Next.js, Property Search, API integration).

---

## Frontend – Next.js

| Requirement | Status | Notes |
|-------------|--------|--------|
| Next.js with **Page Router** | ✅ Met | Uses `src/pages/` (no `app/`). `index.tsx`, `_app.tsx`, `_document.tsx`. |
| Component library / styling | ✅ Met | **MUI** (Material-UI) + Emotion. Theme in `src/theme/theme.tsx`. |
| Rendering technique fit for page | ✅ Met | **SSR** via `getServerSideProps` for listing (fresh data, SEO, shareable URLs). |

---

## Frontend Pages

| Requirement | Status | Notes |
|-------------|--------|--------|
| **Property Search Page** – main listing with filters | ✅ Met | Single main page: filters, sort, listing grid, pagination. |

---

## Core Features

### Search & Filtering

| Requirement | Status | Notes |
|-------------|--------|--------|
| **Sort – Default (earliest created date)** | ✅ Met | Default sort is `createdAt` (earliest created). |
| **Sort – Price (low to high, high to low)** | ✅ Met | Options: Price (low→high), Price (high→low). |
| **Sort – Optional: by date** | ✅ Met | Newest first / Oldest first. |
| **Filter – Price** | ✅ Met | Min price + Max price. |
| **Filter – Multiple Property Type** | ✅ Met | Multiple property types via checkboxes; sent as `categories` array to API. |

### Property Display

| Requirement | Status | Notes |
|-------------|--------|--------|
| **Property cards – key information** | ✅ Met | Name, price, city/state, type/category, image. |
| **Pagination or Infinite Scroll** | ✅ Met | Prev/Next pagination with page indicator. |
| **Responsive design** | ✅ Met | Responsive container, filters, grid, touch-friendly controls. |

---

## API Integration

| Requirement | Status | Notes |
|-------------|--------|--------|
| Fetch property data from provided API | ✅ Met | `getServerSideProps` calls env-configured endpoint (POST + query params). |
| Handle loading states | ✅ Met | Skeleton grid during navigation; loading state when filters/sort/page change. |
| Error handling for API failures | ✅ Met | `error` prop from SSR; `ErrorMessage` + “Try again” retry. |

---

## API Specifications

| Requirement | Status | Notes |
|-------------|--------|--------|
| Follow Postman API spec | ⚠️ Verify | Use [API doc](https://documenter.getpostman.com/view/28364478/2sB34bKNgU) to confirm query/body params (page, sort, filters, categories/types). |

---

## Bonus Features

| Feature | Status | Notes |
|---------|--------|--------|
| Advanced Search – Locations (City or State) | ❌ Not implemented | Filter by selected state/city. |
| Search properties by name | ❌ Not implemented | Text search by property name. |
| Save Filters/Searches | ❌ Not implemented | Save current filters and access past saves. |

---

## Submission Guidelines – Deliverables

| Deliverable | Status | Notes |
|-------------|--------|--------|
| Source code – GitHub repo | ✅ Repo | Frontend app in repo. |
| Documented steps to run | ✅ Met | README: install, set `PROPERTY_LISTING_ENDPOINT`, run dev/build/start. `.env.example` included. |

---

## Summary

- **Met:** Page Router, MUI, SSR, Property Search page, default sort (earliest created), price + date sort, price filter, **multiple** property type filter, property cards, pagination, responsive, API fetch, loading, error handling, README + `.env.example`.
- **Optional (bonus):** Location search (city/state), search by name, save filters/searches.
