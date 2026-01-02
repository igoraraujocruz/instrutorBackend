import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { errors as celebrateErrors, isCelebrateError } from "celebrate";
import usersRouter from "./Users/routes";
import instrutoresRouter from "./routes/instrutores";
import { AppError } from "./utils/AppError";
import { ValidationError } from "./utils/ValidationError";
import { rateLimiterMiddleware } from "./rateLimiter";
import { uploadDir } from "./config/upload";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;



app.use("/uploads", express.static(uploadDir));


app.use(
  cors({
    origin: process.env.SITE_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(rateLimiterMiddleware);
app.use(morgan("dev"));

app.use("/usuarios", usersRouter);
app.use("/instrutores", instrutoresRouter);

app.get("/", (_, res) => {
  res.send("Servidor rodando!");
});

app.use(celebrateErrors());

app.use(
  (error: Error, _: Request, response: Response, __: NextFunction) => {
    if (isCelebrateError(error)) {
      const validation = error.details.values().next().value;
      const message =
        validation?.details?.[0]?.message?.replace(/"/g, "") ||
        "Erro de validação.";

      return response.status(400).json({
        status: "error",
        type: "validation",
        message,
      });
    }

    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: "error",
        message: error.message,
      });
    }

    if (error instanceof ValidationError) {
      return response.status(error.statusCode).json({
        errors: error.errors, // ⚡ aqui direto
      });
    }

    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
);

async function startServer() {
  try {
    await prisma.$connect();
    const query = await prisma.$queryRaw`SELECT 1`;
    if(query) {
      console.log(
        `✅ Conectado ao Banco de Dados`
      );
    } else {
        `❌ Conexão do Banco de Dados Falhou!`
    }

    app.listen(PORT, () => {
      console.log(
        `🚀 Servidor rodando em http://localhost:${PORT} | NODE_ENV=${process.env.NODE_ENV}`
      );
    });
  } catch (error) {
    console.error("❌ Erro ao conectar no banco:", error);
    process.exit(1); // encerra a aplicação
  }
}

startServer();
