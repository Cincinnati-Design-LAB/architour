import * as Contentlayer from '@/.contentlayer/generated'
import { Building, Tour } from './types'

/**
 * Applies tour count to buildings.
 *
 * @param building Contentlayer building object
 * @returns Transformed building object
 */
export function transformBuilding(building: Contentlayer.Building): Building {
  return { ...building, tourCount: 0 }
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
