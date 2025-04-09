-- Make referralSource and organizationInterest fields nullable
ALTER TABLE "project_partnership_requests" 
ALTER COLUMN "referralSource" DROP NOT NULL,
ALTER COLUMN "organizationInterest" DROP NOT NULL;
