import * as Contentlayer from '@/.contentlayer/generated'

import { transformBuilding, transformTour } from './transformers'

import type { Building, Tour } from './types'

/**
 * Retrieves building objects processed by Contentlayer and resolves necessary
 * post-processing properties.
 *
 * @returns Array of transformed building objects
 */
function getBuildings(): Building[] {
  return Contentlayer.allBuildings.map(transformBuilding)
}

/**
 * Retrieves tour objects processed by Contentlayer and resolves necessary
 * post-processing properties.
 *
 * @returns Array of transformed tour objects
 */
function getTours(): Tour[] {
  return Contentlayer.allTours.map(transformTour)
}

/**
 * Exports from items used in this file.
 */
export { Building, getBuildings, Tour, getTours }
