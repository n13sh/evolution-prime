-- Evolution Prime — PostgreSQL Schema (Supabase)
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New query → paste → Run

CREATE TABLE IF NOT EXISTS users (
  id           BIGSERIAL PRIMARY KEY,
  email        TEXT      NOT NULL UNIQUE,
  password_hash TEXT     NOT NULL,
  role         TEXT      NOT NULL CHECK(role IN ('admin','coach','trainee')),
  display_name TEXT      NOT NULL,
  avatar_url   TEXT,
  is_active    INTEGER   NOT NULL DEFAULT 1,
  created_at   BIGINT    NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
  updated_at   BIGINT    NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

CREATE TABLE IF NOT EXISTS coaches (
  id              BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio             TEXT,
  specializations TEXT,
  is_approved     INTEGER NOT NULL DEFAULT 0,
  max_trainees    INTEGER NOT NULL DEFAULT 20
);

CREATE TABLE IF NOT EXISTS trainees (
  id             BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  coach_id       BIGINT REFERENCES coaches(id) ON DELETE SET NULL,
  date_of_birth  TEXT,
  gender         TEXT CHECK(gender IN ('male','female','other')),
  height_cm      REAL,
  goal           TEXT CHECK(goal IN ('weight_loss','muscle_gain','endurance','general_fitness')),
  fitness_level  TEXT CHECK(fitness_level IN ('beginner','intermediate','advanced'))
);

CREATE INDEX IF NOT EXISTS idx_trainees_coach ON trainees(coach_id);

CREATE TABLE IF NOT EXISTS exercises (
  id               BIGSERIAL PRIMARY KEY,
  name             TEXT NOT NULL UNIQUE,
  muscle_group     TEXT NOT NULL,
  secondary_muscles TEXT,
  equipment        TEXT NOT NULL,
  exercise_type    TEXT NOT NULL CHECK(exercise_type IN ('compound','isolation','cardio')),
  instructions     TEXT,
  video_url        TEXT,
  created_by       BIGINT REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_exercises_muscle ON exercises(muscle_group);

CREATE TABLE IF NOT EXISTS workout_plans (
  id             BIGSERIAL PRIMARY KEY,
  title          TEXT    NOT NULL,
  description    TEXT,
  created_by     BIGINT  NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  assigned_to    BIGINT  REFERENCES trainees(id) ON DELETE SET NULL,
  goal           TEXT,
  difficulty     TEXT    CHECK(difficulty IN ('beginner','intermediate','advanced')),
  duration_weeks INTEGER NOT NULL DEFAULT 4,
  days_per_week  INTEGER NOT NULL DEFAULT 3,
  structure      TEXT    NOT NULL,
  is_ai_generated INTEGER NOT NULL DEFAULT 0,
  is_active      INTEGER NOT NULL DEFAULT 1,
  created_at     BIGINT  NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
  updated_at     BIGINT  NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
);

CREATE INDEX IF NOT EXISTS idx_plans_assigned ON workout_plans(assigned_to);
CREATE INDEX IF NOT EXISTS idx_plans_creator  ON workout_plans(created_by);

CREATE TABLE IF NOT EXISTS sessions (
  id           BIGSERIAL PRIMARY KEY,
  trainee_id   BIGINT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
  plan_id      BIGINT REFERENCES workout_plans(id) ON DELETE SET NULL,
  day_index    INTEGER,
  status       TEXT NOT NULL DEFAULT 'in_progress'
                 CHECK(status IN ('in_progress','completed','abandoned')),
  started_at   BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
  completed_at BIGINT,
  duration_sec INTEGER,
  notes        TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_trainee ON sessions(trainee_id);

CREATE TABLE IF NOT EXISTS workout_logs (
  id           BIGSERIAL PRIMARY KEY,
  session_id   BIGINT  NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  trainee_id   BIGINT  NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
  exercise_id  BIGINT  NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  set_number   INTEGER NOT NULL,
  reps         INTEGER,
  weight_kg    REAL,
  duration_sec INTEGER,
  distance_m   REAL,
  rir          INTEGER,
  is_pr        INTEGER NOT NULL DEFAULT 0,
  logged_at    BIGINT  NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
);

CREATE INDEX IF NOT EXISTS idx_logs_session  ON workout_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_logs_trainee  ON workout_logs(trainee_id);
CREATE INDEX IF NOT EXISTS idx_logs_exercise ON workout_logs(exercise_id);

CREATE TABLE IF NOT EXISTS diet_plans (
  id             BIGSERIAL PRIMARY KEY,
  title          TEXT   NOT NULL,
  created_by     BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  assigned_to    BIGINT REFERENCES trainees(id) ON DELETE SET NULL,
  calorie_target INTEGER,
  protein_g      INTEGER,
  carbs_g        INTEGER,
  fat_g          INTEGER,
  structure      TEXT,
  is_ai_generated INTEGER NOT NULL DEFAULT 0,
  is_active      INTEGER NOT NULL DEFAULT 1,
  created_at     BIGINT  NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
);

CREATE TABLE IF NOT EXISTS body_metrics (
  id             BIGSERIAL PRIMARY KEY,
  trainee_id     BIGINT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
  weight_kg      REAL,
  body_fat_pct   REAL,
  muscle_mass_kg REAL,
  chest_cm       REAL,
  waist_cm       REAL,
  hips_cm        REAL,
  bicep_cm       REAL,
  thigh_cm       REAL,
  measured_at    BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
  notes          TEXT
);

CREATE INDEX IF NOT EXISTS idx_metrics_trainee ON body_metrics(trainee_id);
CREATE INDEX IF NOT EXISTS idx_metrics_date    ON body_metrics(measured_at);

CREATE TABLE IF NOT EXISTS notifications (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT   NOT NULL,
  title      TEXT   NOT NULL,
  message    TEXT,
  is_read    INTEGER NOT NULL DEFAULT 0,
  created_at BIGINT  NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
);

CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);
