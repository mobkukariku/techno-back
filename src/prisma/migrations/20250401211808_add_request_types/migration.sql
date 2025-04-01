-- CreateTable
CREATE TABLE "project_partnership_requests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_partnership_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partnership_attachments" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "requestId" TEXT NOT NULL,

    CONSTRAINT "partnership_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_application_requests" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telegramUsername" TEXT NOT NULL,
    "cvPath" TEXT NOT NULL,
    "cvOriginalName" TEXT NOT NULL,
    "cvSize" INTEGER NOT NULL,
    "coverLetterPath" TEXT,
    "coverLetterOriginalName" TEXT,
    "coverLetterSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_application_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "partnership_attachments" ADD CONSTRAINT "partnership_attachments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "project_partnership_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
