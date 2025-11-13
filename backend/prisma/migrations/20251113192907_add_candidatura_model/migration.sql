-- CreateTable
CREATE TABLE "Candidatura" (
    "id" SERIAL NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "vagaId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidatura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Candidatura_vagaId_idx" ON "Candidatura"("vagaId");

-- CreateIndex
CREATE INDEX "Candidatura_candidatoId_idx" ON "Candidatura"("candidatoId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidatura_candidatoId_vagaId_key" ON "Candidatura"("candidatoId", "vagaId");

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
