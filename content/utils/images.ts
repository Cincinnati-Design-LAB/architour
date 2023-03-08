import * as Cloudinary from 'cloudinary'

/* --- Output Types --- */

/**
 * A object of Cloudinary image URLs that can be used in front-end components.
 */
export type CloudinaryImage = {
  '16_9': { large: string }
  square: { small: string }
}

/* --- Transformation Definitions --- */

/**
 * Defines the Cloudinary transformation options for a particular size, which
 * must be contextual within a specific crop.
 */
type CropDefinitionSizes<AllowedSizes> = Array<{
  name: AllowedSizes
  options: Cloudinary.TransformationOptions
}>

/**
 * Transformation definitions that are used by the
 * create-cloudinary-transformation script to create transformations, and by the
 * function below to generate image URLs.
 */
type CropDefinition =
  | { name: 'square'; sizes: CropDefinitionSizes<'small'> }
  | { name: '16_9'; sizes: CropDefinitionSizes<'large'> }

/* --- Transformation Definitions --- */

export const TRANSFORMATIONS: CropDefinition[] = [
  {
    name: '16_9',
    sizes: [
      {
        name: 'large',
        options: { width: 1200, height: 675, crop: 'fill', gravity: 'auto' },
      },
    ],
  },
  {
    name: 'square',
    sizes: [
      {
        name: 'small',
        options: { width: 120, height: 120, crop: 'fill', gravity: 'auto' },
      },
    ],
  },
]

/* --- Helper Functions --- */

/**
 * Consistent way to make sure we're using the same transformation names when
 * creating and reading them through the Cloudinary API.
 *
 * @param crop Crop variation name
 * @param size Size variation name
 * @returns Interpolated transformation name
 */
export function getTransformationName(
  crop: CropDefinition['name'],
  size: CropDefinition['sizes'][number]['name'],
): string {
  return `${crop}_${size}`
}

/**
 * Transforms a public ID into a set of Cloudinary image URLs that can be used
 * by the front end.
 *
 * @param publicId Public ID of the image in Cloudinary defined in the source
 * file.
 * @returns Image object with URLs for each crop and size.
 */
export function cloudinaryImageUrls(publicId: string): CloudinaryImage {
  let output = {} as CloudinaryImage

  TRANSFORMATIONS.map((crop) => {
    output[crop.name] = Object.fromEntries(
      crop.sizes.map((size) => {
        const transformation = getTransformationName(crop.name, size.name)
        return [size.name, Cloudinary.v2.url(publicId, { transformation, sign_url: true })]
      }),
    )
  })

  return output
}
