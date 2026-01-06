import { prisma } from "../../lib/prisma";
import { Avaliacao } from "@prisma/client";

export class RatingRepository {
    async create({ 
      comentario,
      instrutorId,
      nota,
      usuarioId
     }: Omit<Avaliacao, 'id' | 'createdAt' | 'updatedAt'| 'deletedAt'>) {
        
          const rating = await prisma.avaliacao.create({
          data: {
            nota,
            comentario,
            instrutorId,
            usuarioId
          }
        });
    
        return rating;

      }

      async findUserId(usuarioId: string): Promise<Avaliacao | null> {
          const rating = await prisma.avaliacao.findFirst({
            where: {
              usuarioId
            },
          });
      
          return rating;
      }

    async delete(avaliacaoId: string): Promise<void> {
      await prisma.avaliacao.update({
        where: { id: avaliacaoId },
        data: {
          deletedAt: new Date(),
        },
      });
    }


}