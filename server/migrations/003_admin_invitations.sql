BEGIN;

CREATE TABLE IF NOT EXISTS academy_admin_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('owner','admin','assessor','support')),
  token_hash text NOT NULL UNIQUE,
  invited_by uuid NOT NULL REFERENCES learner_profiles(core_user_id) ON DELETE RESTRICT,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  accepted_by uuid REFERENCES learner_profiles(core_user_id) ON DELETE SET NULL,
  revoked_at timestamptz,
  revoked_by uuid REFERENCES learner_profiles(core_user_id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS academy_admin_invites_email_idx
  ON academy_admin_invites ((lower(email)), created_at DESC);

CREATE INDEX IF NOT EXISTS academy_admin_invites_pending_idx
  ON academy_admin_invites (expires_at DESC)
  WHERE accepted_at IS NULL AND revoked_at IS NULL;

COMMIT;
