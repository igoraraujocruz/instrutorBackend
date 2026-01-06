import { redis } from "../../lib/redis";
import { prisma } from "../../lib/prisma";
import { Avaliacao, Instrutor, Usuario } from "@prisma/client";

export interface GetAllInstructorsProps {
    estado: string;
    cidade?: string;
    q?: string;
    page: string;
    limit: string;
}

export type InstrutorComAvaliado = Instrutor & {
  avaliado: boolean;
  avaliacoes: Avaliacao[];
};

export type UsuarioComInstrutorAvaliado = Usuario & {
  instrutor: InstrutorComAvaliado;
};

export class InstrutorRepository {
    async getAll({ estado, limit, page, cidade, q }: GetAllInstructorsProps) {
  
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;
  
      const where = {
    ...(estado && { instrutor: { estado: estado.toLowerCase() } }),
    ...(cidade && { instrutor: { cidadeSlug: cidade.toLowerCase() } }),
    ...(q && {
      OR: [
        { nome: { contains: q.trim(), mode: "insensitive" as const } },
        { instrutor: { slug: { contains: q.trim(), mode: "insensitive" as const } } },
      ],
    }),
  };
  
  
      const cacheKey = `usuarios:list:${JSON.stringify({ estado, cidade, q, pageNum, limitNum })}`;
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached)
  
      const [totalItems, data] = await prisma.$transaction([
        prisma.usuario.count({ where }),
        prisma.usuario.findMany({
          where,
          select: {
            id: true,
    nome: true,
    telefone: true,
    foto: true,
    instrutor: {
      select: {
        estado: true,
        cidade: true,
        cidadeSlug: true,
        classe: true,
        descricao: true,
        preco: true,
        latitude: true,
        longitude: true,
        slug: true,
        avaliacoes: {
          select: {
            id: true,
            nota: true,
          },
          where: {
            deletedAt: null,
          }
        },
      },
    },
          },
          skip,
          take: limitNum,
          orderBy: { id: "asc" },
        }),
      ]);
  
      const response = {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages: Math.ceil(totalItems / limitNum),
        data,
      };
  
      await redis.set(cacheKey, JSON.stringify(response), "EX", 60);
  
      return response
    }


    async findBySlug(
  slug: string,
  userId?: string | null
) {
  // Buscar usuário e instrutor com todas as informações necessárias internamente
  const usuario = await prisma.usuario.findFirst({
    where: { instrutor: { slug } },
    select: {
      id: true,
      nome: true,
      telefone: true,
      foto: true,
      instrutor: {
        select: {
          id: true,
          estado: true,
          cidade: true,
          cidadeSlug: true,
          classe: true,
          descricao: true,
          preco: true,
          latitude: true,
          longitude: true,
          slug: true,
          avaliacoes: {
            select: {
              id: true,
              nota: true,
              usuarioId: true, // manter temporariamente para calcular "avaliado"
            },
            where: {
            deletedAt: null,
          }
          },
        },
      },
    },
  });

  if (!usuario || !usuario.instrutor) return null;

  // Verifica se o usuário logado já avaliou
  const avaliado =
    !!userId &&
    usuario.instrutor.avaliacoes.some(a => a.usuarioId === userId);

  // Mapear instrutor para retornar apenas o que queremos no front
  const instrutorFiltrado = {
    id: usuario.instrutor.id,
    estado: usuario.instrutor.estado,
    cidade: usuario.instrutor.cidade,
    cidadeSlug: usuario.instrutor.cidadeSlug,
    classe: usuario.instrutor.classe,
    descricao: usuario.instrutor.descricao,
    preco: usuario.instrutor.preco,
    latitude: usuario.instrutor.latitude,
    longitude: usuario.instrutor.longitude,
    slug: usuario.instrutor.slug,
    avaliado, // nossa flag
    avaliacoes: usuario.instrutor.avaliacoes.map(a => ({
      id: a.id,
      nota: a.nota,
    })),
  };

  const usuarioComFlag = {
    id: usuario.id,
    nome: usuario.nome,
    telefone: usuario.telefone,
    foto: usuario.foto,
    instrutor: instrutorFiltrado,
  };

  return usuarioComFlag;
}


    async getById(id: string): Promise<Instrutor | null> {
      const instructor = await prisma.instrutor.findUnique({
        where: { id: id },
      })

      return instructor;
    }
}