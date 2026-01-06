import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../../../utils/AppError";

type AuthRequest = Request & { userId: string };

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): asserts req is AuthRequest {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token ausente", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.API_JWT_SECRET!
    ) as { userId: string };

    req.userId = decoded.userId;

    if (!req.userId) {
      throw new AppError("Token inválido", 401);
    }

    next();
  } catch {
    throw new AppError("Token inválido", 401);
  }
}
