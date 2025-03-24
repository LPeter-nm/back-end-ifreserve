/*
  Warnings:

  - You are about to drop the column `reserveId` on the `Report` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sportId]` on the table `Report` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sportId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reserveId_fkey";

-- DropIndex
DROP INDEX "Report_reserveId_key";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "reserveId",
ADD COLUMN     "sportId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sport" ADD COLUMN     "completed" BOOLEAN;

-- CreateIndex
CREATE UNIQUE INDEX "Report_sportId_key" ON "Report"("sportId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
