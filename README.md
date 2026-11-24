# Weather Intelligence

Responsive Next.js 15 weather intelligence app for location search, planning recommendations, saved-search CRUD, and portable exports.

## Features

- Search by city, postal code, landmark, or GPS coordinates.
- Current conditions, icons, five-day forecast, visibility, wind, humidity, sunrise/sunset, and optional OpenWeather air quality.
- Browser geolocation with accessible error states.
- PostgreSQL persistence through Prisma, with a development-only in-memory fallback.
- Saved-search create, read, update (notes/date range/location fields), and delete with confirmation.
- CSV, JSON, and Markdown exports.
- Google Maps, YouTube travel search, and REST Countries links.
- Responsive keyboard-accessible UI and focused Jest/React Testing Library coverage.

## Architecture

`src/app` contains pages and Next.js route handlers. `src/lib/weather.ts` isolates OpenWeather integration and recommendation logic; `src/lib/saved-search-store.ts` isolates persistence. `prisma/schema.prisma` and the checked-in migration define the `WeatherSearch` model.

## Local setup

1. Copy `.env.sample` to `.env.local`.
2. Set `DATABASE_URL` to PostgreSQL for persistence.
3. Set `OPENWEATHER_API_KEY` for live weather. Without it, a clearly labelled demo response is used.
4. Run `npm install`.
5. Run `npx prisma generate` and `npx prisma migrate deploy`.
6. Start with `npm run dev`.

Useful commands: `npm run build`, `npm test -- --runInBand`, and `npm run prisma:migrate`.

## API routes

- `POST /api/weather` validates a location and returns current/forecast intelligence.
- `GET|POST /api/searches` lists or creates saved records.
- `PUT|DELETE /api/searches/:id` updates or removes a saved record.
- `GET /api/exports?format=csv|json|markdown` downloads saved records.
- `/healthz` and `/readyz` support liveness/readiness checks.

## Environment variables

See `.env.sample`: `DATABASE_URL`, `OPENWEATHER_API_KEY`, and `NEXT_PUBLIC_APP_URL`.

## Deployment

Deploy the Next.js app to Vercel and PostgreSQL to Railway, Supabase, or Render. Configure the environment variables in the hosting provider, run Prisma migrations as a release step, and keep API keys server-side.

## Screenshots

Add production screenshots here after deployment.
