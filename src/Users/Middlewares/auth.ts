import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token ausente" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.API_JWT_SECRET!
    ) as { userId: string };

    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}
