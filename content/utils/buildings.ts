import * as Contentlayer from '@/.contentlayer/generated'
import { EDITOR_MODE } from './constants'
import { cloudinaryImageUrls } from './images'
import { mapMarkerData } from './map'
import { processMarkdown } from './markdown'
import { getExcerpt } from './text'
import { filterTour, getTours } from './tours'
import { Building, Tour } from './types'

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

/* ----- Pagination ----- */

type BuildingCollectionOptions = {}

type BuildingCollection = {
  buildings: Building[]
  totalPages: number
  page: number
}

/**
 * Sort, filter, and paginate a list of buildings.
 *
 * @param options Sorting and filtering options
 * @returns A list of filtered and sorted buildings
 */
export async function getBuildingPages(
  options: BuildingCollectionOptions,
): Promise<BuildingCollection[]> {
  const buildings = await getBuildings()
  const buildingsPerPage = 12
  const totalPages = Math.ceil(buildings.length / buildingsPerPage)
  return Array.from({ length: totalPages }).map((_, i) => ({
    buildings: buildings.slice(i * buildingsPerPage, (i + 1) * buildingsPerPage),
    totalPages,
    page: i + 1,
  }))
}

/**
 * Gets all building collections and then returns buildings for a specific page.
 *
 * @param options Sorting and filtering options
 * @returns A list of buildings for a particular page
 */
export async function getBuildingsOnPage(
  options: BuildingCollectionOptions & { page: number },
): Promise<Building[]> {
  const buildingPages = await getBuildingPages(options)
  if (options.page > buildingPages.length) {
    throw new Error(`Page ${options.page} does not exist.`)
  }
  return buildingPages[options.page - 1].buildings
}

/* ----- Transformer ----- */

/**
 * Applies tour count to buildings.
 *
 * @param building Contentlayer building object
 * @returns Transformed building object
 */
export async function transformBuilding(building: Contentlayer.Building): Promise<Building> {
  let tourHasBuilding, tourCount, images, featuredImage, excerpt, mapMarker, static_map
  try {
    tourHasBuilding = (tour) => (tour.buildings || []).includes(building.stackbitId)
    tourCount = Contentlayer.allTours.filter(filterTour).filter(tourHasBuilding).length
    if (building.images) {
      images = (building.images || []).map((id) => cloudinaryImageUrls(id, ['gallery_item']))
    }
    if (building.images && building.images[0]) {
      featuredImage = cloudinaryImageUrls(building.images[0], [
        'card_thumb',
        'compact_card_hero',
        'hero',
        'sidebar',
      ])
    }
    if (building.body?.raw) excerpt = await processMarkdown(getExcerpt(building.body.raw))
    if (building.location?.lat && building.location?.lng) {
      mapMarker = mapMarkerData({
        excerpt: excerpt,
        image: featuredImage,
        location: building.location,
        title: building.title,
        urlPath: building.urlPath,
      })
    }
    if (building.static_map) static_map = cloudinaryImageUrls(building.static_map, ['sidebar'])
    return { ...building, tourCount, images, featuredImage, excerpt, mapMarker, static_map }
  } catch (err) {
    console.error(
      'Building:',
      {
        name: building.title,
        tourHasBuilding,
        tourCount,
        images,
        featuredImage,
        excerpt,
        mapMarker,
        static_map,
      },
      '\n',
    )
    throw new Error(`Error transforming building: ${building.urlPath}`)
  }
}

/* ----- References ----- */

/**
 * Retrieves transformed tours that include a building.
 *
 * @param building Transformed building
 * @returns List of tours that include the building
 */
export async function getBuildingTours(building: Building): Promise<Tour[]> {
  const tourHasBuilding = (tour: Tour) => {
    return tour.buildings.map((t) => t.stackbitId).includes(building.stackbitId)
  }
  const tours = await getTours()
  return tours.filter(tourHasBuilding)
}

/* ----- Filters ----- */

/**
 * Determines whether to show buildings in draft mode.
 *
 * @param building Contentlayer building object
 * @returns Whether building should be shown
 */
export function filterBuilding(building: Building): boolean {
  return EDITOR_MODE ? true : building.draft !== true
}

/* ----- Validators ----- */

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
  if (!building.images || building.images.length < 1) {
    building.validation_errors.push('Must have at least one image')
  }

  // Keep the validation errors on the building, but don't throw an error in
  // editor mode.
  if (EDITOR_MODE) return true
  // Throw an error if there are validation errors when not in editor mode.
  if (building.validation_errors.length > 0) {
    throw new Error(`Validation failed.\n${building.validation_errors.join('\n')}`)
  }

  return true
}
