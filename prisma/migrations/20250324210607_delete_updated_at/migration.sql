/*
  Warnings:

  - You are about to drop the column `updated_at` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Reserve` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Reserve" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updated_at";
