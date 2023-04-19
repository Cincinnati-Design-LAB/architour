import * as Contentlayer from '@/.contentlayer/generated'
import { filterBuilding } from './filter-building'
import { getBuildings } from './get-buildings'
import { cloudinaryImageUrls } from './images'
import { transformBuilding } from './transform-building'
import { Building, Tour } from './types'

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
  const buildings = tour.buildings.map(findBuilding)
  const image = cloudinaryImageUrls(tour.image, ['card_hero', 'hero'])
  const static_map = cloudinaryImageUrls(tour.static_map, ['sidebar'])
  return { ...tour, buildings, image, static_map }
}
