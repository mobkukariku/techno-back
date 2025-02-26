/*
  Warnings:

  - You are about to drop the column `imageURL` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "member_profiles" ADD COLUMN     "imageURL" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "imageURL";
