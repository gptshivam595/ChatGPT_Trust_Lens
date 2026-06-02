BEGIN;

CREATE TABLE trust_lens_sessions (
  id text PRIMARY KEY,
  client_mode text NOT NULL CHECK (client_mode IN ('prototype', 'production')),
  timezone text,
  locale text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE prompt_inputs (
  id text PRIMARY KEY,
  session_id text NOT NULL REFERENCES trust_lens_sessions(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE prompt_readiness_results (
  id text PRIMARY KEY,
  session_id text NOT NULL REFERENCES trust_lens_sessions(id) ON DELETE CASCADE,
  prompt_id text REFERENCES prompt_inputs(id) ON DELETE SET NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE improved_prompts (
  id text PRIMARY KEY,
  session_id text NOT NULL REFERENCES trust_lens_sessions(id) ON DELETE CASCADE,
  readiness_id text REFERENCES prompt_readiness_results(id) ON DELETE SET NULL,
  original_prompt text NOT NULL,
  improved_prompt text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE answer_direction_sets (
  id text PRIMARY KEY,
  session_id text NOT NULL REFERENCES trust_lens_sessions(id) ON DELETE CASCADE,
  selected_prompt text NOT NULL,
  selected_prompt_mode text NOT NULL CHECK (selected_prompt_mode IN ('original', 'improved')),
  recommended_direction_id text NOT NULL CHECK (recommended_direction_id IN ('summary', 'analysis', 'decision_ready')),
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE generated_answers (
  id text PRIMARY KEY,
  session_id text NOT NULL REFERENCES trust_lens_sessions(id) ON DELETE CASCADE,
  selected_prompt text NOT NULL,
  selected_prompt_mode text NOT NULL CHECK (selected_prompt_mode IN ('original', 'improved')),
  selected_direction_id text NOT NULL CHECK (selected_direction_id IN ('summary', 'analysis', 'decision_ready')),
  blocks jsonb NOT NULL,
  highlights jsonb NOT NULL,
  trust_lens jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE source_passages (
  id text PRIMARY KEY,
  title text NOT NULL,
  url_label text NOT NULL,
  passage text NOT NULL,
  highlighted_sentence text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE recheck_jobs (
  id text PRIMARY KEY,
  session_id text NOT NULL REFERENCES trust_lens_sessions(id) ON DELETE CASCADE,
  answer_id text NOT NULL REFERENCES generated_answers(id) ON DELETE CASCADE,
  mode text NOT NULL CHECK (mode = 'claim_level'),
  status text NOT NULL CHECK (status IN ('queued', 'running', 'complete', 'failed')),
  active_step_index integer NOT NULL DEFAULT 0 CHECK (active_step_index >= 0),
  summary jsonb,
  claims jsonb,
  highlights jsonb,
  failure_reason text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE recheck_steps (
  id text PRIMARY KEY,
  job_id text NOT NULL REFERENCES recheck_jobs(id) ON DELETE CASCADE,
  step_order integer NOT NULL CHECK (step_order >= 0),
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'running', 'complete', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, step_order)
);

CREATE INDEX idx_prompt_inputs_session_id ON prompt_inputs(session_id);
CREATE INDEX idx_prompt_readiness_session_id ON prompt_readiness_results(session_id);
CREATE INDEX idx_improved_prompts_session_id ON improved_prompts(session_id);
CREATE INDEX idx_answer_direction_sets_session_id ON answer_direction_sets(session_id);
CREATE INDEX idx_generated_answers_session_id ON generated_answers(session_id);
CREATE INDEX idx_recheck_jobs_session_id ON recheck_jobs(session_id);
CREATE INDEX idx_recheck_jobs_answer_id ON recheck_jobs(answer_id);
CREATE UNIQUE INDEX idx_recheck_jobs_one_running_per_answer
  ON recheck_jobs(answer_id)
  WHERE status = 'running';
CREATE INDEX idx_recheck_steps_job_id ON recheck_steps(job_id);

COMMIT;

