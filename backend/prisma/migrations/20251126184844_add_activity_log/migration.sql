-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "usuarioNome" TEXT NOT NULL,
    "usuarioTipo" TEXT NOT NULL,
    "usuarioId" INTEGER,
    "entidadeId" INTEGER,
    "detalhes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_tipo_idx" ON "ActivityLog"("tipo");

-- CreateIndex
CREATE INDEX "ActivityLog_usuarioTipo_idx" ON "ActivityLog"("usuarioTipo");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
