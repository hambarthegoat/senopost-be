# SenoPost Backend API Documentation

## Overview

SenoPost Backend is a NestJS-based authentication service that provides user registration, login, and JWT-based token management. The API uses typed DTOs and JWT strategies for secure authentication.

**Base URL:** `http://localhost:3000`

---

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [DTOs & Types](#dtos--types)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or Bun package manager

### Installation

```bash
# Using Bun
bun install

# Using npm
npm install
```

### Development Server

```bash
# Start with Bun (watch mode)
bun run start:dev

# Using npm
npm run start:dev
```

The server will be available at `http://localhost:3000`.

### Production Build

```bash
# Build
bun run build

# Start production server
bun run start:prod
```

---

## Authentication

SenoPost uses **JWT (JSON Web Tokens)** for authentication. After successful login, you receive an `access_token` that must be included in subsequent authenticated requests.

### JWT Token Format

```
Authorization: Bearer <your_access_token>
```

### JWT Payload Structure

```json
{
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Token Expiration:** 1 day (86400 seconds)

---

## Endpoints

### 1. Health Check

**GET** `/`

Returns a simple health check message.

**Response (200 OK):**
```json
{
  "message": "Hello World!"
}
```

**Example:**
```bash
curl http://localhost:3000/
```

---

### 2. User Registration

**POST** `/auth/register`

Register a new user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered"
}
```

**Errors:**
- `400 Bad Request` – Invalid email or password format
- `409 Conflict` – Email already registered (when database persistence is added)

**Example:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

---

### 3. User Login

**POST** `/auth/login`

Authenticate user and retrieve JWT access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400 Bad Request` – Missing email or password
- `401 Unauthorized` – Invalid email or password
- `401 Unauthorized` – User not found

**Example:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

---

## DTOs & Types

### AuthDto

Request body for registration and login endpoints.

```typescript
{
  email: string;        // User email address (required)
  password: string;     // User password (required, minimum 8 chars recommended)
}
```

### TokenResponse

Response from login endpoint.

```typescript
{
  access_token: string;  // JWT token for authenticated requests
}
```

### JwtPayload

Internal payload structure within the JWT token.

```typescript
{
  email: string;         // User email address
  iat?: number;          // Issued At (Unix timestamp)
  exp?: number;          // Expiration Time (Unix timestamp)
}
```

---

## Error Handling

All errors follow a standard NestJS error response format:

**Error Response Structure:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Common Error Codes

| Status Code | Message | Description |
|-------------|---------|-------------|
| 400 | Bad Request | Invalid request body or missing required fields |
| 401 | Unauthorized | Invalid credentials or missing/invalid JWT token |
| 409 | Conflict | Email already exists (future DB implementation) |
| 500 | Internal Server Error | Server-side error |

---

## Examples

### Complete Authentication Flow

#### 1. Register a new user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "MyPassword123!"
  }'
```

**Response:**
```json
{
  "message": "User registered"
}
```

#### 2. Login to get token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "MyPassword123!"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MzIyMDQ3MzgsImV4cCI6MTczMjI5MTEzOH0.xyz..."
}
```

#### 3. Use token in authenticated requests (future)

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:3000/protected-endpoint
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
JWT_SECRET=your_secret_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/senopost
NODE_ENV=development
```

**Default Values:**
- `JWT_SECRET`: `dev-secret` (development only, change in production)
- `NODE_ENV`: `development`

---

## Current Limitations & Future Work

### Current State
- ✅ JWT authentication implemented
- ✅ User registration and login
- ✅ Type-safe DTOs with TypeScript
- ✅ Password hashing with bcrypt
- ❌ In-memory user storage (not persistent)

### Planned Features
- 🔄 Prisma ORM integration for persistent database
- 🔄 User profile endpoints
- 🔄 Email verification
- 🔄 Password reset functionality
- 🔄 Refresh token support
- 🔄 Role-based access control (RBAC)
- 🔄 Rate limiting
- 🔄 Request validation schemas

---

## Development

### Project Structure

```
src/
├── auth/
│   ├── dto/
│   │   └── auth.dto.ts          # Type-safe DTOs
│   ├── interfaces/
│   │   └── jwt-payload.interface.ts
│   ├── auth.controller.ts        # Auth endpoints
│   ├── auth.service.ts           # Auth business logic
│   ├── auth.module.ts            # Auth module configuration
│   ├── jwt.guard.ts              # JWT authentication guard
│   └── jwt.strategy.ts           # Passport JWT strategy
├── app.controller.ts             # Root endpoint
├── app.service.ts                # App service
├── app.module.ts                 # Root module
└── main.ts                       # Application entry point
```

### Available Scripts

```bash
# Build the application
bun run build

# Start development server (watch mode)
bun run start:dev

# Start with debugging
bun run start:debug

# Start production server
bun run start:prod

# Format code with Prettier
bun run format

# Run linter with ESLint
bun run lint
```

---

## Support

For issues or questions:
1. Check this documentation
2. Review error messages and status codes
3. Check environment variables configuration
4. Verify request body format matches DTOs

---

## License

UNLICENSED

---

**Last Updated:** November 21, 2025  
**Version:** 0.0.1
