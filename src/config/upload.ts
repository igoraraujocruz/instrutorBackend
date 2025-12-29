import multer from "multer";
import path from "path";
import multerS3 from "multer-s3";
import { s3 } from "./s3";
import { sanitizeFilename } from "../utils/sanitizeFilename";

export const uploadDir = path.resolve(
  __dirname,
  "..",
  "..",
  "tmp",
  "uploads"
);

const isProduction = process.env.NODE_ENV === "production";

export const upload = multer({
  storage: isProduction && s3
    ? multerS3({
        s3,
        bucket: process.env.AWS_BUCKET!,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
          const filename = sanitizeFilename(file.originalname);
          cb(null, `avatars/${filename}`);
        },
      })
    : multer.diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const filename = sanitizeFilename(file.originalname);
          cb(null, filename);
        },
      }),
});
