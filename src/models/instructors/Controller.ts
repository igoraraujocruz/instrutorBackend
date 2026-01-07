import { Request, Response } from "express";
import { GetAllInstructors } from "./Services/GetAllInstructors";
import { FindBySlug } from "./Services/FindBySlug";

export class Controller {

  constructor(
    private getAllInstructors: GetAllInstructors,
    private findInstructorBySlug: FindBySlug
  ){
    this.getAll = this.getAll.bind(this);
    this.findBySlug = this.findBySlug.bind(this);
  }

  async getAll(req: Request, res: Response) {
    const {
      estado,
      cidade,
      q,
      page = "1",
      limit = "10",
    } = req.query as Record<string, string>;

    const instructors = await this.getAllInstructors.execute({
      estado,
      cidade,
      q,
      page,
      limit,
    });

    const formattedInstructors = {
  ...instructors,
  data: instructors.data.map((instrutor: any) => ({
    ...instrutor,
    foto: instrutor.foto
      ? `${process.env.API_URL}/uploads/avatars/${instrutor.foto}`
      : null,
  })),
};

    return res.json(formattedInstructors);
  }

  async findBySlug(req: Request, res: Response) {
    const userId = req.userId
    const slug = req.params.slug.toLowerCase();
    const instructor = await this.findInstructorBySlug.execute(slug, userId)

    const instructorFormated = {
      ...instructor,
      foto: `${process.env.API_URL}/uploads/avatars/${instructor?.foto}`
    }

    return res.json(instructorFormated);
  }
}
