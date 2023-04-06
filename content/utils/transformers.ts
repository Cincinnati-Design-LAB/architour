import * as Contentlayer from '@/.contentlayer/generated'
import { cloudinaryImageUrls } from './images'
import { mapMarkerData } from './map'
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
  const images = building.images.map((id) => cloudinaryImageUrls(id, ['gallery_item']))
  const featuredImage = cloudinaryImageUrls(building.images[0], [
    'card_thumb',
    'compact_card_hero',
    'hero',
    'sidebar',
  ])
  const excerpt = await processMarkdown(getExcerpt(building.body.raw))
  const mapMarker = mapMarkerData({
    excerpt: excerpt,
    image: featuredImage,
    location: building.location,
    title: building.title,
    urlPath: building.urlPath,
  })
  const static_map = cloudinaryImageUrls(building.static_map, ['sidebar'])
  return { ...building, tourCount, images, featuredImage, excerpt, mapMarker, static_map }
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
  const image = cloudinaryImageUrls(tour.image, ['card_hero', 'hero'])
  const static_map = cloudinaryImageUrls(tour.static_map, ['sidebar'])
  return { ...tour, buildings, image, static_map }
}
