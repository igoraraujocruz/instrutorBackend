import { Usuario } from "@prisma/client";
import { StorageProvider } from "../../../providers/StorageProvider";
import { AppError } from "../../../utils/AppError";
import { UserRepository } from "../UserRepository";

interface UpdateAvatarInput {
  userId: string;
  file?: Express.Multer.File;
}

export class UpdateAvatar {
  constructor(
    private userRepository: UserRepository,
    private storageProvider: StorageProvider
  ) {}

  async execute({ userId, file }: UpdateAvatarInput): Promise<Usuario> {
  if (!file) {
    throw new AppError("Arquivo de imagem não enviado");
  }

  const user = await this.userRepository.findById(userId);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  // 🔥 Remove avatar antigo
  if (user.foto) {
    await this.storageProvider.delete(user.foto);
  }

  // 🔥 URL FINAL DA FOTO
  const fotoUrl =
    process.env.NODE_ENV === "production"
      ? (file as any).location
      : `${process.env.API_URL}/uploads/avatars/${file.filename}`;

  // 🔥 Salva URL COMPLETA no banco
  const updatedUser = await this.userRepository.updateAvatar(
    userId,
    fotoUrl
  );

  return updatedUser;
}

}
