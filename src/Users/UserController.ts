import { Request, Response } from "express";
import { UpdateUser } from "./Services/Update";
import { FindById } from "./Services/FindById";
import { Auth } from "./Services/Auth";
import { UpdateAvatar } from "./Services/UpdateAvatar";

export class UserController {

  constructor(
    private userAuth: Auth,
    private userUpdate: UpdateUser,
    private userFind: FindById,
    private userUpdateAvatar: UpdateAvatar,
  ){
    this.auth = this.auth.bind(this);
    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this);
  }

  async auth(req: Request, res: Response) {
    const data = req.body;
    const user = await this.userAuth.execute(data);

    return res.status(200).json(user);
  }

  async get(req: Request, res: Response) {
    const usuario = await this.userFind.execute(req.userId!);

    return res.json(usuario);
  }

  async update(req: Request, res: Response) {
    
    const data = {
    userId: req.userId,
    ...req.body,
    certificado: req.file,
  };

  console.log(data)

    const user = await this.userUpdate.execute(data)

    return res.json(user);
  }

   async updateAvatar(req: Request, res: Response) {
    const user = await this.userUpdateAvatar.execute({
      userId: req.userId!,
      file: req.file,
    });

    return res.json(user);
  }
}
