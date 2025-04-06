/*
  Warnings:

  - You are about to drop the column `function` on the `User_Internal` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FunctionServer" AS ENUM ('PROFESSOR', 'PROFESSOR_ED_FISICA');

-- AlterTable
ALTER TABLE "User_Internal" DROP COLUMN "function",
ADD COLUMN     "functionServer" "FunctionServer" DEFAULT 'PROFESSOR';

-- DropEnum
DROP TYPE "Function";
