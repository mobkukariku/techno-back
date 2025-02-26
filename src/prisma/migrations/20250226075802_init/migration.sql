/*
  Warnings:

  - You are about to drop the column `direction` on the `requests` table. All the data in the column will be lost.
  - Added the required column `directionId` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "requests" DROP COLUMN "direction",
ADD COLUMN     "directionId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Direction";

-- CreateTable
CREATE TABLE "directions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "directions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "directions_name_key" ON "directions"("name");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "directions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
