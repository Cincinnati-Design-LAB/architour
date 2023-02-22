import * as Contentlayer from '@/.contentlayer/generated'

export interface Building extends Contentlayer.Building {
  /** [Transformed] Cached number of tours. */
  tourCount: number
}

export interface Tour extends Omit<Contentlayer.Tour, 'buildings'> {
  /** [Transformed] Building objects. */
  buildings: [Building]
}
