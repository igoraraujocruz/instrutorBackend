import { User } from "../../users/interfaces";
import { InstrutorRepository } from "../InstructorRepository";

export class FindBySlug {
    constructor(
        private repository: InstrutorRepository
    ){}
    
    async execute(slug: string, userId?: string) {

        const instructor = await this.repository.findBySlug(slug, userId);

        return instructor
    }
}