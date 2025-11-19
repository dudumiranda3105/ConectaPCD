-- CreateTable
CREATE TABLE "RecursoAssistivo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecursoAssistivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidatoRecursoAssistivo" (
    "candidatoId" INTEGER NOT NULL,
    "recursoId" INTEGER NOT NULL,
    "usoFrequencia" TEXT,
    "impactoMobilidade" TEXT,

    CONSTRAINT "CandidatoRecursoAssistivo_pkey" PRIMARY KEY ("candidatoId","recursoId")
);

-- CreateTable
CREATE TABLE "RecursoBarreiraMitigacao" (
    "recursoId" INTEGER NOT NULL,
    "barreiraId" INTEGER NOT NULL,
    "eficiencia" TEXT,

    CONSTRAINT "RecursoBarreiraMitigacao_pkey" PRIMARY KEY ("recursoId","barreiraId")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecursoAssistivo_nome_key" ON "RecursoAssistivo"("nome");

-- CreateIndex
CREATE INDEX "CandidatoRecursoAssistivo_recursoId_idx" ON "CandidatoRecursoAssistivo"("recursoId");

-- CreateIndex
CREATE INDEX "RecursoBarreiraMitigacao_barreiraId_idx" ON "RecursoBarreiraMitigacao"("barreiraId");

-- AddForeignKey
ALTER TABLE "CandidatoRecursoAssistivo" ADD CONSTRAINT "CandidatoRecursoAssistivo_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoRecursoAssistivo" ADD CONSTRAINT "CandidatoRecursoAssistivo_recursoId_fkey" FOREIGN KEY ("recursoId") REFERENCES "RecursoAssistivo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecursoBarreiraMitigacao" ADD CONSTRAINT "RecursoBarreiraMitigacao_recursoId_fkey" FOREIGN KEY ("recursoId") REFERENCES "RecursoAssistivo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecursoBarreiraMitigacao" ADD CONSTRAINT "RecursoBarreiraMitigacao_barreiraId_fkey" FOREIGN KEY ("barreiraId") REFERENCES "Barreira"("id") ON DELETE CASCADE ON UPDATE CASCADE;
