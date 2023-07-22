import {
  BuildingAttributeSections,
  RawBuildingAttributeSection,
} from '@/content/schema/BuildingAttributeSection';
import { RawBuildingRenovationSection } from '@/content/schema/BuildingRenovationSection';
import { Location, RawLocation } from '@/content/schema/Location';
import { CloudinaryImage } from '@/content/utils/images';
import { MapMarker } from '@/content/utils/map';
import { Markdown } from '@/content/utils/markdown';

export type RawBuilding = {
  /** Parse body of the markdown file */
  content: string;

  title: string;
  images?: string[];
  completion_date?: string;
  sections?: Array<RawBuildingAttributeSection | RawBuildingRenovationSection>;

  address?: string;
  location?: RawLocation;
  static_map?: string;
  static_map_cache?: string;

  draft?: boolean;
};

export interface Building {
  //
  /* --- Text Content --- */

  /** Raw completion date for the building */
  completion_date?: string;
  /** Raw address for the building */
  address?: string;
  /** Coordinates for the building */
  location?: Location;
  /** Name of the building */
  title: string;
  /** Cached number of tours. */
  tour_count: number;
  /** Processed Cloudinary image URLs from public IDs in source file. */
  images: CloudinaryImage<'gallery_item'>[];
  /** The first image is set as the featured image. */
  featured_image?: CloudinaryImage<'card_thumb' | 'compact_card_hero' | 'hero' | 'sidebar'>;
  /** Process the raw content as a markdown object */
  body: Markdown;
  /** Convert first clause from the body as the excerpt */
  excerpt: Markdown;
  /** Details that can be used directly on the map */
  map_marker?: MapMarker;
  /** Dynamic content areas for the detail page. */
  sections?: BuildingAttributeSections;

  /* --- Location --- */

  /** Transformed Cloudinary image object from static map */
  static_map?: CloudinaryImage<'sidebar'>;

  /* --- Meta --- */

  /** Relative path to the file from the root of the project. */
  stackbit_id: string;
  /** URL path to the detail page for the building. */
  url_path: string;
  /** File path basename without the extension */
  slug: string;
  /**
   * Indicates if the building is ready to be published, which can affect
   * whether the build passes or not, based on validation_errors.
   */
  draft?: boolean;
  /** Validation errors that get attached when in edit mode */
  validation_errors: string[];
}
