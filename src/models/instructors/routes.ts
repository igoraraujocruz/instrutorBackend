import { Router } from "express";
import { instructorController } from "./InstructorsFactory";
import { getTokenOrNot } from "./getTokenOrNot";

const router = Router();

router.get(
  "/",
  instructorController.getAll
);

router.get(
  "/:slug",
  getTokenOrNot,
  instructorController.findBySlug
);


export default router;
