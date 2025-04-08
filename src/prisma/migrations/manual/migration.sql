-- AlterTable
ALTER TABLE "job_application_requests" 
ADD COLUMN IF NOT EXISTS "referralSource" TEXT NOT NULL DEFAULT 'Not specified',
ADD COLUMN IF NOT EXISTS "projectInterests" TEXT NOT NULL DEFAULT 'Not specified',
ADD COLUMN IF NOT EXISTS "skills" TEXT NOT NULL DEFAULT 'Not specified';

-- After adding columns with defaults, we can remove the defaults for future inserts
ALTER TABLE "job_application_requests" ALTER COLUMN "referralSource" DROP DEFAULT;
ALTER TABLE "job_application_requests" ALTER COLUMN "projectInterests" DROP DEFAULT;
ALTER TABLE "job_application_requests" ALTER COLUMN "skills" DROP DEFAULT;
