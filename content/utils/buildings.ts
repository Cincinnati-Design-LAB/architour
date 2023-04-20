import * as Contentlayer from '@/.contentlayer/generated'
import { EDITOR_MODE } from './constants'
import { cloudinaryImageUrls } from './images'
import { mapMarkerData } from './map'
import { processMarkdown } from './markdown'
import { getExcerpt } from './text'
import { filterTour } from './tours'
import { Building } from './types'

/**
 * Retrieves building objects processed by Contentlayer and resolves necessary
 * post-processing properties.
 *
 * @returns Array of transformed building objects
 */
export async function getBuildings(): Promise<Building[]> {
  const buildings = await Promise.all(Contentlayer.allBuildings.map(transformBuilding))
  return buildings.filter(filterBuilding).filter(validateBuilding)
}

/**
 * Applies tour count to buildings.
 *
 * @param building Contentlayer building object
 * @returns Transformed building object
 */
export async function transformBuilding(building: Contentlayer.Building): Promise<Building> {
  const tourHasBuilding = (tour) => tour.buildings.includes(building._raw.sourceFilePath)
  const tourCount = Contentlayer.allTours.filter(filterTour).filter(tourHasBuilding).length
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
 * Determines whether to show buildings in draft mode.
 *
 * @param building Contentlayer building object
 * @returns Whether building should be shown
 */
export function filterBuilding(building: Building): boolean {
  return EDITOR_MODE ? true : building.draft !== true
}

/**
 * Throws an error if building does not meet minimum requirements for content.
 *
 * @param building Contentlayer building object
 * @returns Transformed building object
 */
export function validateBuilding(building: Building): boolean {
  building.validation_errors = []

  // The following fields are required
  const requiredFields = ['title', 'address', 'completion_date', 'static_map']
  for (const field of requiredFields) {
    if (!building[field]) building.validation_errors.push(`Missing required field: ${field}`)
  }
  // `body` is a structured field
  if (!building.body?.raw) building.validation_errors.push('Missing required field: body')
  // Latitude and longitude must be set
  if (!building.location?.lat || !building.location?.lng) {
    building.validation_errors.push('Location has not been set')
  }
  // Must have at least one image
  if (building.images.length < 1) building.validation_errors.push('Must have at least one image')

  // Keep the validation errors on the building, but don't throw an error in
  // editor mode.
  if (EDITOR_MODE) return true
  // Throw an error if there are validation errors when not in editor mode.
  if (building.validation_errors.length > 0) {
    throw new Error(`Validation failed.\n${building.validation_errors.join('\n')}`)
  }

  return true
}
