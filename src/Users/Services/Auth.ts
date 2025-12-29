import { Create } from "./Create";
import jwt from "jsonwebtoken";

export class Auth {
    constructor(
        private createService: Create
    ){}

    async execute(provider: string, providerId: string, nome: string, email: string, foto?: string) {
        const user = await this.createService.execute(provider, providerId, nome, email, foto);

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