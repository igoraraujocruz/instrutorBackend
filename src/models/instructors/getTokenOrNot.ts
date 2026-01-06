import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export function getTokenOrNot(
  req: any,
  _res: Response,
  next: NextFunction
) {
  req.userId = null;

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.API_JWT_SECRET!
    ) as { userId: string };

    req.userId = decoded.userId;
  } catch {
    // token inválido → mantém null
    req.userId = null;
  }

  return next();
}
