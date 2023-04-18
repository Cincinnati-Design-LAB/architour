import * as Contentlayer from '@/.contentlayer/generated'
import { filterBuilding } from './filter-building'
import { transformBuilding } from './transform-building'

import { transformTour } from './transformer-tour'

import type { Building, Tour } from './types'
import { validateBuilding } from './validate-building'

/**
 * Retrieves building objects processed by Contentlayer and resolves necessary
 * post-processing properties.
 *
 * @returns Array of transformed building objects
 */
async function getBuildings(): Promise<Building[]> {
  const buildings = await Promise.all(Contentlayer.allBuildings.map(transformBuilding))
  return buildings.filter(filterBuilding).filter(validateBuilding)
}

/**
 * Retrieves tour objects processed by Contentlayer and resolves necessary
 * post-processing properties.
 *
 * @returns Array of transformed tour objects
 */
async function getTours(): Promise<Tour[]> {
  return await Promise.all(Contentlayer.allTours.map(transformTour))
}

/**
 * Exports from items used in this file.
 */
export { Building, getBuildings, Tour, getTours }

/**
 * Direct exports.
 */
export type { CloudinaryImage, ImageSizes } from './images'
