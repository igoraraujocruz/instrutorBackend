import { AppError } from "../../utils/AppError";
import { UserRepository } from "../UserRepository";
import { ValidationError } from "../../utils/ValidationError";

interface UpdateUserRequest {
  userId: string;
  nome?: string;
  telefone?: string;
  cpf?: string;
  email?: string;
  estado?: string;
  cidade?: string;
  descricao?: string;
  preco?: number;
  slug?: string;
}

export class UpdateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UpdateUserRequest) {
    const { userId, telefone, cpf, email, slug } = data;

    const errors: Record<string, string> = {};

    if (telefone) {
      const exists = await this.userRepository.findByPhone(telefone, userId);
      if (exists) errors.telefone = "Telefone já cadastrado";
    }

    if (cpf) {
      const exists = await this.userRepository.findByCPF(cpf);
      if (exists) errors.cpf = "CPF já cadastrado";
    }

    if (email) {
      const exists = await this.userRepository.findByEmail(email);
      if (exists) errors.email = "Email já cadastrado";
    }

    if (slug) {
      const exists = await this.userRepository.findBySlug(slug);
      if (exists) errors.slug = "Slug já cadastrado";
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors); // ⚡ lança direto
    }

    const userUpdated = await this.userRepository.update(data);

    if (!userUpdated) {
      throw new AppError("Erro ao atualizar usuário");
    }

    return userUpdated;
  }
}
