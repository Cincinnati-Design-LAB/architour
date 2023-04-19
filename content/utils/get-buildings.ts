import * as Contentlayer from '@/.contentlayer/generated'
import { filterBuilding } from './filter-building'
import { transformBuilding } from './transform-building'

import type { Building } from './types'
import { validateBuilding } from './validate-building'

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
