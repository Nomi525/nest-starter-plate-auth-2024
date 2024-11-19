/*
  Warnings:

  - The values [SHOW_BALANCE,SEND_UPDATES] on the enum `PreferenceKey` will be removed. If these variants are still used in the database, this will fail.
  - The values [Guest,User,Manager,Admin] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `aspectRatio` on the `ImageVariation` table. All the data in the column will be lost.
  - You are about to drop the column `fileFormat` on the `ImageVariation` table. All the data in the column will be lost.
  - You are about to drop the `Manager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FileToManager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FileToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ImageVariationToManager` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[empId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `uploader_user_id` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('ONGOING', 'COMPLETED', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ASSIGNMENT', 'TRANSFER', 'FOLLOW_UP', 'GENERAL');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('IDLE', 'BUSY', 'ON_CALL', 'ON_BREAK', 'OFFLINE');

-- CreateEnum
CREATE TYPE "RecordingStatus" AS ENUM ('PENDING', 'FAILED', 'SUCCESS');

-- AlterEnum
BEGIN;
CREATE TYPE "PreferenceKey_new" AS ENUM ('SHARE_FULLNAME', 'SHARE_FIRSTNAME', 'SHARE_PROFILE_IMAGE');
ALTER TABLE "Preference" ALTER COLUMN "key" TYPE "PreferenceKey_new" USING ("key"::text::"PreferenceKey_new");
ALTER TYPE "PreferenceKey" RENAME TO "PreferenceKey_old";
ALTER TYPE "PreferenceKey_new" RENAME TO "PreferenceKey";
DROP TYPE "PreferenceKey_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('GUEST', 'EMPLOYEE', 'MANAGER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_uploader_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_FileToManager" DROP CONSTRAINT "_FileToManager_A_fkey";

-- DropForeignKey
ALTER TABLE "_FileToManager" DROP CONSTRAINT "_FileToManager_B_fkey";

-- DropForeignKey
ALTER TABLE "_FileToUser" DROP CONSTRAINT "_FileToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FileToUser" DROP CONSTRAINT "_FileToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_ImageVariationToManager" DROP CONSTRAINT "_ImageVariationToManager_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImageVariationToManager" DROP CONSTRAINT "_ImageVariationToManager_B_fkey";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "uploader_user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "ImageVariation" DROP COLUMN "aspectRatio",
DROP COLUMN "fileFormat";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "empId" TEXT NOT NULL DEFAULT 'EMPID_01',
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "Manager";

-- DropTable
DROP TABLE "_FileToManager";

-- DropTable
DROP TABLE "_FileToUser";

-- DropTable
DROP TABLE "_ImageVariationToManager";

-- CreateTable
CREATE TABLE "EmployeeShift" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "shift_start_date" TIMESTAMP(3) NOT NULL,
    "shift_end_date" TIMESTAMP(3) NOT NULL,
    "shift_duration" TEXT NOT NULL,
    "employment_active" BOOLEAN NOT NULL,
    "employment_start_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" UUID NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientNumber" TEXT NOT NULL,
    "clientLanguage" TEXT NOT NULL,
    "description" TEXT,
    "status" "CallStatus" NOT NULL,
    "recordingURL" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "assignedToId" UUID NOT NULL,
    "handledById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" UUID NOT NULL,
    "scheduleAt" TIMESTAMP(3) NOT NULL,
    "callId" UUID NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallTransfer" (
    "id" UUID NOT NULL,
    "originalCallId" UUID NOT NULL,
    "transferredToId" UUID NOT NULL,
    "transferReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallLink" (
    "id" UUID NOT NULL,
    "callId" UUID NOT NULL,
    "linkURL" TEXT NOT NULL,
    "sharedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" "NotificationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeActivity" (
    "id" SERIAL NOT NULL,
    "employeeId" UUID NOT NULL,
    "status" "ActivityStatus" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Break" (
    "id" SERIAL NOT NULL,
    "employeeId" UUID NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Break_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallTransferQueue" (
    "id" UUID NOT NULL,
    "callId" TEXT NOT NULL,
    "transferPriority" INTEGER NOT NULL,
    "assignedToId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallTransferQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallRecording" (
    "id" UUID NOT NULL,
    "callId" UUID NOT NULL,
    "filePath" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "RecordingStatus" NOT NULL,
    "compliance" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallRecording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserLanguages" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeShift_employee_id_key" ON "EmployeeShift"("employee_id");

-- CreateIndex
CREATE INDEX "Call_assignedToId_status_idx" ON "Call"("assignedToId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "_UserLanguages_AB_unique" ON "_UserLanguages"("A", "B");

-- CreateIndex
CREATE INDEX "_UserLanguages_B_index" ON "_UserLanguages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_empId_key" ON "User"("empId");

-- AddForeignKey
ALTER TABLE "EmployeeShift" ADD CONSTRAINT "EmployeeShift_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallTransfer" ADD CONSTRAINT "CallTransfer_originalCallId_fkey" FOREIGN KEY ("originalCallId") REFERENCES "Call"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallTransfer" ADD CONSTRAINT "CallTransfer_transferredToId_fkey" FOREIGN KEY ("transferredToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallLink" ADD CONSTRAINT "CallLink_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallLink" ADD CONSTRAINT "CallLink_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeActivity" ADD CONSTRAINT "EmployeeActivity_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Break" ADD CONSTRAINT "Break_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallTransferQueue" ADD CONSTRAINT "CallTransferQueue_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRecording" ADD CONSTRAINT "CallRecording_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploader_user_id_fkey" FOREIGN KEY ("uploader_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLanguages" ADD CONSTRAINT "_UserLanguages_A_fkey" FOREIGN KEY ("A") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLanguages" ADD CONSTRAINT "_UserLanguages_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
