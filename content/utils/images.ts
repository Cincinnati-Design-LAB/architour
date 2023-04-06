import * as Cloudinary from 'cloudinary'

/* --- References --- */

// Multipliers for image sizes
const SIZE_VARIATIONS: Array<'1x' | '2x' | '3x'> = ['1x', '2x', '3x']
// Keys used to create image variations
const CROP_NAMES: Array<
  'card_hero' | 'card_thumb' | 'compact_card_hero' | 'gallery_item' | 'hero' | 'sidebar'
> = ['card_hero', 'card_thumb', 'compact_card_hero', 'gallery_item', 'hero', 'sidebar']

/* --- Output Types --- */

/**
 * The allowed names of image sizes, which are used to create URL shapes that
 * can be used in front-end components.
 */
type SizeVariation = (typeof SIZE_VARIATIONS)[number]

/**
 * Every image key has a set of sizes that can be used in front-end components.
 */
export type ImageSizes = { [key in SizeVariation]: string }

/**
 * A object of Cloudinary image URLs that can be used in front-end components.
 */
// TODO -> This should use image keys as an argument
export type CloudinaryImage<C extends CropName> = { [key in C]: ImageSizes }

/* --- Transformation Definitions --- */

/**
 * The allowed names of crop definitions, which are used selectively to create
 * URL shapes that can be used in front-end components.
 */
type CropName = (typeof CROP_NAMES)[number]

/**
 * Transformation definitions that are used by the
 * create-cloudinary-transformation script to create transformations, and by the
 * function below to generate image URLs.
 */
type CropDefinition = { name: CropName; options: Cloudinary.ImageTransformationOptions }

/* --- Transformation Definitions --- */

export const TRANSFORMATIONS: CropDefinition[] = [
  {
    name: 'sidebar',
    options: { width: 672, height: 378, crop: 'fill', gravity: 'auto' },
  },
  {
    name: 'gallery_item',
    options: { width: 736, height: 414, crop: 'fill', gravity: 'auto' },
  },
  {
    name: 'hero',
    options: { width: 1408, height: 792, crop: 'fill', gravity: 'auto' },
  },
  {
    name: 'card_hero',
    options: { width: 592, height: 333, crop: 'fill', gravity: 'auto' },
  },
  {
    name: 'card_thumb',
    options: { width: 64, height: 64, crop: 'fill', gravity: 'auto' },
  },
  {
    name: 'compact_card_hero',
    options: { width: 300, height: 300, crop: 'fill', gravity: 'auto' },
  },
]

/* --- Helper Functions --- */

/**
 * Consistent way to make sure we're using the same transformation names when
 * creating and reading them through the Cloudinary API.
 *
 * @param crop Crop variation name
 * @param dpr DPR image variation name
 * @returns Interpolated transformation name
 */
export function getTransformationName(crop: CropName, dpr: SizeVariation): string {
  return `${crop}_${dpr}`
}

/**
 * Consistent way to make sure we're using the same transformation names when
 * creating and reading them through the Cloudinary API.
 *
 * @param crop Crop variation name
 * @param options Image transformation options
 * @returns An array of transformation names and options for DPR variations
 */
export function getTransformationDprVariations(
  crop: CropName,
  options: Cloudinary.ImageTransformationOptions,
): Array<{ name: string; options: Cloudinary.ImageTransformationOptions }> {
  return SIZE_VARIATIONS.map((dpr) => {
    const name = getTransformationName(crop, dpr)
    const width = parseInt(options.width.toString()) * parseInt(dpr)
    const height = parseInt(options.height.toString()) * parseInt(dpr)
    return { name, options: { ...options, width, height } }
  })
}

/**
 * Transforms a public ID into a set of Cloudinary image URLs that can be used
 * by the front end.
 *
 * @param publicId Public ID of the image in Cloudinary defined in the source
 * file.
 * @returns Image object with URLs for each crop and size.
 */

// TODO -> Step #2: Accept a list of crops, and only return those crops. Need to
// make the typing dynamic for this.
export function cloudinaryImageUrls(
  publicId: string,
  cropNames: CropName[] = CROP_NAMES,
): CloudinaryImage<(typeof cropNames)[number]> {
  let output = {} as CloudinaryImage<(typeof cropNames)[number]>

  TRANSFORMATIONS.filter((crop) => cropNames.includes(crop.name)).map((crop) => {
    output[crop.name] = Object.fromEntries(
      SIZE_VARIATIONS.map((dpr) => {
        const transformation = getTransformationName(crop.name, dpr)
        const imageUrl = Cloudinary.v2.url(publicId, {
          transformation,
          sign_url: true,
          secure: true,
        })
        return [dpr, imageUrl]
      }),
    ) as ImageSizes
  })

  return output
}
