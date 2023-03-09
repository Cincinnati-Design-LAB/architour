import * as Contentlayer from '@/.contentlayer/generated'

import { transformBuilding, transformTour } from './transformers'

import type { Building, Tour } from './types'

/**
 * Retrieves building objects processed by Contentlayer and resolves necessary
 * post-processing properties.
 *
 * @returns Array of transformed building objects
 */
async function getBuildings(): Promise<Building[]> {
  return await Promise.all(Contentlayer.allBuildings.map(transformBuilding))
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
export type { CloudinaryImage } from './images'
