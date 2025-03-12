/*
  Warnings:

  - The `status` column on the `Restore` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `confirmed` on the `Sport` table. All the data in the column will be lost.
  - You are about to drop the column `description_People` on the `Sport` table. All the data in the column will be lost.
  - Added the required column `location` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submittedBy` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participants` to the `Sport` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusRestore" AS ENUM ('CONCLUIDO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "StatusSport" AS ENUM ('PENDENTE', 'CONFIRMADA', 'RECUSADA', 'CANCELADA');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "location" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "comments" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "submittedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Restore" DROP COLUMN "status",
ADD COLUMN     "status" "StatusRestore" NOT NULL DEFAULT 'PENDENTE';

-- AlterTable
ALTER TABLE "Sport" DROP COLUMN "confirmed",
DROP COLUMN "description_People",
ADD COLUMN     "confirmedBy" TEXT,
ADD COLUMN     "participants" TEXT NOT NULL,
ADD COLUMN     "status" "StatusSport" NOT NULL DEFAULT 'PENDENTE';

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reserve_date_Start_date_End_idx" ON "Reserve"("date_Start", "date_End");

-- CreateIndex
CREATE INDEX "Reserve_userId_idx" ON "Reserve"("userId");

-- CreateIndex
CREATE INDEX "Restore_token_idx" ON "Restore"("token");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_created_at_idx" ON "User"("created_at");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
