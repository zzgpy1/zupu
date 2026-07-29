export async function uploadToR2(file: File, key: string): Promise<string> {
  // @ts-ignore
  const bucket = process.env.R2_BUCKET;
  if (!bucket) {
    throw new Error('R2 bucket not bound');
  }

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  await bucket.put(key, uint8Array, {
    httpMetadata: { contentType: file.type },
  });

  // 如果 R2 桶公开，直接拼接 URL；否则需要生成签名 URL
  const publicUrl = `https://your-r2-public-domain.com/${key}`; // 请替换
  return publicUrl;
}
