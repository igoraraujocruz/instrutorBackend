-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "foto" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrutor" (
    "id" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "cidadeSlug" TEXT NOT NULL,
    "classe" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Instrutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" TEXT NOT NULL,
    "aluno" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "instrutorId" TEXT NOT NULL,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_provider_providerId_key" ON "Usuario"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Instrutor_slug_key" ON "Instrutor"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Instrutor_usuarioId_key" ON "Instrutor"("usuarioId");

-- AddForeignKey
ALTER TABLE "Instrutor" ADD CONSTRAINT "Instrutor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_instrutorId_fkey" FOREIGN KEY ("instrutorId") REFERENCES "Instrutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
