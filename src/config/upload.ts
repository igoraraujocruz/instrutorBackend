import multer from "multer";
import path from "path";
import multerS3 from "multer-s3";
import { s3 } from "./s3";
import { sanitizeFilename } from "../utils/sanitizeFilename";

export const uploadDir = path.resolve(__dirname, "..", "..", "temp", "uploads");
const isProduction = process.env.NODE_ENV === "production";

/**
 * Retorna um storage do multer configurado para S3 ou local
 * @param folder Nome da pasta dentro do bucket ou local
 */
const getStorage = (folder: string) => {
  if (isProduction && s3) {
    return multerS3({
      s3,
      bucket: process.env.AWS_BUCKET!,
      acl: "public-read",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const filename = sanitizeFilename(file.originalname);
        cb(null, `${folder}/${filename}`);
      },
    });
  } else {
    return multer.diskStorage({
      destination: path.join(uploadDir, folder),
      filename: (req, file, cb) => {
        const filename = sanitizeFilename(file.originalname);
        cb(null, filename);
      },
    });
  }
};

export const uploadAvatar = multer({ storage: getStorage("avatars") });
export const uploadCertificado = multer({ storage: getStorage("certificados") });
