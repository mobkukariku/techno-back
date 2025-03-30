/*
  Warnings:

  - You are about to drop the column `skills` on the `member_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "member_profiles" DROP COLUMN "skills";

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_profile_skills" (
    "profileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "member_profile_skills_pkey" PRIMARY KEY ("profileId","skillId")
);

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- AddForeignKey
ALTER TABLE "member_profile_skills" ADD CONSTRAINT "member_profile_skills_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "member_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_profile_skills" ADD CONSTRAINT "member_profile_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
