-- CreateTable
CREATE TABLE "Conversa" (
    "id" SERIAL NOT NULL,
    "candidaturaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensagem" (
    "id" SERIAL NOT NULL,
    "conversaId" INTEGER NOT NULL,
    "remetenteId" INTEGER NOT NULL,
    "tipoRemetente" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversa_candidaturaId_key" ON "Conversa"("candidaturaId");

-- CreateIndex
CREATE INDEX "Conversa_candidaturaId_idx" ON "Conversa"("candidaturaId");

-- CreateIndex
CREATE INDEX "Mensagem_conversaId_idx" ON "Mensagem"("conversaId");

-- CreateIndex
CREATE INDEX "Mensagem_remetenteId_idx" ON "Mensagem"("remetenteId");

-- AddForeignKey
ALTER TABLE "Conversa" ADD CONSTRAINT "Conversa_candidaturaId_fkey" FOREIGN KEY ("candidaturaId") REFERENCES "Candidatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_conversaId_fkey" FOREIGN KEY ("conversaId") REFERENCES "Conversa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
