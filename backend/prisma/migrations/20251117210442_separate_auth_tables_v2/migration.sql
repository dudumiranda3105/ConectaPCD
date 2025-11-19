/*
  Warnings:

  - You are about to drop the column `userId` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_userId_fkey";

-- DropForeignKey
ALTER TABLE "Empresa" DROP CONSTRAINT "Empresa_userId_fkey";

-- DropIndex
DROP INDEX "Candidato_userId_key";

-- DropIndex
DROP INDEX "Empresa_userId_key";

-- AlterTable
ALTER TABLE "Candidato" DROP COLUMN "userId",
ADD COLUMN     "biografia" TEXT,
ADD COLUMN     "cep" TEXT,
ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "dataNascimento" TIMESTAMP(3),
ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "estado" TEXT,
ADD COLUMN     "genero" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "portfolio" TEXT,
ALTER COLUMN "escolaridade" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Empresa" DROP COLUMN "userId",
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "nomeFantasia" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "porte" TEXT,
ADD COLUMN     "razaoSocial" TEXT,
ADD COLUMN     "setor" TEXT,
ADD COLUMN     "site" TEXT,
ADD COLUMN     "telefone" TEXT;

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cargo" TEXT NOT NULL DEFAULT 'Administrador',
    "permissoes" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Admin_email_idx" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Candidato_email_idx" ON "Candidato"("email");

-- CreateIndex
CREATE INDEX "Empresa_email_idx" ON "Empresa"("email");
