# Migration from Supabase / Lovable

Cutover date: 18 September 2026.

Before the cutover, the Supabase-backed Academy tables and auth store were checked. The source contained:

- 0 auth users
- 0 learner profiles
- 0 learner-progress rows
- 0 course-state rows
- 0 quiz attempts
- 0 certificates

There was therefore no production learner record to transform or copy. The VPS database started clean, avoiding synthetic users or orphaned identity mappings.

The new release has no `@supabase/supabase-js` dependency and no Supabase URL/key in the browser build. Authentication now uses first-party Tuku Auth and all Academy learning/certificate state is persisted in the VPS PostgreSQL database.

The previous Supabase project can be retained temporarily only as a rollback reference; it is not in the live request path.
