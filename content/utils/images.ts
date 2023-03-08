import * as Cloudinary from 'cloudinary'

/* --- Types --- */

/** Relative dimensions for a set of Cloudinary URLs. */
type CloudinaryImageCrop = '16_9' | 'square'

/** Size variations possible within each crop variation. */
type CloudinaryImageSize = 'small' | 'medium' | 'large'

/**
 * A object of Cloudinary image URLs that can be used in front-end components.
 */
export type CloudinaryImage = {
  [key in CloudinaryImageCrop]: {
    [key in CloudinaryImageSize]?: string
  }
}

/**
 * A transformation definition for a particular size, which must be further
 * contextualize by a crop.
 */
type CloudinaryImageSizeDefinition = {
  name: CloudinaryImageSize
  options: Cloudinary.TransformationOptions
}

/**
 * Transformation definitions that are used by the
 * create-cloudinary-transformation script to create transformations, and by the
 * function below to generate image URLs.
 */
type CloudinaryTransformationDefinition = {
  name: CloudinaryImageCrop
  sizes: CloudinaryImageSizeDefinition[]
}

/* --- Transformation Definitions --- */

export const TRANSFORMATIONS: CloudinaryTransformationDefinition[] = [
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
        options: { width: 100, height: 100, crop: 'fill', gravity: 'auto' },
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
  crop: CloudinaryImageCrop,
  size: CloudinaryImageSize,
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
    output[crop.name] = {}
    crop.sizes.map((size) => {
      const transformation = getTransformationName(crop.name, size.name)
      output[crop.name][size.name] = Cloudinary.v2.url(publicId, { transformation, sign_url: true })
    })
  })

  return output
}

//
// --- QUESTIONS ---
//
// 1. Do all images get the same transformations?
//    - I'm thinking no. Perhaps all transformations are defined in a single
//      object, and then each model can define which transformations it uses.
//
// 2. Is Contentlayer really the right choice here?
//    - It's a great tool, but I'm starting to do a lot of work on top of it,
//      and it's splitting behavior between two places and makes the code more
//      complex.
//    - Using Zod to validate and create base types and validate could be an
//      interesting experiment. And then build a processing engine that also has
//      a built-in lifecycle to be able to apply relationships.
//    - And still, another option is to use Stackbit Git CSI, and build from
//      that???
//

// TODO:
//
// - [x] Call this "images.ts"
// - [x] Go back to the structure of variation -> size -> options
// - [x] Add type definitions for the transformations
// - [x] Update the create-cloudinary-transformations script to:
//      - [x] Use TypeScript
//      - [x] use the new object structure
// - [x] Remove the __test__ script
// - [x] Because we want type safety, the image transformations should probably happen post-CL build
//      - [x] Which means we can go back to using `images` as the property, and overwrite the type
//        in the `Building` interface
// - [ ] Update the templates
// - [ ] Do the same thing for tours
// - [ ] Keys should event not be optional in the `CloudinaryImage` type so that the front end can
//   be confident the keys are there.
