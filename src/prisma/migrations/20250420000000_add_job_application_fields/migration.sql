-- Add missing fields to job_application_requests table
ALTER TABLE "job_application_requests" 
ADD COLUMN IF NOT EXISTS "referralSource" TEXT NOT NULL DEFAULT 'Not specified',
ADD COLUMN IF NOT EXISTS "projectInterests" TEXT NOT NULL DEFAULT 'Not specified',
ADD COLUMN IF NOT EXISTS "skills" TEXT NOT NULL DEFAULT 'Not specified';
