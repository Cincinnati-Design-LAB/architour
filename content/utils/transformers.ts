import * as Contentlayer from '@/.contentlayer/generated'
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
  return { ...building, tourCount }
}

/**
 * Transforms `buildings` property into rich Building objects.
 *
 * @param tour Contentlayer tour object
 * @returns Transformed tour object
 */
export function transformTour(tour: Contentlayer.Tour): Tour {
  return { ...tour, buildings: [transformBuilding(Contentlayer.allBuildings[0])] }
}
