import * as Contentlayer from '@/.contentlayer/generated'
import { filterTour } from './filter-tour'

import { transformTour } from './transformer-tour'

import type { Tour } from './types'
import { validateTour } from './validate-tour'

/**
 * Retrieves tour objects processed by Contentlayer and resolves necessary
 * post-processing properties.
 *
 * @returns Array of transformed tour objects
 */
export async function getTours(): Promise<Tour[]> {
  const tours = await Promise.all(Contentlayer.allTours.map(transformTour))
  return tours.filter(filterTour).filter(validateTour)
}
