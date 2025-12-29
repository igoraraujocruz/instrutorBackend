import { S3Client } from "@aws-sdk/client-s3";

let s3: S3Client | null = null;

if (process.env.NODE_ENV === "production") {
  s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

export { s3 };
