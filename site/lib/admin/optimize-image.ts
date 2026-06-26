import sharp from "sharp";

/**
 * Compress an uploaded image to WebP before storing it.
 *
 * Admin users (the client) may upload raw photos straight from a phone or
 * camera — often 3–8 MB. Serving those unprocessed tanks mobile LCP and
 * fails Core Web Vitals. We re-encode every upload to WebP and cap the
 * dimensions so storage always holds a web-ready asset, regardless of what
 * was uploaded.
 *
 * Returns the WebP bytes plus the storage extension/contentType to use.
 */
export async function optimizeToWebp(
  file: File,
  maxWidth: number,
): Promise<{ buffer: Buffer; ext: "webp"; contentType: "image/webp" }> {
  const input = Buffer.from(await file.arrayBuffer());
  const buffer = await sharp(input)
    .rotate() // honour EXIF orientation
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toBuffer();
  return { buffer, ext: "webp", contentType: "image/webp" };
}

/** Max widths per content type — portraits stay smaller than wide hero shots. */
export const IMAGE_MAX_WIDTH = {
  doctor: 1000,
  review: 600,
  service: 1400,
  blog: 1600,
} as const;
