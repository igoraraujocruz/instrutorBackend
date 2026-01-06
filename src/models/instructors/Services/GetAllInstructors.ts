import { GetAllInstructorsProps, InstrutorRepository } from "../InstructorRepository";

export class GetAllInstructors {
    constructor(
        private instructorRepository: InstrutorRepository
    ){}

    async execute({ estado, cidade, q, page, limit }: GetAllInstructorsProps) {

        const instructors = await this.instructorRepository.getAll({
            estado,
            limit,
            page,
            cidade,
            q
        })

        return instructors
    }
}