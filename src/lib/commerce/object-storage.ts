/** Persist commerce media to S3-compatible storage (Cloudflare R2, AWS S3, MinIO). */
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export function isObjectStorageConfigured() {
  return Boolean(
    process.env.S3_BUCKET?.trim() &&
      process.env.S3_ACCESS_KEY_ID?.trim() &&
      process.env.S3_SECRET_ACCESS_KEY?.trim() &&
      (process.env.S3_PUBLIC_URL?.trim() || process.env.S3_ENDPOINT?.trim())
  );
}

function publicBaseUrl() {
  const explicit = process.env.S3_PUBLIC_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const endpoint = process.env.S3_ENDPOINT?.trim().replace(/\/$/, "");
  const bucket = process.env.S3_BUCKET!.trim();
  // Fallback for path-style endpoints
  return `${endpoint}/${bucket}`;
}

function client() {
  const endpoint = process.env.S3_ENDPOINT?.trim() || undefined;
  return new S3Client({
    region: process.env.S3_REGION?.trim() || "auto",
    endpoint,
    forcePathStyle: Boolean(endpoint),
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
}

export async function putCommerceObject(input: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<string> {
  if (!isObjectStorageConfigured()) {
    throw new Error("Object storage is not configured (S3_* / Cloudflare R2)");
  }

  await client().send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      ACL: process.env.S3_ACL === "public-read" ? "public-read" : undefined,
    })
  );

  return `${publicBaseUrl()}/${input.key}`;
}
