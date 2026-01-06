import { Avaliacao } from "@prisma/client";
import { RatingRepository } from "../RatingRepository";
import { AppError } from "../../../utils/AppError";
import { InstrutorRepository } from "../../instructors/InstructorRepository";
import { UserRepository } from "../../users/UserRepository";

export class Create {
    constructor(
        private repository: RatingRepository,
        private userRepository: UserRepository
    ){}
    
    async execute({ comentario, instrutorId, nota, usuarioId }: Omit<Avaliacao, 'id'| 'createdAt' | 'updatedAt' | 'deletedAt'>) {

        const findRating = await this.repository.findUserId(usuarioId)
        const user = await this.userRepository.findById(usuarioId)

        if(findRating) {
            throw new AppError('Não é possível avaliar mais de uma vez')
        }


        if(user?.cpf == null || user?.telefone == null) {
            throw new AppError('Perfil incompleto. Falta telefone e/ou CPF')
        }


        const rating = await this.repository.create({
            nota,
            comentario,
            instrutorId,
            usuarioId,
        });

        return rating
    }
}