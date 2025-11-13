/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Candidato` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Candidato" ADD COLUMN     "profileData" JSONB,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "companyData" JSONB,
ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_userId_key" ON "Candidato"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_userId_key" ON "Empresa"("userId");

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
