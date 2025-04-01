-- AlterTable
ALTER TABLE "job_application_requests" ADD COLUMN     "jobRoleId" TEXT;

-- CreateTable
CREATE TABLE "job_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_roles_name_key" ON "job_roles"("name");

-- AddForeignKey
ALTER TABLE "job_application_requests" ADD CONSTRAINT "job_application_requests_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "job_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
