import fs from "fs";
import path from "path";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";
import { uploadDir } from "../config/upload";

export class StorageProvider {
  async delete(fileUrl: string) {
    if (!fileUrl) return;

    // 🔥 DEV - arquivo local
    if (fileUrl.includes("/uploads/")) {
      const filename = fileUrl.split("/uploads/")[1];
      const filePath = path.resolve(uploadDir, filename);

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }

      return;
    }

    // 🔥 PROD - S3
    if (process.env.NODE_ENV === "production" && s3) {
      const key = fileUrl.split(".amazonaws.com/")[1];

      if (!key) return;

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET!,
          Key: key,
        })
      );
    }
  }
}
