# Team09-HCH (HandCraft Heaven)

Next.js App Router marketplace backed by Postgres/Neon.

## Environment

Set these environment variables in `.env.local` (and in Vercel project settings):

- `DATABASE_URL` (or `POSTGRES_URL`)
- `SELLER_DEMO_PASSWORD`
- `SELLER_SESSION_SECRET` (recommended for production session signing)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Seller login

1. Go to `/login`.
2. Select a seller from the dropdown.
3. Enter the shared demo password from `SELLER_DEMO_PASSWORD`.
4. Submit to access `/dashboard`.

Use the dashboard to create, edit, and delete products owned by the authenticated seller.

## Available scripts

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`
- `npm run seed:reviews`
