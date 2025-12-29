import { Usuario } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../utils/AppError";
import { UserRepository } from "../UserRepository";

export class FindById {
  constructor(
    private userRepository: UserRepository
  ){}

  async execute(userId: string): Promise<Usuario> {
    const user = await this.userRepository.findById(userId);

    if(!user) {
      throw new AppError('Usuário não encontrado')
    }

    return user;
  }
}