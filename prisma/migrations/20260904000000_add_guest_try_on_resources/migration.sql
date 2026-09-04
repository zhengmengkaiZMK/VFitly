-- Add guest-owned temporary try-on resources for unauthenticated users.
-- Safe to run on an existing PostgreSQL database.

ALTER TABLE "wardrobe_items"
  ALTER COLUMN "user_id" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "guest_id" VARCHAR(64),
  ADD COLUMN IF NOT EXISTS "is_temporary" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "expires_at" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "cleanup_status" VARCHAR(32);

ALTER TABLE "try_on_jobs"
  ALTER COLUMN "user_id" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "guest_id" VARCHAR(64),
  ADD COLUMN IF NOT EXISTS "is_temporary" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "expires_at" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "cleanup_status" VARCHAR(32);

CREATE INDEX IF NOT EXISTS "idx_wardrobe_items_guest_temporary"
  ON "wardrobe_items"("guest_id", "is_temporary", "expires_at");

CREATE INDEX IF NOT EXISTS "idx_wardrobe_items_temporary_expires"
  ON "wardrobe_items"("is_temporary", "expires_at");

CREATE INDEX IF NOT EXISTS "idx_try_on_jobs_guest_temporary"
  ON "try_on_jobs"("guest_id", "is_temporary", "expires_at");

CREATE INDEX IF NOT EXISTS "idx_try_on_jobs_temporary_expires"
  ON "try_on_jobs"("is_temporary", "expires_at");
