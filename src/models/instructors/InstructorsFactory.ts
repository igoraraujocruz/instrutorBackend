import { InstrutorRepository } from "./InstructorRepository";
import { GetAllInstructors } from "./Services/GetAllInstructors";
import { Controller } from "./Controller";
import { FindBySlug } from "./Services/FindBySlug";

const instructorsRepository = new InstrutorRepository();

const getInstructors = new GetAllInstructors(instructorsRepository);
const findBySlug = new FindBySlug(instructorsRepository)

export const instructorController = new Controller(
 getInstructors,
 findBySlug
);
