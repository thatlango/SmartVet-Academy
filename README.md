# SmartVet Africa Academy

SmartVet Africa Academy is the production learning platform for practical poultry-production and poultry-business training from SmartVet Africa and River Poultry.

## Production architecture

The academy is fully served from the production VPS:

- **Web:** React/Vite static build behind the shared Caddy edge.
- **Authentication:** first-party Tuku Auth running in `tuku-core-api` on the VPS. Credentials and sessions are never handled by Supabase or Lovable.
- **Academy API:** `smartvet-academy-api`, reachable only through the academy origin and the private Docker networks.
- **Learning data:** dedicated `smartvet_academy` PostgreSQL database on the VPS `tuku-platform-postgres` service.
- **Session security:** Secure, HttpOnly, host-only cookies; Tuku access/refresh tokens are never exposed to browser JavaScript.
- **Certificates:** module order, server-side quiz scoring and certificate eligibility are enforced in the Academy API/database.

Canonical URL: https://academy.smartvet.africa

## Build

```bash
npm install
npm run build
```

The browser bundle requires no Supabase environment variables.

## API image

```bash
docker build -f server/Dockerfile -t smartvet-academy-api:latest .
docker compose -f deploy/compose.vps.yml up -d
```

Runtime secrets belong in `/opt/tuku/secrets/smartvet-academy.env`, never in Git.

See `docs/ARCHITECTURE.md` and `docs/MIGRATION_FROM_SUPABASE.md`.
