/*
  Warnings:

  - Added the required column `updatedAt` to the `VagaAcessibilidade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VagaAcessibilidade" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "disponivel" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "observacoes" TEXT,
ADD COLUMN     "qualidade" TEXT NOT NULL DEFAULT 'boa',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "CandidatoAcessibilidade" (
    "candidatoId" INTEGER NOT NULL,
    "acessibilidadeId" INTEGER NOT NULL,
    "prioridade" TEXT NOT NULL DEFAULT 'importante',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidatoAcessibilidade_pkey" PRIMARY KEY ("candidatoId","acessibilidadeId")
);

-- CreateTable
CREATE TABLE "MatchScore" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "vagaId" INTEGER NOT NULL,
    "scoreTotal" INTEGER NOT NULL,
    "scoreAcessibilidades" INTEGER NOT NULL,
    "scoreSubtipos" INTEGER NOT NULL,
    "acessibilidadesAtendidas" INTEGER NOT NULL,
    "acessibilidadesTotal" INTEGER NOT NULL,
    "detalhes" JSONB,
    "calculadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CandidatoAcessibilidade_acessibilidadeId_idx" ON "CandidatoAcessibilidade"("acessibilidadeId");

-- CreateIndex
CREATE INDEX "MatchScore_scoreTotal_idx" ON "MatchScore"("scoreTotal");

-- CreateIndex
CREATE INDEX "MatchScore_vagaId_idx" ON "MatchScore"("vagaId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchScore_candidatoId_vagaId_key" ON "MatchScore"("candidatoId", "vagaId");

-- AddForeignKey
ALTER TABLE "CandidatoAcessibilidade" ADD CONSTRAINT "CandidatoAcessibilidade_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoAcessibilidade" ADD CONSTRAINT "CandidatoAcessibilidade_acessibilidadeId_fkey" FOREIGN KEY ("acessibilidadeId") REFERENCES "Acessibilidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchScore" ADD CONSTRAINT "MatchScore_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchScore" ADD CONSTRAINT "MatchScore_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
