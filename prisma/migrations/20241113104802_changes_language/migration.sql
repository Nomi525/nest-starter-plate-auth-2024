/*
  Warnings:

  - Added the required column `updatedAt` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Made the column `first_name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pwd_hash` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ImageVariation" ADD COLUMN     "aspectRatio" INTEGER,
ADD COLUMN     "fileFormat" TEXT;

-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "first_name" SET NOT NULL,
ALTER COLUMN "pwd_hash" SET NOT NULL;
