# SmartVet Africa Academy

Production web academy for River Poultry / SmartVet poultry-business learning.

The app is a static React/Vite frontend hosted on the SmartVet VPS behind the estate Caddy edge. Learner authentication and durable learning state use Supabase; ordered module completion, final-assessment scoring and certificate issuance are enforced by database RPCs rather than browser state.

## Production

Canonical URL: https://academy.smartvet.africa

Build:

```bash
npm install
npm run build
```

Deploy `dist/` to the academy release directory on the VPS and point the Caddy site root to the current release.
