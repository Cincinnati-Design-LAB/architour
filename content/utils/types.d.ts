import * as Contentlayer from '@/.contentlayer/generated'
import { CloudinaryImage } from './images'

export interface Building extends Omit<Contentlayer.Building, 'images'> {
  /** [Transformed] Cached number of tours. */
  tourCount: number
  /** Processed Cloudinary image URLs from public IDs in source file. */
  images: CloudinaryImage[]
  /** The first image is set as the featured image. */
  featuredImage: CloudinaryImage
}

export interface Tour extends Omit<Contentlayer.Tour, 'buildings'> {
  /** [Transformed] Building objects. */
  buildings: Building[]
}
