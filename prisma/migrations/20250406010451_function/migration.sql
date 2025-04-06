/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `User_Internal` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Function" AS ENUM ('PROFESSOR', 'PROFESSOR_ED_FISICA');

-- AlterTable
ALTER TABLE "User_Internal" DROP COLUMN "isAdmin",
ADD COLUMN     "function" "Function" DEFAULT 'PROFESSOR';
