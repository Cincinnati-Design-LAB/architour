import * as Contentlayer from '@/.contentlayer/generated';
import { CloudinaryImage } from './images';
import { MapMarker } from './map';
import { Markdown } from './markdown';

export interface Building extends Omit<Contentlayer.Building, 'images'> {
  /** [Transformed] Cached number of tours. */
  tourCount: number;
  /** Processed Cloudinary image URLs from public IDs in source file. */
  images: CloudinaryImage<'gallery_item'>[];
  /** The first image is set as the featured image. */
  featuredImage: CloudinaryImage<'card_thumb' | 'compact_card_hero' | 'hero' | 'sidebar'>;
  /** Convert first clause from the body as the excerpt */
  excerpt?: Markdown;
  /** Details that can be used directly on the map */
  mapMarker: MapMarker;
  /** Transformed Cloudinary image object from static map */
  static_map: CloudinaryImage<'sidebar'>;
  /** Validation errors that get attached when in edit mode */
  validation_errors?: string[];
}

export interface Tour extends Omit<Contentlayer.Tour, 'buildings' | 'image'> {
  /** [Transformed] Building objects. */
  buildings: Building[];
  /** Processed Cloudinary image URL from public ID in source file. */
  image: CloudinaryImage<'card_hero' | 'hero'>;
  /** Transformed Cloudinary image object from static map */
  static_map: CloudinaryImage<'sidebar'>;
  /** Validation errors that get attached when in edit mode */
  validation_errors?: string[];
}

export interface SiteConfig extends Contentlayer.SiteConfig {}
