import * as Contentlayer from '@/.contentlayer/generated'
import { getBuildings } from './buildings'
import { EDITOR_MODE } from './constants'
import { cloudinaryImageUrls } from './images'

import type { Building, Tour } from './types'

/**
 * Retrieves tour objects processed by Contentlayer and resolves necessary
 * post-processing properties.
 *
 * @returns Array of transformed tour objects
 */
export async function getTours(): Promise<Tour[]> {
  const tours = await Promise.all(Contentlayer.allTours.map(transformTour))
  return tours.filter(filterTour).filter(validateTour)
}

/**
 * Transforms `buildings` property into rich Building objects.
 *
 * @param tour Contentlayer tour object
 * @returns Transformed tour object
 */
export async function transformTour(tour: Contentlayer.Tour): Promise<Tour> {
  const allBuildings = await getBuildings()
  const findBuilding = (filePath: string): Building => {
    return allBuildings.find((b) => b._raw.sourceFilePath === filePath)
  }
  const buildings = tour.buildings.map(findBuilding).filter(Boolean)
  const image = cloudinaryImageUrls(tour.image, ['card_hero', 'hero'])
  const static_map = cloudinaryImageUrls(tour.static_map, ['sidebar'])
  return { ...tour, buildings, image, static_map }
}

/**
 * Determines whether to show tours in draft mode.
 *
 * @param tour Contentlayer tour object
 * @returns Whether tour should be shown
 */
export function filterTour(tour: Tour | Contentlayer.Tour): boolean {
  return EDITOR_MODE ? true : tour.draft !== true
}

/**
 * Throws an error if tour does not meet minimum requirements for content.
 *
 * @param tour Contentlayer tour object
 * @returns Transformed tour object
 */
export function validateTour(tour: Tour): boolean {
  // TODO: Add validation logic here. Consider if in edit mode or not.
  //
  // TODO: Would be cool to attach a property to a tour when we're in edit
  // mode if: (1) it's a draft (warning) (2) it doesn't pass validation
  // (warning), or (3) it fails validation AND is set to be published (error).
  return true
}
