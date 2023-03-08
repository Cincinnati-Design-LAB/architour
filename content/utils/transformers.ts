import * as Contentlayer from '@/.contentlayer/generated'
import { cloudinaryImageUrls } from './images'
import { Building, Tour } from './types'

/**
 * Applies tour count to buildings.
 *
 * @param building Contentlayer building object
 * @returns Transformed building object
 */
export function transformBuilding(building: Contentlayer.Building): Building {
  const tourHasBuilding = (tour) => tour.buildings.includes(building._raw.sourceFilePath)
  const tourCount = Contentlayer.allTours.filter(tourHasBuilding).length
  const images = building.images.map((id) => cloudinaryImageUrls(id))
  const featuredImage = images[0]
  return { ...building, tourCount, images, featuredImage }
}

/**
 * Transforms `buildings` property into rich Building objects.
 *
 * @param tour Contentlayer tour object
 * @returns Transformed tour object
 */
export function transformTour(tour: Contentlayer.Tour): Tour {
  const findBuilding = (filePath: string) =>
    Contentlayer.allBuildings.find((b) => b._raw.sourceFilePath === filePath)
  const buildings = tour.buildings
    .map(findBuilding)
    .filter((x) => x)
    .map(transformBuilding)
  return { ...tour, buildings }
}
