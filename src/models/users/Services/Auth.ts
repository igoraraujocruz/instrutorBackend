import { Create } from "./Create";
import jwt from "jsonwebtoken";

interface FindOrCreateUserDTO {
  provider: string
  providerId: string
  nome: string
  email: string
  foto?: string
}

export class Auth {
    constructor(
        private createService: Create
    ){}

    async execute(data: FindOrCreateUserDTO) {
    
        const user = await this.createService.execute(data);

          if (!user) {
            throw new Error("Falha ao autenticar usuário");
          }

        const token = jwt.sign(
            { userId: user.id },
            process.env.API_JWT_SECRET!,
            { expiresIn: "7d" }
        );

        return {
            user,
            token
        }
    }
}