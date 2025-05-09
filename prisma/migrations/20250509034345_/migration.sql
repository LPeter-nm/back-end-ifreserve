/*
  Warnings:

  - The values [AULA_CADASTRADA,EVENTO_CADASTRADO,AULA_SOLICITADA,AULA_CONFIRMADA,AULA_RECUSADA,EVENTO_SOLICITADO,EVENTO_RECUSADO,EVENTO_CONFIRMADO] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `statusReadAmdmin` on the `Report` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('RESERVA_SOLICITADA', 'RESERVA_CONFIRMADA', 'RESERVA_RECUSADA', 'RELATORIO_PENDENTE', 'RELATORIO_REALIZADO');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "statusReadAmdmin",
ADD COLUMN     "statusReadAdmin" BOOLEAN NOT NULL DEFAULT false;
