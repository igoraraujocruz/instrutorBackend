import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { authMiddleware } from "./Middlewares/auth";
import { userController } from "./UserFactory";
import { uploadAvatar, uploadCertificado } from "../../config/upload";
import { ensureUserHasNoCertificate } from "./Middlewares/ensureUserHasNoCertificate";

const router = Router();

router.post(
  "/auth",
  celebrate({
    [Segments.BODY]: {
      provider: Joi.string().required(),
      providerId: Joi.string().required(),
      nome: Joi.string().required(),
      email: Joi.string().email().allow(null).optional(),
      foto: Joi.string().allow(null).optional(),
    },
  }),
  userController.auth
);

router.get("/me", authMiddleware, userController.get);

router.put(
  "/me",
  authMiddleware,
  uploadCertificado.single("certificado"),
  celebrate({
    [Segments.BODY]: Joi.object({      
    nome: Joi.string().optional(),
    telefone: Joi.string().pattern(/^[0-9]{11}$/).optional(),
    cpf: Joi.string().pattern(/^[0-9]{11}$/).optional(),
    email: Joi.string().email().optional(),

    estado: Joi.string().optional(),
    cidade: Joi.string().optional(),

    descricao: Joi.string().optional(),
    preco: Joi.number().optional(),
    certificado: Joi.allow(),
    slug: Joi.string()
      .lowercase()
      .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
  })
    .and("estado", "cidade")
    .messages({
      "object.and": "Estado e cidade devem ser enviados juntos",
    }),
  }),
  ensureUserHasNoCertificate,
  userController.update
);

router.patch(
  "/avatar",
  authMiddleware,
  uploadAvatar.single("foto"),
  userController.updateAvatar
);


export default router;
