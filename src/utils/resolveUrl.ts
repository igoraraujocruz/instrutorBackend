export function resolveUrl(foto: string | null) {
  if (!foto) return null;

  if (process.env.NODE_ENV === "production") {
    return `${process.env.AWS_BUCKET_URL}/avatars/${foto}`;
  }

  return `${process.env.API_URL}/uploads/avatars/${foto}`;
}
