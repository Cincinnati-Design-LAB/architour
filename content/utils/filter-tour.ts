import { EDITOR_MODE } from './constants'
import { Tour } from './types'

/**
 * Determines whether to show tours in draft mode.
 *
 * @param tour Contentlayer tour object
 * @returns Whether tour should be shown
 */
export function filterTour(tour: Tour): boolean {
  return EDITOR_MODE ? true : tour.draft !== true
}
