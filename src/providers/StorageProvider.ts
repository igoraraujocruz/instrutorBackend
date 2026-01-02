import fs from "fs";
import path from "path";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";
import { uploadDir } from "../config/upload";

export class StorageProvider {
  async delete(fileKey: string) {
    if (!fileKey) return;

    // 🔥 DEV - arquivo local
    if (process.env.NODE_ENV !== "production") {
      console.log(uploadDir)
      console.log(fileKey)

      const filePath = path.resolve(uploadDir, fileKey);

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }

      return;
    }

    // 🔥 PROD - S3
    if (s3) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET!,
          Key: fileKey,
        })
      );
    }
  }
}
