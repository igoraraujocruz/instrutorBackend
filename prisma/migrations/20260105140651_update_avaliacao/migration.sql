/*
  Warnings:

  - You are about to drop the column `aluno` on the `Avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `Avaliacao` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioId,instrutorId]` on the table `Avaliacao` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Avaliacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Avaliacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "instrutor_cidade_trgm_idx";

-- DropIndex
DROP INDEX "instrutor_estado_idx";

-- DropIndex
DROP INDEX "usuario_nome_trgm_idx";

-- AlterTable
ALTER TABLE "Avaliacao" DROP COLUMN "aluno",
DROP COLUMN "data",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usuarioId" TEXT NOT NULL,
ALTER COLUMN "comentario" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_usuarioId_instrutorId_key" ON "Avaliacao"("usuarioId", "instrutorId");

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
