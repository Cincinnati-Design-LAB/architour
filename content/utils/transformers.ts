import * as Contentlayer from '@/.contentlayer/generated'
import { cloudinaryImageUrls } from './images'
import { processMarkdown } from './markdown'
import { getExcerpt } from './text'
import { Building, Tour } from './types'

/**
 * Applies tour count to buildings.
 *
 * @param building Contentlayer building object
 * @returns Transformed building object
 */
export async function transformBuilding(building: Contentlayer.Building): Promise<Building> {
  const tourHasBuilding = (tour) => tour.buildings.includes(building._raw.sourceFilePath)
  const tourCount = Contentlayer.allTours.filter(tourHasBuilding).length
  const images = building.images.map((id) => cloudinaryImageUrls(id))
  const featuredImage = images[0]
  const excerpt = await processMarkdown(getExcerpt(building.body.raw))
  return { ...building, tourCount, images, featuredImage, excerpt }
}

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
  const image = cloudinaryImageUrls(tour.image)
  return { ...tour, buildings, image }
}
