# Architecture

## Identity

SmartVet Academy uses the estate's first-party Tuku Auth service. Tuku Core runs on the production VPS and stores first-party password hashes, sessions and canonical profiles in the VPS PostgreSQL platform database. The Academy never stores user passwords.

The browser posts registration and login forms to the same `academy.smartvet.africa` origin. The Academy API forwards the credential operation to Tuku Core over the private Docker network and stores the resulting access and refresh tokens only in Secure, HttpOnly, host-only cookies. Browser JavaScript never receives those tokens.

For protected Academy requests, the API validates the active Tuku session with Core, transparently refreshes it when needed, and uses `coreUserId` as the stable learner identity.

## Academy data

The dedicated `smartvet_academy` database is hosted by the VPS `tuku-platform-postgres` service with a dedicated runtime role. Tables are:

- `learner_profiles`
- `learner_progress`
- `course_state`
- `quiz_attempts`
- `certificates`

Progress completion is idempotent and serialized per learner/course. Modules must be completed in order. Quiz scores are calculated on the server from submitted answer indexes. A certificate can be created only after nine completed modules and at least one passing assessment.

## Public certificate verification

The only anonymous learning-data endpoint is `GET /api/certificates/verify/:code`. It returns only the certificate holder name, course id and issue date.

## Edge

Caddy serves the static frontend and routes `/api/*` to `smartvet-academy-api:4500` on the private `tuku-edge` Docker network. Cloudflare remains the public DNS/edge layer; application and learner data originate on the VPS.
