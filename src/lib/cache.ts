// src/lib/cache.ts
import { redis } from "./redis";

export async function invalidateUsuariosCache(estado: string) {
  const pattern = `usuarios:list:estado=${estado}:*`;
  const keys = await redis.keys(pattern);

  if (keys.length > 0) {
    await redis.del(keys);
  }
}

export async function invalidateUsuarioIdCache(usuarioId: string) {
  await redis.del(`usuarios:id:${usuarioId}`);
}
