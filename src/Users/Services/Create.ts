import { Usuario } from "@prisma/client";
import { UserRepository } from "../UserRepository";

export class Create {
    constructor(
        private userRepository: UserRepository
    ) {}

    async execute(provider: string, providerId: string, nome: string, email: string, foto?: string): Promise<Usuario> {
        let user = await this.userRepository.findByProvider(provider, providerId);

        console.log(user)

        if(!user) {
            console.log('LEUUU AQUII')
           user = await this.userRepository.create({
                provider, providerId, nome, email, foto
            })
        }

        return user
    } 
}