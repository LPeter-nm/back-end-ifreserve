-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SISTEMA_ADMIN', 'PE_ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ServerFunction" AS ENUM ('PROFESSOR_EDUCACAO_FISICA', 'PROFESSOR_OUTROS', 'DIRETOR', 'COORDENADOR', 'OUTRO');

-- CreateEnum
CREATE TYPE "TypeUser" AS ENUM ('ALUNO', 'SERVIDOR', 'EXTERNO');

-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusRestore" AS ENUM ('CONCLUIDO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "StatusReserve" AS ENUM ('CADASTRADO', 'PENDENTE', 'CONFIRMADA', 'RECUSADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TypeReserve" AS ENUM ('OFICIO', 'EVENTO', 'AULA');

-- CreateEnum
CREATE TYPE "TypePractice" AS ENUM ('TREINO', 'RECREACAO', 'AMISTOSO');

-- CreateEnum
CREATE TYPE "Occurrence" AS ENUM ('EVENTO_UNICO', 'SEMANALMENTE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RESERVA_CONFIRMADA', 'RESERVA_RECUSADA', 'RELATORIO_PENDENTE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "typeUser" "TypeUser" NOT NULL DEFAULT 'ALUNO',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "StatusUser" DEFAULT 'ATIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server" (
    "id" TEXT NOT NULL,
    "roleInInstitution" "ServerFunction" NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user-external" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user-external_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expirationAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserve" (
    "id" TEXT NOT NULL,
    "type_Reserve" "TypeReserve" NOT NULL DEFAULT 'OFICIO',
    "status" "StatusReserve" NOT NULL DEFAULT 'PENDENTE',
    "occurrence" "Occurrence" NOT NULL,
    "dateTimeStart" TIMESTAMP(3) NOT NULL,
    "dateTimeEnd" TIMESTAMP(3) NOT NULL,
    "answeredBy" TEXT,
    "comments" TEXT,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reserve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sport" (
    "id" TEXT NOT NULL,
    "typePractice" "TypePractice" NOT NULL,
    "numberParticipants" INTEGER NOT NULL,
    "participants" TEXT NOT NULL,
    "requestEquipment" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "pdfName" TEXT,
    "completed" BOOLEAN,
    "reserveId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "matter" TEXT NOT NULL,
    "reserveId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "reserveId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "nameUser" TEXT NOT NULL,
    "peopleAppear" TEXT NOT NULL,
    "requestedEquipment" TEXT NOT NULL,
    "courtCondition" TEXT NOT NULL,
    "equipmentCondition" TEXT NOT NULL,
    "timeUsed" TEXT NOT NULL,
    "dateUsed" TIMESTAMP(3) NOT NULL,
    "generalComments" TEXT,
    "commentsAdmin" TEXT,
    "statusReadAdmin" BOOLEAN NOT NULL DEFAULT false,
    "sportId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "linkTo" TEXT,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_identification_key" ON "user"("identification");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_created_at_idx" ON "user"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "server_userId_key" ON "server"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "student_userId_key" ON "student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user-external_userId_key" ON "user-external"("userId");

-- CreateIndex
CREATE INDEX "reserve_userId_idx" ON "reserve"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Sport_reserveId_key" ON "Sport"("reserveId");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_reserveId_key" ON "Classroom"("reserveId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_reserveId_key" ON "Event"("reserveId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_sportId_key" ON "Report"("sportId");

-- AddForeignKey
ALTER TABLE "server" ADD CONSTRAINT "server_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user-external" ADD CONSTRAINT "user-external_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restore" ADD CONSTRAINT "restore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserve" ADD CONSTRAINT "reserve_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sport" ADD CONSTRAINT "Sport_reserveId_fkey" FOREIGN KEY ("reserveId") REFERENCES "reserve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_reserveId_fkey" FOREIGN KEY ("reserveId") REFERENCES "reserve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_reserveId_fkey" FOREIGN KEY ("reserveId") REFERENCES "reserve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
