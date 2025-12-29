-- Ativando extensões
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Função IMMUTABLE wrapper para ignorar acentos
CREATE OR REPLACE FUNCTION immutable_unaccent(text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT unaccent($1);
$$;

-- Índices fuzzy para Usuario (nome)
CREATE INDEX IF NOT EXISTS usuario_nome_trgm_idx
ON "Usuario"
USING GIN (nome gin_trgm_ops);

CREATE INDEX IF NOT EXISTS usuario_nome_unaccent_trgm_idx
ON "Usuario"
USING GIN (immutable_unaccent(nome) gin_trgm_ops);

-- Índices fuzzy para Instrutor (cidade)
CREATE INDEX IF NOT EXISTS instrutor_cidade_trgm_idx
ON "Instrutor"
USING GIN (cidade gin_trgm_ops);

CREATE INDEX IF NOT EXISTS instrutor_cidade_unaccent_trgm_idx
ON "Instrutor"
USING GIN (immutable_unaccent(cidade) gin_trgm_ops);

-- Índice simples para estado do Instrutor
CREATE INDEX IF NOT EXISTS instrutor_estado_idx
ON "Instrutor"(estado);
