/*
  Warnings:

  - A unique constraint covering the columns `[usuarioId,instrutorId,deletedAt]` on the table `Avaliacao` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_instrutorId_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_usuarioId_fkey";

-- DropIndex
DROP INDEX "Avaliacao_usuarioId_instrutorId_key";

-- AlterTable
ALTER TABLE "Avaliacao" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Avaliacao_deletedAt_idx" ON "Avaliacao"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_usuarioId_instrutorId_deletedAt_key" ON "Avaliacao"("usuarioId", "instrutorId", "deletedAt");

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_instrutorId_fkey" FOREIGN KEY ("instrutorId") REFERENCES "Instrutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
