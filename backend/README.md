# UAE Number Plate Marketplace Backend

Production-style backend API for a premium UAE car number plate marketplace.

## Stack
- Node.js + TypeScript
- Express.js
- PostgreSQL + Prisma ORM
- Redis caching
- JWT authentication
- Multer upload placeholder
- Swagger docs

## Backend Features
- API versioning with `/api/v1`
- Centralized error handling and validation
- Security middleware: helmet, rate limit, hpp, sanitization
- Auth APIs: register, login, logout, refresh, forgot/reset password, verify email, phone verification placeholder
- Listings APIs with advanced filtering/sorting/search
- Smart search for combinations like `Dubai A 7777`, exact and partial plate number, formatted plate match, repeated digit patterns
- Saved listings APIs
- Offers and inquiries APIs
- Seller dashboard APIs
- Admin dashboard and moderation APIs
- Analytics APIs for views/popularity/trending score
- Redis caching for featured/trending/premium/home search blocks

## Project Structure
- `src/config`
- `src/common`
- `src/database`
- `src/modules/auth`
- `src/modules/listings`
- `src/modules/users`
- `src/modules/offers`
- `src/modules/inquiries`
- `src/modules/admin`
- `src/modules/saved-listings`
- `src/modules/analytics`
- `src/modules/messages`
- `src/modules/notifications`
- `prisma`

## Environment
Copy `.env.example` to `.env` and set values:

```bash
cp .env.example .env
```

## Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

## Local Infrastructure (PostgreSQL + Redis)

If PostgreSQL/Redis are not running locally, start them with Docker Compose:

```bash
npm run infra:up
```

Check logs:

```bash
npm run infra:logs
```

Stop containers:

```bash
npm run infra:down
```

Then run migration and seed:

```bash
npm run prisma:migrate
npm run db:seed
```

API base URL: `http://localhost:5001/api/v1`
Swagger docs: `http://localhost:5001/docs`

## Seeding
The seed script reads:
- `../uae_number_plates_500.json`

It inserts records into `number_plate_listings` and is repeat-safe by checking existing `listingId` values.

```bash
npm run db:seed
```

## Sample Response Shape

```json
{
  "success": true,
  "message": "Listings fetched successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 500
  }
}
```

## Key Endpoints
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `GET /api/v1/listings`
- `GET /api/v1/listings/featured`
- `GET /api/v1/listings/trending`
- `GET /api/v1/listings/premium`
- `GET /api/v1/listings/latest`
- `GET /api/v1/listings/:id`
- `GET /api/v1/listings/slug/:slug`
- `POST /api/v1/saved-listings`
- `GET /api/v1/saved-listings`
- `POST /api/v1/offers`
- `GET /api/v1/offers/received`
- `GET /api/v1/offers/sent`
- `POST /api/v1/inquiries`
- `POST /api/v1/inquiries/contact-seller`
- `GET /api/v1/users/dashboard/seller`
- `GET /api/v1/admin/dashboard`

## Postman Collection
- `src/docs/postman.collection.json`

## Troubleshooting
- `P1001: Can't reach database server at localhost:5432`: PostgreSQL is not running. Start infra and retry migrate.
- Redis connection warning: API will continue without cache, but start Redis for full behavior parity.
