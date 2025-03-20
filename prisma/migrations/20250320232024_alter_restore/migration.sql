/*
  Warnings:

  - You are about to drop the `Restore` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Restore" DROP CONSTRAINT "Restore_userId_fkey";

-- DropTable
DROP TABLE "Restore";

-- CreateTable
CREATE TABLE "restores" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "restores" ADD CONSTRAINT "restores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
