import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const REGION      = process.env.SPACES_REGION      || 'fra1';
const BUCKET      = process.env.SPACES_BUCKET      || 'malikina-audio';
const ACCESS_KEY  = process.env.SPACES_ACCESS_KEY  || '';
const SECRET_KEY  = process.env.SPACES_SECRET_KEY  || '';

// Direct Spaces URL (no CDN prefix) — CDN not enabled on this bucket
export const CDN_BASE = `https://${BUCKET}.${REGION}.digitaloceanspaces.com`;

const client = new S3Client({
  endpoint: `https://${REGION}.digitaloceanspaces.com`,
  region: REGION,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
  forcePathStyle: false,
});

export async function uploadToSpaces(
  buffer: Buffer,
  key: string,          // ex: "audios/xassida-42-1234.mp3"
  contentType: string
): Promise<string> {
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read',
  }));
  return `${CDN_BASE}/${key}`;
}

export async function deleteFromSpaces(key: string): Promise<void> {
  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export function keyFromUrl(url: string): string | null {
  if (!url.includes(CDN_BASE)) return null;
  return url.replace(`${CDN_BASE}/`, '');
}
