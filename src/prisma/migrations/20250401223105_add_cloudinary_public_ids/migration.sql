-- AlterTable
ALTER TABLE "job_application_requests" ADD COLUMN     "coverLetterPublicId" TEXT,
ADD COLUMN     "cvPublicId" TEXT;

-- AlterTable
ALTER TABLE "partnership_attachments" ADD COLUMN     "publicId" TEXT;
