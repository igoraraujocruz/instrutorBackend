import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../UserRepository";
import { AppError } from "../../../utils/AppError";

export async function ensureUserHasNoCertificate(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const certificado = req.file

if(!req.userId) {
    throw new AppError('UserId não encontrado')
}

  const userId = req.userId

  const userRepository = new UserRepository()

  const user = await userRepository.findById(userId)

  if (!user?.instrutor) {
    return next();
  }

  if (user.instrutor.certificadoCodigo && certificado) {
    throw new AppError(
      "Este usuário já possui um certificado cadastrado",
      400
    );
  }

  return next();
}
