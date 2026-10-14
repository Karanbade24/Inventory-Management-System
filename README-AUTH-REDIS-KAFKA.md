# IMS: Real authentication, Redis caching and Kafka events

This is an implementation starter integrated into the existing Inventory Management System source.

## What changed

- Real backend registration and login endpoints: `POST /auth/register` and `POST /auth/login`.
- User accounts are stored in MySQL (`ims_users`); passwords are hashed with BCrypt, never stored as plaintext.
- Login returns a signed JWT. Protected IMS APIs require `Authorization: Bearer <token>`.
- React login calls the backend and has a Create Account mode. It no longer compares hardcoded credentials.
- Redis caches vendor and material-category lists for 10 minutes.
- On purchase save, the backend publishes a JSON `PURCHASE_CREATED` event to Kafka topic `ims.purchase.created`; a starter consumer logs the event.
- Database, JWT secret, Redis/Kafka endpoints and downstream service URLs are configurable through environment variables.

## Start local infrastructure

Requirements: Docker Desktop and Java 17. In this folder:

1. Copy `.env.example` to `.env` and replace `IMS_JWT_SECRET` with a strong random secret. Never use the example value outside local development.
2. Start infrastructure: `docker compose --env-file .env -f docker-compose-infrastructure.yml up -d`
3. The compose file creates the MySQL database `dbpurchase`. Existing purchase tables are not seeded automatically; import the project's original schema/data if you want demo records. JPA `ddl-auto=update` creates the `ims_users` table.
4. Start VendorService and MaterialService using their existing configuration.
5. In PowerShell, set environment variables from `.env` manually (Compose does not export variables to your terminal), or set them in your IDE run configuration. Required: `IMS_JWT_SECRET`, `DB_PASSWORD`, `DB_USERNAME`, `DB_URL`, and the Redis/Kafka values. Then run the InventoryManagementSystem application.
6. In `ims-frontend/frontend`, run `npm install`, then `npm run dev -- --host 0.0.0.0 --port 3001`. Set `VITE_API_BASE_URL=http://localhost:8089` if needed.
7. Open the frontend, choose **Create account**, register a username and password (minimum 8 characters), then sign in.

## API examples

Register:

```bash
curl -X POST http://localhost:8089/auth/register -H "Content-Type: application/json" -d '{"username":"karan","password":"Use-A-Unique-Password-Here"}'
```

Login:

```bash
curl -X POST http://localhost:8089/auth/login -H "Content-Type: application/json" -d '{"username":"karan","password":"Use-A-Unique-Password-Here"}'
```

Use the returned token on protected routes:

```bash
curl http://localhost:8089/vendors -H "Authorization: Bearer YOUR_TOKEN"
```

## Important security and production notes

- The JWT signing secret must be strong, unique, and kept outside source control. The application intentionally fails startup if the secret is missing or shorter than 32 bytes.
- Public registration creates a normal `USER`, not an administrator. For a real public deployment, add email verification, rate limiting, password reset, abuse controls, HTTPS, and an admin-controlled onboarding policy before opening registration to the internet.
- Browser localStorage is used for the bearer token to keep this frontend change simple. For a higher-security production app, prefer a carefully configured Secure, HttpOnly, SameSite cookie/BFF design and add a Content Security Policy.
- The compose infrastructure is for local development only: Redis and Kafka are not configured with production authentication/TLS. Do not expose these ports publicly.
- Kafka publication is asynchronous and best-effort in this starter; the purchase database transaction and Kafka delivery are not atomic. For guaranteed delivery, implement the transactional outbox pattern and retries/dead-letter handling.
- Redis cache entries expire after 10 minutes. Add explicit eviction when vendor/category writes are implemented.
- This patch is source code, not a deployed live website. To make it live, deploy the app and infrastructure to a host, configure real secrets and HTTPS, and point the frontend at the deployed API.
