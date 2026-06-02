BEGIN;

DROP TABLE IF EXISTS recheck_steps;
DROP TABLE IF EXISTS recheck_jobs;
DROP TABLE IF EXISTS source_passages;
DROP TABLE IF EXISTS generated_answers;
DROP TABLE IF EXISTS answer_direction_sets;
DROP TABLE IF EXISTS improved_prompts;
DROP TABLE IF EXISTS prompt_readiness_results;
DROP TABLE IF EXISTS prompt_inputs;
DROP TABLE IF EXISTS trust_lens_sessions;

COMMIT;

