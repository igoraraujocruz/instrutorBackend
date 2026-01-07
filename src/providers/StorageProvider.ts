import fs from "fs";
import path from "path";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";
import { uploadDir } from "../config/upload";

export class StorageProvider {
  async delete(fileUrl: string) {
    if (!fileUrl) return;

    // 🔥 DEV (arquivo local)
    if (process.env.NODE_ENV !== "production") {
      const filePath = fileUrl.replace(
        `${process.env.API_URL}/uploads/`,
        ""
      );

      const absolutePath = path.resolve(uploadDir, filePath);

      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
      }

      return;
    }

    // 🔥 PROD (S3)
    if (s3) {
      const key = fileUrl.split(".amazonaws.com/")[1];

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET!,
          Key: key,
        })
      );
    }
  }
}

