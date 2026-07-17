# Direct Rent API

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat&logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Admin%20SDK-FFCA28?style=flat&logo=firebase&logoColor=black)
![License](https://img.shields.io/badge/license-ISC-blue?style=flat)

> The backend REST API powering **[Direct Rent](https://www.directrent.ca)** — a rental-listings marketplace that connects property owners directly with renters, with an admin-moderated approval workflow for both owner accounts and property listings.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [Response Format](#response-format)
  - [Health](#health)
  - [Auth](#auth)
  - [Users](#users)
  - [Properties](#properties)
  - [Uploads](#uploads)
  - [Leads](#leads)
- [Authentication and Authorization](#authentication-and-authorization)
- [Data Models](#data-models)
- [Property Lifecycle](#property-lifecycle)
- [Testing](#testing)
- [Available Scripts](#available-scripts)
- [Security Notes](#security-notes)
- [Possible Next Steps](#possible-next-steps)
- [License](#license)

## Overview

Direct Rent API is a Node.js + Express + TypeScript backend serving three kinds of participants:

- **Renters** — public, unauthenticated visitors who browse approved listings and submit inquiries ("leads").
- **Owners** — authenticated landlords who list and manage their own properties. New owner accounts must verify their email and be approved by an admin before they can publish anything.
- **Admins** — moderate incoming owner accounts and property listings, and can manage any property on the platform.

Identity and data live in **Firebase** (Authentication + Firestore), images are stored in **Cloudinary** via signed, direct-to-cloud uploads, transactional email is sent through **Resend**, and public-facing forms are protected by **Cloudflare Turnstile**.

## Features

- 🔐 Firebase-authenticated requests with role-based access control (`owner` / `admin`)
- 🧭 Admin-moderated onboarding — owner accounts start unapproved and unverified
- 🏠 Full property lifecycle — create, edit, approve/reject, archive, and relist
- 📬 Lead capture on live listings, with an admin-only inbox
- ☁️ Signed, direct-to-Cloudinary uploads — the Cloudinary API secret never reaches the client
- ✉️ Branded verification emails via Resend, built on Firebase's verification-link generation
- 🤖 Cloudflare Turnstile bot protection on the public signup and lead-submission forms
- ✅ Centralized error handling, Zod request validation, and dev-mode request logging
- 🧪 Jest + Supertest test setup

## Tech Stack

| Layer | Choice |
| --- | --- |
| Runtime | Node.js, TypeScript 6 |
| Web framework | Express 5 |
| Auth & database | Firebase Admin SDK (Authentication + Firestore) |
| File storage | Cloudinary (signed uploads) |
| Email | Resend |
| Bot protection | Cloudflare Turnstile |
| Validation | Zod |
| Dev server | tsx (watch mode) |
| Testing | Jest, ts-jest, Supertest |

## Project Structure

```
src/
├── app.ts                     # Express app: CORS, middleware, route mounting
├── server.ts                  # Entry point — starts the HTTP server
├── config/
│   ├── env.ts                  # Typed, validated environment variable loader
│   ├── firebaseAdmin.ts        # Firebase Admin SDK + Firestore initialization
│   └── cloudinary.ts           # Cloudinary SDK configuration
├── controllers/               # Thin request handlers — delegate to services
│   ├── auth.controller.ts
│   ├── lead.controller.ts
│   ├── property.controller.ts
│   ├── upload.controller.ts
│   └── user.controller.ts
├── services/                  # Business logic — Firestore, Cloudinary, Resend, Turnstile
│   ├── auth.service.ts
│   ├── email.service.ts
│   ├── lead.service.ts
│   ├── property.service.ts
│   ├── turnstile.service.ts
│   ├── upload.service.ts
│   └── user.service.ts
├── routes/                    # Route definitions, grouped by resource
│   ├── auth.routes.ts
│   ├── health.routes.ts
│   ├── lead.routes.ts
│   ├── property.routes.ts
│   ├── upload.routes.ts
│   └── user.routes.ts
├── middlewares/
│   ├── requireAuth.ts           # Verifies the Firebase ID token; loads the user profile
│   ├── requireEmailVerified.ts  # Gates routes behind a verified email (admins bypass)
│   ├── validate.ts              # Zod request-body validation
│   ├── errorHandler.ts          # Centralized error handler
│   ├── notFound.ts              # 404 handler
│   └── requestLogger.ts         # Dev-only request logging
├── schemas/                   # Zod schemas (also the source of inferred request types)
│   ├── auth.schema.ts
│   ├── lead.schema.ts
│   └── property.schema.ts
├── types/                     # Shared TypeScript types
├── utils/
│   ├── appError.ts              # Custom error class carrying an HTTP status code
│   └── asyncHandler.ts          # Wraps async route handlers to forward errors
└── __tests__/                  # Jest + Supertest test suites
```

## Getting Started

### Prerequisites

- **Node.js 20 LTS or newer** — no version is pinned via `engines` in `package.json`.
- A **Firebase** project with **Authentication** (Email/Password sign-in) and **Firestore** enabled, plus a generated service-account key (Project Settings → Service Accounts → Generate new private key).
- A **Cloudinary** account (cloud name + API key/secret).
- A **Resend** account with an API key and a verified "from" address.
- A **Cloudflare Turnstile** site and secret key.

### Installation

```bash
git clone <your-repo-url> directrentca-api
cd directrentca-api
npm install
```

### Environment Variables

Create a `.env` file in the project root:

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development`, `production`, or `test`. Defaults to `development`. |
| `PORT` | Port the server listens on. Defaults to `5000`. |
| `FIREBASE_PROJECT_ID` | Project ID of the Firebase service account. |
| `FIREBASE_CLIENT_EMAIL` | Client email of the Firebase service account. |
| `FIREBASE_PRIVATE_KEY` | Private key of the Firebase service account. Keep the `\n` sequences — the app un-escapes them into real newlines at startup. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret, used server-side to sign upload requests. |
| `RESEND_API_KEY` | API key for Resend (verification emails). |
| `RESEND_FROM_EMAIL` | The "from" address used when sending verification emails. |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key, used to verify tokens from the public signup and lead forms. |

> A single `CLOUDINARY_URL` connection string is also accepted by the Cloudinary SDK as a shorthand for the three `CLOUDINARY_*` variables above, though this codebase currently sets them explicitly in `src/config/cloudinary.ts`.

Never commit your real `.env` or Firebase service-account file — both are already listed in `.gitignore`.

### Running the Server

```bash
npm run dev     # start with hot-reload (tsx watch)
npm run build   # compile TypeScript to dist/
npm start       # run the compiled server (run build first)
```

By default the API listens on `http://localhost:5000`. CORS currently allows requests from `http://localhost:3000`, `https://simple-lease.vercel.app`, and `https://www.directrent.ca` — add any new frontend origin to the `allowedOrigins` array in `src/app.ts`.

## API Reference

All routes are mounted under `/api`. Every response is JSON.

### Response Format

Success:

```json
{
  "success": true,
  "message": "Human-readable summary",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "stack": "Only included when NODE_ENV=development"
}
```

### Health

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Liveness check |

### Auth

**Base path:** `/api/auth`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/signup` | Public | Register a new owner account and send a verification email |
| POST | `/resend-verification-email` | Authenticated | Resend the verification email (5-minute cooldown) |

<details>
<summary>Example — <code>POST /api/auth/signup</code></summary>

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Landlord",
    "email": "jane@example.com",
    "password": "a-strong-password-here",
    "turnstileToken": "<token from the Turnstile widget>"
  }'
```

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "id": "firebase-uid",
    "email": "jane@example.com",
    "role": "owner",
    "isApproved": false
  }
}
```

</details>

### Users

**Base path:** `/api/users`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/me` | Authenticated | Get the current user's profile |
| GET | `/pending-owners` | Admin | List owner accounts awaiting approval |
| PATCH | `/:id/approve` | Admin | Approve a pending owner account |

### Properties

**Base path:** `/api/properties`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/` | Public | List approved, non-archived properties |
| GET | `/:id` | Public | Get a single approved, non-archived property |
| GET | `/mine` | Owner | List the current owner's own properties |
| GET | `/mine/:id` | Owner | Get one of the current owner's own properties |
| POST | `/` | Owner or Admin (verified + approved) | Create a property — starts as `pending` |
| PATCH | `/:id` | Owner (verified + approved) | Update your own property — resets it to `pending` |
| PATCH | `/:id/archive` | Owner or Admin (verified) | Archive a property |
| PATCH | `/:id/relist` | Owner or Admin (verified) | Relist an archived property — resets it to `pending` |
| GET | `/pending` | Admin | List properties awaiting moderation |
| GET | `/archived` | Admin | List archived properties |
| GET | `/admin` | Admin | List all properties, with an optional `?status=` filter |
| GET | `/admin/:id` | Admin | Get any property, regardless of status |
| PATCH | `/:id/status` | Admin | Approve or reject a pending property (rejection requires a comment) |

### Uploads

**Base path:** `/api/uploads`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/sign` | Owner or Admin (verified + approved) | Get a signed Cloudinary signature scoped to `properties/{uid}` |

### Leads

**Base path:** `/api/leads`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/` | Public | Submit an inquiry on an approved property |
| GET | `/` | Admin | List all submitted leads |

## Authentication and Authorization

This API doesn't issue its own session tokens — clients sign in directly against **Firebase Authentication** (email/password) using a Firebase client SDK, then send the resulting **ID token** on every request that needs it:

```
Authorization: Bearer <firebase-id-token>
```

`requireAuth` (in `src/middlewares/requireAuth.ts`) verifies that token with the Admin SDK, loads the matching `users/{uid}` Firestore document, and attaches the result to `req.user` (`uid`, `role`, `isApproved`, `emailVerified`, `name`, `email`). A few composable middlewares build on top of it:

- **`requireRole(...roles)`** — restricts a route to one or more roles (`"owner"`, `"admin"`).
- **`requireApproved`** — blocks owners whose account hasn't been approved yet by an admin.
- **`requireEmailVerified`** — blocks unverified accounts (admins are exempt).

Email-verification status is synced from Firebase Auth into the Firestore profile automatically the next time a verified user makes an authenticated request.

## Data Models

### Property (`properties/{id}` in Firestore)

```typescript
interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: { url: string; publicId: string }[];
  propertyType:
    | "apartment" | "house" | "basement" | "condo"
    | "room" | "commercial" | "other" | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  availableFrom: string | null;
  leaseTerm: "monthly" | "yearly" | "short_term" | "flexible" | null;
  parkingAvailable: boolean | null;
  utilitiesIncluded: boolean | null;
  laundryAvailable: boolean | null;
  furnished: boolean | null;
  petFriendly: boolean | null;
  customFacts: { label: string; value: string }[]; // up to 6, unique labels
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  archivedBy: string | null;
  rejectionComment: string | null;
  rejectedAt: string | null;
  rejectedBy: string | null;
  createdAt: string;
}
```

### User (`users/{uid}` in Firestore)

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin";
  isApproved: boolean;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  verificationEmailSentAt: string;
  createdAt: string;
}
```

### Lead (`leads/{id}` in Firestore)

```typescript
interface Lead {
  id: string;
  propertyId: string;
  ownerId: string;
  property: { title: string; location: string; price: number }; // snapshot at submission time
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
```

## Property Lifecycle

```
pending → approved (public) → archived → relisted → pending (re-review)
        → rejected (owner edits → back to pending)
```

1. An owner creates a property → it starts as `pending`.
2. An admin reviews it: **approve** → `approved` and publicly visible, or **reject** → `rejected` with a required `rejectionComment`.
3. Any edit an owner makes to their property resets its `status` to `pending` for re-review.
4. An owner or admin can **archive** a property at any time, removing it from public and owner listings.
5. An owner or admin can **relist** an archived property, which resets `isArchived` to `false` and sends it back through moderation as `pending`.

## Testing

```bash
npm test          # run the Jest suite once
npm run test:watch
```

Test suites (Jest + `ts-jest` + Supertest) currently exist for the health-check endpoint, Cloudinary upload-signature generation, and account creation/sync. Some of these predate recent route changes and are worth revisiting alongside new coverage as features are added.

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `npm run dev` | Run the API with hot-reload via `tsx watch` |
| `build` | `npm run build` | Compile TypeScript to `dist/` |
| `start` | `npm start` | Run the compiled server (`dist/server.js`) |
| `test` | `npm test` | Run the Jest test suite |
| `test:watch` | `npm run test:watch` | Run Jest in watch mode |

## Security Notes

- Every protected route verifies a real Firebase ID token server-side — there's no custom session/JWT logic to maintain.
- Role, approval, and email-verification checks are composable middleware, applied per-route in `src/routes/`.
- Cloudinary uploads are signed on the server; the API secret never reaches the client.
- Public-facing forms (signup, leads) are gated by Cloudflare Turnstile.
- CORS is restricted to an explicit origin allowlist in `src/app.ts`.
- Secrets are loaded from environment variables. Keep `.env` and your Firebase service-account file out of version control and out of anywhere else this codebase gets shared (both are already `.gitignore`d).

## Possible Next Steps

- Search/filtering (location, price range, bedrooms, property type) and pagination on the public listings endpoint
- An endpoint to toggle `isFeatured` — the field exists on the `Property` model but nothing currently sets it
- Rate limiting on public endpoints (`/signup`, `/leads`)
- CI (e.g., GitHub Actions) to run `npm test` on every push/PR
- Expanding test coverage to match the current route set

## License

ISC
