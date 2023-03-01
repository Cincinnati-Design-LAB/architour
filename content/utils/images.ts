import { v2 as cloudinary } from 'cloudinary'

/**
 * Generate Cloudinary image URL based on public ID.
 *
 * @param publicId Path to the image in Cloudinary
 * @param options {
 *    width: number -> width of the image
 *    height: number -> height of the image
 *    focus?: 'center' | 'smart' -> focus point of the crop
 * }
 * @returns Modified image URL
 */
export function croppedImageUrl(
  publicId: string,
  options: { width: number; height: number },
): string {
  const { width, height } = options
  return cloudinary.url(publicId, { height, width, crop: 'fill' })
}
