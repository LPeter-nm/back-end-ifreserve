/*
  Warnings:

  - You are about to drop the column `cpf` on the `User_External` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_External_cpf_key";

-- AlterTable
ALTER TABLE "User_External" DROP COLUMN "cpf";
