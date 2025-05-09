/*
  Warnings:

  - You are about to drop the column `answeredBy` on the `Sport` table. All the data in the column will be lost.
  - You are about to drop the column `comments` on the `Sport` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'AULA_SOLICITADA';
ALTER TYPE "NotificationType" ADD VALUE 'AULA_CONFIRMADA';
ALTER TYPE "NotificationType" ADD VALUE 'AULA_RECUSADA';
ALTER TYPE "NotificationType" ADD VALUE 'EVENTO_SOLICITADO';
ALTER TYPE "NotificationType" ADD VALUE 'EVENTO_RECUSADO';
ALTER TYPE "NotificationType" ADD VALUE 'EVENTO_CONFIRMADO';

-- AlterTable
ALTER TABLE "Sport" DROP COLUMN "answeredBy",
DROP COLUMN "comments";

-- AlterTable
ALTER TABLE "reserve" ADD COLUMN     "answeredBy" TEXT,
ADD COLUMN     "comments" TEXT;
