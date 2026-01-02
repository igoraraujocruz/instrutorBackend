import { AppError } from "../../utils/AppError";
import { UserRepository } from "../UserRepository";
import { ValidationError } from "../../utils/ValidationError";
import { UploadCertificate } from "./UploadCertificate";

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
  certificado?: Express.Multer.File;
}

export class UpdateUser {
  constructor(private userRepository: UserRepository,
    private uploadCertificate: UploadCertificate
  ) {}

  async execute(data: UpdateUserRequest) {
    const { userId, telefone, cpf, email, slug, nome, certificado } = data;

    const errors: Record<string, string> = {};

    if (telefone) {
      const exists = await this.userRepository.findByPhone(telefone, userId);
      if (exists) errors.telefone = "Telefone já cadastrado";
    }

    if (cpf) {
      const exists = await this.userRepository.findByCPF(cpf, userId);
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

   // validações simples primeiro
if (Object.keys(errors).length > 0) {
  throw new ValidationError(errors);
}

let certificadoCodigo = "";

if (certificado) {
  try {
    const result = await this.uploadCertificate.execute(certificado, {
      nome,
      cpf,
    });

    certificadoCodigo = result.certificadoCodigo;
  } catch (err: any) {
    errors.certificado = err.message;
  }
}

if (Object.keys(errors).length > 0) {
  throw new ValidationError(errors);
}

const dataComCertificado = {
  ...data,
  ...(certificado && {
    certificadoCodigo,
    certificado: certificado.filename as any,
  }),
};

const userUpdated = await this.userRepository.update(dataComCertificado);

if (!userUpdated) {
  throw new AppError("Erro ao atualizar usuário");
}

return userUpdated;

  }
}
