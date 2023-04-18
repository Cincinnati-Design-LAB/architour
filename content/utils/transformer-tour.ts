import * as Contentlayer from '@/.contentlayer/generated'
import { cloudinaryImageUrls } from './images'
import { transformBuilding } from './transform-building'
import { Tour } from './types'

/**
 * Transforms `buildings` property into rich Building objects.
 *
 * @param tour Contentlayer tour object
 * @returns Transformed tour object
 */
export async function transformTour(tour: Contentlayer.Tour): Promise<Tour> {
  const findBuilding = (filePath: string) =>
    Contentlayer.allBuildings.find((b) => b._raw.sourceFilePath === filePath)
  const buildings = await Promise.all(
    tour.buildings
      .map(findBuilding)
      .filter((x) => x)
      .map(transformBuilding),
  )
  const image = cloudinaryImageUrls(tour.image, ['card_hero', 'hero'])
  const static_map = cloudinaryImageUrls(tour.static_map, ['sidebar'])
  return { ...tour, buildings, image, static_map }
}
