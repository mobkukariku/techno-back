-- Remove columns from project_partnership_requests
ALTER TABLE "project_partnership_requests" 
DROP COLUMN IF EXISTS "referralSource",
DROP COLUMN IF EXISTS "organizationInterest";
