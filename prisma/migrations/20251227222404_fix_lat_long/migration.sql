-- DropIndex
DROP INDEX "instrutor_cidade_trgm_idx";

-- DropIndex
DROP INDEX "instrutor_estado_idx";

-- DropIndex
DROP INDEX "usuario_nome_trgm_idx";

-- AlterTable
ALTER TABLE "Instrutor" ALTER COLUMN "latitude" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitude" SET DATA TYPE DOUBLE PRECISION;
