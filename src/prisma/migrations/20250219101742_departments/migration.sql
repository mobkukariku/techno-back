/*
  Warnings:

  - You are about to drop the column `EndDate` on the `work_experience` table. All the data in the column will be lost.
  - You are about to drop the column `StartDate` on the `work_experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "departments" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "work_experience" DROP COLUMN "EndDate",
DROP COLUMN "StartDate",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);
