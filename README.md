<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

**SenoPost Backend** - A NestJS-based authentication service with JWT token management and type-safe DTOs. Built with TypeScript, Passport.js, and Bun.

## API Documentation

📖 **See [API_DOCS.md](./API_DOCS.md) for comprehensive API documentation including:**
- Authentication flow
- All available endpoints
- Request/Response examples
- DTOs and type definitions
- Error handling reference

## Project Setup

```bash
# Using Bun (recommended)
$ bun install

# Or using npm
$ npm install
```

## Development

```bash
# Start development server (watch mode)
$ bun run start:dev

# Start with debugging
$ bun run start:debug

# Build for production
$ bun run build

# Start production server
$ bun run start:prod
```

## Code Quality

```bash
# Format code with Prettier
$ bun run format

# Run linter
$ bun run lint
```

## Running Tests

```bash
# Note: Tests currently disabled. To re-enable, see API_DOCS.md
```

## Deployment

When you're ready to deploy your NestJS application to production, check out the [deployment documentation](https://docs.nestjs.com/deployment).

## Project Features

- ✅ **JWT Authentication** - Secure token-based authentication with Passport.js
- ✅ **Type-Safe DTOs** - Full TypeScript typing for request/response validation
- ✅ **Password Hashing** - Bcrypt-based password encryption
- ✅ **Error Handling** - Standardized NestJS error responses
- 🔄 **Upcoming:** Database persistence with Prisma ORM
- 🔄 **Upcoming:** User profile endpoints
- 🔄 **Upcoming:** Email verification and password reset

## Architecture

```
src/
├── auth/
│   ├── dto/auth.dto.ts              # Type-safe request/response DTOs
│   ├── interfaces/jwt-payload.interface.ts
│   ├── auth.controller.ts            # Authentication endpoints
│   ├── auth.service.ts               # Business logic
│   ├── auth.module.ts                # Module configuration
│   ├── jwt.guard.ts                  # JWT protection guard
│   └── jwt.strategy.ts               # Passport JWT strategy
├── app.controller.ts                 # Health check endpoint
├── app.module.ts                     # Root module
└── main.ts                           # Application entry
```

## Quick Start

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Start development server:**
   ```bash
   bun run start:dev
   ```

3. **Register a user:**
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"Password123"}'
   ```

4. **Login:**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"Password123"}'
   ```

See [API_DOCS.md](./API_DOCS.md) for full documentation.

## Resources

- [NestJS Documentation](https://docs.nestjs.com) - Learn more about the NestJS framework
- [Passport.js](http://www.passportjs.org/) - Authentication middleware
- [JWT.io](https://jwt.io/) - Learn about JSON Web Tokens
- [Prisma](https://www.prisma.io/) - Next-generation ORM (planned integration)

## License

UNLICENSED

## Prisma & Local Development

Set `DATABASE_URL` in your environment (e.g. `.env`) to a Postgres connection string and run:

```bash
npx prisma migrate dev --name init
npx prisma generate
npm install
npm run start:dev
```

