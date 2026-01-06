import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import { UserRepository } from "../users/UserRepository";

export async function ensureIsNotInstructor(
  req: Request,
  res: Response,
  next: NextFunction
) {

if(!req.userId) {
    throw new AppError('UserId não encontrado')
}

  const userId = req.userId

  const userRepository = new UserRepository()

  const user = await userRepository.findById(userId)

   if (user?.instrutor) {
    throw new AppError(
      "Instrutores não podem avaliar",
      400
    );
  }

  return next();
}
