import path from "path";
import { randomUUID } from "crypto";

export function sanitizeFilename(originalName: string) {
  const ext = path.extname(originalName);

  const name = path
    .basename(originalName, ext)
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "-") // remove especiais
    .replace(/-+/g, "-")
    .toLowerCase();

  return `${randomUUID()}-${name}${ext}`;
}
