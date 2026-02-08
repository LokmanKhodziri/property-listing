# Property Listing

Next.js (Page Router) frontend for property search: listing with filters, sort, and pagination. Uses MUI and SSR.

## How to run

**Quick verify:** From the repo root, run `npm install && npm run dev`, then open [http://localhost:3000](http://localhost:3000). (Without an API endpoint the page will show an error or empty list but should not crash.)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the property API (required)**

   The app fetches listings from an external API. Set one of these environment variables to the API base URL (e.g. from the [API spec](https://documenter.getpostman.com/view/28364478/2sB34bKNgU)):

   - `PROPERTY_LISTING_ENDPOINT` (server-side), or  
   - `NEXT_PUBLIC_PROPERTY_LISTING_ENDPOINT` (if you need it in the browser)

   Example: create a `.env.local` in the project root:

   ```bash
   PROPERTY_LISTING_ENDPOINT=https://your-api-base-url.com/listings
   ```

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The property listing page loads data from the API. Without a valid endpoint, the page may show an error or empty list.

4. **Production build**

   ```bash
   npm run build
   npm start
   ```

## Getting Started (development)

Run the development server (after setting the API endpoint above):

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
# property-listing
