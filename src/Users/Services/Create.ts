
import { UserRepository } from "../UserRepository";

interface FindOrCreateUserDTO {
  provider: string
  providerId: string
  nome: string
  email: string
  foto?: string
}


export class Create {
    constructor(
        private userRepository: UserRepository
    ) {}

    async execute(data: FindOrCreateUserDTO) {
        const { provider, providerId, nome, email, foto } = data

        console.log(data)


         const existingUser = await this.userRepository.findByProvider(
            provider,
            providerId
        )

         if (existingUser) {
            return existingUser
        }

        const user = await this.userRepository.create({
            provider,
            providerId,
            nome,
            email,
            foto,
        })

        console.log('leu aquiiii')
        console.log(user)

        return user
    } 
}