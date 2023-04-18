import { EDITOR_MODE } from './constants'
import { Building } from './types'

/**
 * Determines whether to show buildings in draft mode.
 *
 * @param building Contentlayer building object
 * @returns Whether building should be shown
 */
export function filterBuilding(building: Building): boolean {
  return EDITOR_MODE ? true : building.draft !== true
}
