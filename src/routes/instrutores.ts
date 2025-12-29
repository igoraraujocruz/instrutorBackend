import { Router } from "express";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
import { invalidateUsuariosCache } from "../lib/cache";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const {
      estado,
      cidade,
      q,
      page = "1",
      limit = "10",
    } = req.query as Record<string, string>;

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
    if (cached) return res.json(JSON.parse(cached));

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
          aluno: true,
          nota: true,
          comentario: true,
          data: true,
        },
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

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar instrutores" });
  }
});



/**
 * POST /instrutores/avaliacoes
 * Cria avaliação para um instrutor
 */
router.post("/avaliacoes", async (req, res) => {
  try {
    const { usuarioId, ...avaliacaoData } = req.body;
    if (!usuarioId) return res.status(400).json({ error: "usuarioId é obrigatório" });

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { instrutor: true },
    });

    if (!usuario?.instrutor) return res.status(400).json({ error: "Usuário não é instrutor" });

    const avaliacao = await prisma.avaliacao.create({
      data: { ...avaliacaoData, instrutorId: usuario.instrutor.id },
      include: { instrutor: true },
    });

    if (usuario.instrutor.estado) {
      await invalidateUsuariosCache(usuario.instrutor.estado);
    }

    res.status(201).json(avaliacao);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao criar avaliação" });
  }
});

/**
 * GET /instrutores/:slug
 *
 */
router.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const cacheKey = `usuarios:slug:${slug}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const usuario = await prisma.usuario.findFirst({
      where: {
        instrutor: {
          slug
        },
      },
      include: {
        instrutor: {
          include: {
            avaliacoes: true,
          },
        },
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Instrutor não encontrado" });
    }

    await redis.set(cacheKey, JSON.stringify(usuario), "EX", 60);

    res.json(usuario);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao buscar instrutor" });
  }
});


export default router;
