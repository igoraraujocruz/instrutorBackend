import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { errors as celebrateErrors, isCelebrateError } from "celebrate";
import usersRouter from "./Users/routes";
import instrutoresRouter from "./routes/instrutores";
import { AppError } from "./utils/AppError";
import { ValidationError } from "./utils/ValidationError";
import { uploadDir } from "./config/upload";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use("/uploads", express.static(uploadDir));

app.use(cors());
app.use(express.json());
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

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
