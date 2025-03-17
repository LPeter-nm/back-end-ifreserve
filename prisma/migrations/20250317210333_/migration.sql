/*
  Warnings:

  - You are about to drop the column `Type_Reserve` on the `Reserve` table. All the data in the column will be lost.
  - Added the required column `type_Reserve` to the `Reserve` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserve" DROP COLUMN "Type_Reserve",
ADD COLUMN     "type_Reserve" "Type_Reserve" NOT NULL;
