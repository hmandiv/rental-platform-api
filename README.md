# Rental Platform API

A scalable Node.js + Express + TypeScript backend for a rental platform.

This project is being built with a **clean architecture-first approach**, focusing on maintainability, predictable error handling, and scalable routing.

---

## 🚀 Tech Stack

- Node.js
- Express
- TypeScript
- tsx (development runner)
- dotenv (environment variables)
- cors

---

## 📁 Project Structure

src/
  app.ts
  server.ts
  config/
    env.ts
  middlewares/
    requestLogger.ts
    notFound.ts
    errorHandler.ts
  routes/
    health.routes.ts
  utils/
    AppError.ts
    asyncHandler.ts

## ⚙️ Core Concepts Implemented

### 1. Environment Configuration

Centralized in:

src/config/env.ts

Provides:

- `env.PORT`
- `env.NODE_ENV`
- `isDev`, `isProd`, `isTest`

👉 Avoids direct use of `process.env` across the codebase.

---

### 2. Middleware Pipeline

Every request follows this flow:

Request  
→ cors  
→ express.json  
→ requestLogger  
→ route handler  
→ notFound (if no route matched)  
→ errorHandler (if error occurs)

---

### 3. Request Logger

Logs in development:

- HTTP method
- URL
- status code
- response time

Purpose:

- debugging
- visibility into API behavior

---

### 4. Not Found Handler (404)

Handles unmatched routes:

GET /api/unknown → 404

Returns a consistent error response.

---

### 5. Global Error Handler

Centralized error handling for the entire app.

Behavior:

- uses custom `statusCode` if provided
- defaults to `500`
- shows stack trace in development
- hides sensitive details in production

---

### 6. AppError (Custom Errors)

Used to throw structured, intentional errors:

Unauthorized → 401  
Not Found → 404  
Bad Request → 400

Purpose:

- distinguish expected errors from system failures
- keep error responses consistent

---

### 7. asyncHandler (Async Error Wrapper)

Wraps async routes to automatically forward errors to the global error handler.

Without it:

- async errors may crash the app
- requires repetitive try/catch

With it:

- cleaner routes
- consistent error flow

---

## 🌐 Available Routes

### Root

GET /

Response:

{  
  "success": true,  
  "message": "Rental Platform API running"  
}

---

### Health Check

GET /api/health

Response:

{  
  "success": true,  
  "message": "API is healthy",  
  "timestamp": "..."  
}

---

### Error Test

GET /api/health/error-test

Tests global error handling.

---

### Async Error Test

GET /api/health/async-error-test

Tests async error handling via `asyncHandler`.

---

## 🛠 Installation

npm install

---

## ▶️ Scripts

npm run dev  
npm run build  
npm run start

### Development

npm run dev

Runs server with live reload using `tsx`.

---

### Build

npm run build

Compiles TypeScript → `dist/`

---

### Production

npm run start

Runs compiled server.

---

## 🔐 Environment Variables

Create `.env`:

PORT=5000  
NODE_ENV=development

---

## 🧠 Design Principles

This project is built with:

### 1. Separation of Concerns

- middleware handles cross-cutting concerns
- routes handle HTTP logic
- utilities handle reusable logic

---

### 2. Predictable Error Handling

- all errors go through a single handler
- consistent API responses
- no leaked stack traces in production

---

### 3. Clean Async Flow

- async errors are always captured
- no repetitive try/catch blocks

---

### 4. Scalable Structure

- easy to add routes (auth, properties, leads)
- clear folder boundaries
- ready for controller/service layers

---

## 🔮 Next Steps

Planned features:

### Phase 1 — Core API

- auth routes (`/api/auth`)
- Firebase user sync
- role-based access control

### Phase 2 — Business Logic

- property CRUD (landlords)
- lead submission (tenants)
- dashboard APIs

### Phase 3 — Platform Features

- image uploads (Cloudinary)
- admin tools
- analytics

---

## 🧩 Long-Term Goal

To build a production-ready backend supporting:

- multi-role users (landlord, tenant, admin)
- property listings
- lead generation system
- admin dashboard
- scalable API architecture

---

## 📌 Notes

This project is intentionally built step-by-step:

1. server setup
2. middleware system
3. error handling
4. async handling
5. feature modules

Focus is on **strong fundamentals before complexity**.

---

## 💡 Summary

This is not just an Express app — it is a **structured backend foundation** designed to scale into a full rental platform.