import { prisma } from "../lib/prisma";
import { slugify } from '../utils/slugify'
import { CreateProps, UserUpdate, Usuario } from "./interfaces";
import { GeoService } from "./Services/GeoService";


export class UserRepository {
  async findByPhone(phone: string, userId: string): Promise<Usuario | null> {
    const user = await prisma.usuario.findFirst({
      where: {
        telefone: phone,
        NOT: { id: userId },
      },
    });

    return user;
}


  async findByCPF(userId:string, cpf: string): Promise<Usuario | null> {
      const user = await prisma.usuario.findFirst({
          where: { cpf,
            id: {
              not: userId,
            },
           },
          include: { instrutor: true },
      });

      return user;
  }

     async findByEmail(email: string): Promise<Usuario | null> {

        const user = await prisma.usuario.findFirst({
            where: { email },
            include: { instrutor: true },
        });
        
        return user;
    }

    async findBySlug(slug: string) {
        const user = await prisma.instrutor.findUnique({ where: { slug } });

        return user;
    }


async update(user: UserUpdate): Promise<Usuario | null> {
  const {
    userId,
    nome,
    telefone,
    cpf,
    email,
    estado,
    cidade,
    descricao,
    preco,
    slug,
    latitude,
    longitude,
    certificado,
    certificadoCodigo
  } = user;

  const precoNumber = preco !== undefined ? Number(preco) : undefined;

  const geoService = new GeoService();

  // prioridade: frontend → fallback geo
  let lat = latitude;
  let lng = longitude;

  if (estado && cidade && (lat === undefined || lng === undefined)) {
    const coords = await geoService.getLatLng(estado, cidade);
    if (coords) {
      lat = coords.lat;
      lng = coords.lng;
    }
  }

  const userUpdated = await prisma.usuario.update({
    where: { id: userId },
    data: {
      ...(nome !== undefined && { nome }),
      ...(telefone !== undefined && { telefone }),
      ...(cpf !== undefined && { cpf }),
      ...(email !== undefined && { email }),

      instrutor:
        slug !== undefined ||
        estado !== undefined ||
        cidade !== undefined ||
        descricao !== undefined ||
        preco !== undefined ||
        lat !== undefined ||
        lng !== undefined
          ? {
              upsert: {
                create: {
  slug: slug ?? `instrutor-${Date.now()}`,
  estado: estado ?? "",
  cidade: cidade ?? "",
  cidadeSlug: cidade ? slugify(cidade) : "cidade-nao-informada",
  descricao: descricao ?? "",
  preco: precoNumber ?? 0,
  classe: "default",
  latitude: lat ?? 0,
  longitude: lng ?? 0,
  ...(certificadoCodigo && { certificadoCodigo }),
  ...(certificado && { certificado }),
},
                update: {
  ...(slug && { slug }),
  ...(estado && { estado }),
  ...(cidade && { cidade, cidadeSlug: slugify(cidade) }),
  ...(descricao && { descricao }),
  ...(precoNumber !== undefined && { preco: precoNumber }),
  ...(lat !== undefined && { latitude: lat }),
  ...(lng !== undefined && { longitude: lng }),
  ...(certificadoCodigo && { certificadoCodigo }),
  ...(certificado && { certificado }), // precisa ser string
},

              },
            }
          : undefined,
    },
    include: { instrutor: true },
  });

  return userUpdated;
}


    async findById(userId: string): Promise<Usuario | null> {
        try {
          const user = await prisma.usuario.findUnique({
            where: { id: userId },
            include: {
              instrutor: true
            }
          });
        
          return user;
        }catch(err) {
          console.log(err)
        }
        return null;
    }

    async findByProvider(provider: string, providerId: string): Promise<Usuario | null> {

        const user = await prisma.usuario.findUnique({
            where: {
                provider_providerId: {
                    provider,
                    providerId,
                },
            },
            include: {
              instrutor: true
            }
        });
        
        return user;

    }

  async create({ provider, providerId, nome, email, foto }: CreateProps) {
    try {
      const user = await prisma.usuario.create({
      data: {
        provider,
        providerId,
        nome,
        email,
        foto
      }
    });

    return user;
    }catch(err) {
      console.log(err)
    }
  }

async updateAvatar(userId: string, foto: string): Promise<Usuario> {
  const user = await prisma.usuario.update({
    where: { id: userId },
    data: { foto },
    include: {
      instrutor: true,
    },
  });

  return user;
}

}