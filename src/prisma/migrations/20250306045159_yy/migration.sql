/*
  Warnings:

  - You are about to drop the column `certificates` on the `member_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "member_profiles" DROP COLUMN "certificates";

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "memberProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "certificateURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_memberProfileId_fkey" FOREIGN KEY ("memberProfileId") REFERENCES "member_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
