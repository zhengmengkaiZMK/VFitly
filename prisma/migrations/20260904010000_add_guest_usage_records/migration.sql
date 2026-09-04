-- Track unauthenticated guest usage for Product Try On daily limits.
-- Safe to run on an existing PostgreSQL database.

CREATE TABLE IF NOT EXISTS "guest_usage_records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "guest_id" VARCHAR(64) NOT NULL,
  "type" TEXT NOT NULL,
  "cost" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_guest_usage_records_guest_type_created"
  ON "guest_usage_records"("guest_id", "type", "created_at" DESC);
