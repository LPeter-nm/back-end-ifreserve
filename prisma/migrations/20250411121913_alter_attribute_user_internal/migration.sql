/*
  Warnings:

  - You are about to drop the column `functionServer` on the `User_Internal` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FunctionInternal" AS ENUM ('ALUNO', 'PROFESSOR', 'PROFESSOR_ED_FISICA');

-- AlterTable
ALTER TABLE "User_Internal" DROP COLUMN "functionServer",
ADD COLUMN     "function_Internal" "FunctionInternal" DEFAULT 'PROFESSOR';

-- DropEnum
DROP TYPE "FunctionServer";
