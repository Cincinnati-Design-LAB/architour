import { Building } from './types'

/**
 * Throws an error if building does not meet minimum requirements for content.
 *
 * @param building Contentlayer building object
 * @returns Transformed building object
 */
export function validateBuilding(building: Building): boolean {
  // TODO: Add validation logic here. Consider if in edit mode or not.
  //
  // TODO: Would be cool to attach a property to a building when we're in edit
  // mode if: (1) it's a draft (warning) (2) it doesn't pass validation
  // (warning), or (3) it fails validation AND is set to be published (error).
  return true
}
