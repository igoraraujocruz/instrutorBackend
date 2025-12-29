import { v4 as uuidv4 } from "uuid";
import { slugify } from "../src/utils/slugify";
import { prisma } from "../src/lib/prisma";

// ========================
// FUNÇÕES AUXILIARES
// ========================
function gerarCPF(): string {
  const rand = () => Math.floor(Math.random() * 9);

  const cpf = Array.from({ length: 9 }, rand);

  const calcDigito = (base: number[]) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += base[i] * (base.length + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  cpf.push(calcDigito(cpf));
  cpf.push(calcDigito(cpf));

  return cpf.join("");
}

// ========================
// DADOS AUXILIARES
// ========================
const nomesPorEstado: Record<
  string,
  {
    first: { nome: string; gender: "men" | "women" }[];
    last: string[];
  }
> = {
  es: {
    first: [
      { nome: "Lucas", gender: "men" },
      { nome: "Ana", gender: "women" },
      { nome: "Carlos", gender: "men" },
      { nome: "Mariana", gender: "women" },
      { nome: "Paulo", gender: "men" },
      { nome: "Fernanda", gender: "women" },
      { nome: "Gustavo", gender: "men" },
      { nome: "Patrícia", gender: "women" },
      { nome: "Rafael", gender: "men" },
      { nome: "Juliana", gender: "women" },
    ],
    last: [
      "Pereira",
      "Alves",
      "Lima",
      "Costa",
      "Barbosa",
      "Mendes",
      "Silva",
      "Ribeiro",
      "Souza",
      "Freitas",
    ],
  },
};

// Cidades
const cidades: Record<string, string[]> = {
  es: [
    "Vitória",
    "Serra",
    "Vila Velha",
    "Cariacica",
    "Guarapari",
    "Linhares",
    "Colatina",
    "Aracruz",
    "São Mateus",
    "Cachoeiro de Itapemirim",
  ],
};

const descricoes = [
  "Instrutor experiente e dedicado.",
  "Aulas práticas e objetivas.",
  "Foco total na aprovação do aluno.",
  "Mais de 10 anos de experiência.",
];

const comentarios = [
  "Ótimo instrutor, super paciente.",
  "Aulas práticas e muito claras.",
  "Recomendadíssimo!",
  "Excelente experiência.",
  "Muito bom, me ajudou muito.",
];

// ========================
// CONFIGURAÇÃO DE ESTADOS
// ========================
const estadoInstrutores: Record<string, number> = {
  es: 40,
  sp: 50,
  rj: 20,
  mg: 25,
  ba: 15,
  pr: 10,
  sc: 10,
  rs: 10,
};

// ========================
// SEED
// ========================
async function main() {
  const slugsGerados = new Set<string>();
  let contador = 1;

  for (const estadoUF of Object.keys(estadoInstrutores)) {
    const quantidade = estadoInstrutores[estadoUF];
    const nomes = nomesPorEstado[estadoUF];
    const listaCidades = cidades[estadoUF];

    if (!nomes || !listaCidades || quantidade === 0) continue;

    for (let i = 0; i < quantidade; i++) {
      const firstNameObj = nomes.first[i % nomes.first.length];
      const lastName = nomes.last[i % nomes.last.length];
      const nome = `${firstNameObj.nome} ${lastName}`;

      const gender = firstNameObj.gender;
      const foto = `https://randomuser.me/api/portraits/${gender}/${(contador % 99) + 1}.jpg`;

      // 🔁 alternância de provider
      const provider = contador % 2 === 0 ? "facebook" : "google";

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          cpf: gerarCPF(),
          telefone: `(27) 9${Math.floor(10000000 + Math.random() * 90000000)}`,
          provider,
          providerId: uuidv4(),
          foto,
        },
      });

      const cidade = listaCidades[i % listaCidades.length];
      const cidadeSlug = slugify(cidade);

      const nomeSlugBase = slugify(nome);
      let slug = nomeSlugBase;
      let inc = 1;

      while (slugsGerados.has(slug)) {
        slug = `${nomeSlugBase}-${inc++}`;
      }

      slugsGerados.add(slug);

      const instrutor = await prisma.instrutor.create({
        data: {
          estado: estadoUF,
          cidade,
          cidadeSlug,
          classe: String(Math.floor(Math.random() * 3) + 1),
          descricao: descricoes[i % descricoes.length],
          preco: Math.floor(Math.random() * 150) + 50,
          latitude: +((-20 + Math.random() * 5).toFixed(6)),
          longitude: +((-40 + Math.random() * 5).toFixed(6)),
          slug,
          usuarioId: usuario.id,
        },
      });

      const numAvaliacoes =
        Math.random() < 0.2 ? 0 : Math.floor(Math.random() * 10);

      for (let j = 0; j < numAvaliacoes; j++) {
        await prisma.avaliacao.create({
          data: {
            aluno: `Aluno ${Math.floor(Math.random() * 1000)}`,
            nota: Math.floor(Math.random() * 5) + 1,
            comentario:
              comentarios[Math.floor(Math.random() * comentarios.length)],
            data: new Date(
              Date.now() - Math.floor(Math.random() * 10_000_000_000)
            ),
            instrutorId: instrutor.id,
          },
        });
      }

      contador++;
    }
  }

  console.log("✅ Seed executada com sucesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
