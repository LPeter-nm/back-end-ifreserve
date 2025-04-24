-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GENERAL', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Type_User" AS ENUM ('ALUNO', 'SERVIDOR', 'EXTERNO');

-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusRestore" AS ENUM ('CONCLUIDO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "StatusSport" AS ENUM ('PENDENTE', 'CONFIRMADA', 'RECUSADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "Type_Reserve" AS ENUM ('OFICIO', 'EVENTO', 'AULA');

-- CreateEnum
CREATE TYPE "Type_Practice" AS ENUM ('TREINO', 'RECREACAO', 'AMISTOSO');

-- CreateEnum
CREATE TYPE "Ocurrence" AS ENUM ('EVENTO_UNICO', 'SEMANALMENTE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type_User" "Type_User" NOT NULL DEFAULT 'ALUNO',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "StatusUser" DEFAULT 'ATIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "funtion_Server" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_External" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_External_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Reserve" (
    "id" TEXT NOT NULL,
    "type_Reserve" "Type_Reserve" NOT NULL DEFAULT 'OFICIO',
    "ocurrence" "Ocurrence" NOT NULL,
    "date_Start" TIMESTAMP(3) NOT NULL,
    "date_End" TIMESTAMP(3) NOT NULL,
    "hour_Start" TEXT NOT NULL,
    "hour_End" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reserve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sport" (
    "id" TEXT NOT NULL,
    "type_Practice" "Type_Practice" NOT NULL,
    "number_People" INTEGER NOT NULL,
    "participants" TEXT NOT NULL,
    "request_Equipment" TEXT NOT NULL,
    "status" "StatusSport" NOT NULL DEFAULT 'PENDENTE',
    "anseweredBy" TEXT,
    "comments" TEXT,
    "completed" BOOLEAN,
    "reserveId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "matter" TEXT NOT NULL,
    "reserveId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

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
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "name_User" TEXT NOT NULL,
    "people_Appear" TEXT NOT NULL,
    "requested_Equipment" TEXT NOT NULL,
    "description_Court" TEXT NOT NULL,
    "description_Equipment" TEXT NOT NULL,
    "time_Used" TEXT NOT NULL,
    "date_Used" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "comments" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "sportId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_identification_key" ON "User"("identification");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_created_at_idx" ON "User"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Server_userId_key" ON "Server"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_External_userId_key" ON "User_External"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Reserve_userId_key" ON "Reserve"("userId");

-- CreateIndex
CREATE INDEX "Reserve_date_Start_date_End_idx" ON "Reserve"("date_Start", "date_End");

-- CreateIndex
CREATE INDEX "Reserve_userId_idx" ON "Reserve"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Sport_reserveId_key" ON "Sport"("reserveId");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_reserveId_key" ON "Classroom"("reserveId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_reserveId_key" ON "Event"("reserveId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_sportId_key" ON "Report"("sportId");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_External" ADD CONSTRAINT "User_External_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restores" ADD CONSTRAINT "restores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sport" ADD CONSTRAINT "Sport_reserveId_fkey" FOREIGN KEY ("reserveId") REFERENCES "Reserve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_reserveId_fkey" FOREIGN KEY ("reserveId") REFERENCES "Reserve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_reserveId_fkey" FOREIGN KEY ("reserveId") REFERENCES "Reserve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
