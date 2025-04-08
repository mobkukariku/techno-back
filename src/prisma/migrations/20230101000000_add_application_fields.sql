-- AlterTable
ALTER TABLE "job_application_requests" 
  ADD COLUMN IF NOT EXISTS "referralSource" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "projectInterests" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "skills" TEXT NOT NULL DEFAULT '';
