-- AlterTable
ALTER TABLE "CandidatoSubtipo" ADD COLUMN     "acessibilidadeId" INTEGER,
ADD COLUMN     "observacoes" TEXT,
ADD COLUMN     "prioridade" TEXT;

-- CreateIndex
CREATE INDEX "CandidatoSubtipo_acessibilidadeId_idx" ON "CandidatoSubtipo"("acessibilidadeId");

-- AddForeignKey
ALTER TABLE "CandidatoSubtipo" ADD CONSTRAINT "CandidatoSubtipo_acessibilidadeId_fkey" FOREIGN KEY ("acessibilidadeId") REFERENCES "Acessibilidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
