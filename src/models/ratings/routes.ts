import { Router } from "express";
import { ratingController } from "./RatingFactory";
import { celebrate, Joi, Segments } from "celebrate";
import { ensureIsNotInstructor } from "./middleware";
import { authMiddleware } from "../users/Middlewares/auth";

const router = Router();

router.post(
  "/",
  authMiddleware,
  ensureIsNotInstructor,
   celebrate({
      [Segments.BODY]: {
        comentario: Joi.string().optional(),
        instrutorId: Joi.string().required(),
        nota: Joi.number().required(),
      },
    }),
  ratingController.create
);

export default router;
