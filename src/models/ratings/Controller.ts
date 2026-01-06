import { Request, Response } from "express";
import { Create } from "./Services/Create";

export class Controller {

  constructor(
    private createRating: Create,
  ){
    this.create = this.create.bind(this);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { 
      comentario, 
      instrutorId,
      nota
     } = req.body;

     const userId = req.userId  as string

    const rating = await this.createRating.execute({
      comentario,
      instrutorId,
      nota,
      usuarioId: userId
    })

    return res.json(rating);
  } 
}
