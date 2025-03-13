/*
  Warnings:

  - You are about to drop the column `submittedBy` on the `Report` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('ATIVO', 'INATIVO');

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "submittedBy";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "StatusUser" DEFAULT 'ATIVO';
