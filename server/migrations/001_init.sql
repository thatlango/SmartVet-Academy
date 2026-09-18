BEGIN;

CREATE TABLE IF NOT EXISTS learner_profiles (
  core_user_id uuid PRIMARY KEY,
  email text,
  full_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learner_progress (
  core_user_id uuid NOT NULL REFERENCES learner_profiles(core_user_id) ON DELETE CASCADE,
  course_id text NOT NULL,
  module_id integer NOT NULL CHECK (module_id > 0),
  completed_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (core_user_id, course_id, module_id)
);

CREATE TABLE IF NOT EXISTS course_state (
  core_user_id uuid NOT NULL REFERENCES learner_profiles(core_user_id) ON DELETE CASCADE,
  course_id text NOT NULL,
  current_module_id integer NOT NULL DEFAULT 1,
  progress_percent integer NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (core_user_id, course_id)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  core_user_id uuid NOT NULL REFERENCES learner_profiles(core_user_id) ON DELETE CASCADE,
  course_id text NOT NULL,
  score integer NOT NULL CHECK (score >= 0),
  total integer NOT NULL CHECK (total > 0),
  passed boolean NOT NULL,
  answers jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quiz_attempts_user_course_idx
  ON quiz_attempts(core_user_id, course_id, created_at DESC);

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  core_user_id uuid NOT NULL REFERENCES learner_profiles(core_user_id) ON DELETE CASCADE,
  course_id text NOT NULL,
  verification_code text NOT NULL UNIQUE,
  issued_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (core_user_id, course_id)
);

CREATE INDEX IF NOT EXISTS certificates_verification_code_idx
  ON certificates(verification_code);

COMMIT;
