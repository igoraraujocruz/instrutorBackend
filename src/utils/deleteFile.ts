// utils/deleteFile.ts
import fs from "fs/promises";

export async function deleteFileSafe(path?: string) {
  if (!path) return;

  try {
    await fs.unlink(path);
  } catch (err) {
    console.warn("⚠️ Falha ao deletar arquivo:", path);
  }
}
