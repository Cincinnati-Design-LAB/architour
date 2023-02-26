/**
 * Apply uploadcare image transformations to the original image URL.
 *
 * @param originalImageUrl Raw image URL from the source
 * @param options {
 *    width: number -> width of the image
 *    height: number -> height of the image
 *    focus?: 'center' | 'smart' -> focus point of the crop
 * }
 * @returns Modified image URL
 */
export function croppedImageUrl(
  originalImageUrl: string,
  options: { width: number; height: number; focus?: 'center' | 'smart' },
): string {
  const { width, height, focus = 'smart' } = options
  return originalImageUrl + `-/scale_crop/${width}x${height}/${focus}/`
}
