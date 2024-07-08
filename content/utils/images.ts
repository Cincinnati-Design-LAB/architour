import * as Cloudinary from 'cloudinary';

/**
 * Transforms a public ID into a full Cloudinary CDN URL.
 *
 * @param publicId Public ID of the image in Cloudinary defined in the source
 * file.
 * @returns Full URL to the image.
 */
export function cloudinaryImageUrl(publicId: string): string {
  if (!publicId) return null;
  return Cloudinary.v2.url(publicId, { secure: true });
}
