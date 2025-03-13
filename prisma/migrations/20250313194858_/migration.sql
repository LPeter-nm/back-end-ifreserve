/*
  Warnings:

  - You are about to drop the column `confirmedBy` on the `Sport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reserve" ALTER COLUMN "Type_Reserve" DROP DEFAULT,
ALTER COLUMN "ocurrence" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Sport" DROP COLUMN "confirmedBy",
ADD COLUMN     "anseweredBy" TEXT,
ALTER COLUMN "type_Practice" DROP DEFAULT;
