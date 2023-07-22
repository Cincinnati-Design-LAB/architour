import {
  BuildingAttributeSection,
  RawBuildingAttributeSection,
} from '@/content/schema/BuildingAttributeSection';
import {
  BuildingRenovationSection,
  RawBuildingRenovationSection,
} from '@/content/schema/BuildingRenovationSection';
import { Location, RawLocation } from '@/content/schema/Location';
import { CloudinaryImage } from '@/content/utils/images';
import { MapMarker } from '@/content/utils/map';
import { Markdown } from '@/content/utils/markdown';

export type BuildingPageLocation = 'above_images' | 'below_images' | 'above_map' | 'below_map';

export type RawBuilding = {
  /** Parse body of the markdown file */
  content: string;
  // Group: Content
  title: string;
  images?: string[];
  completion_date?: string;
  sections?: Array<RawBuildingAttributeSection | RawBuildingRenovationSection>;
  // Group: Location
  address?: string;
  location?: RawLocation;
  static_map?: string;
  static_map_cache?: string;
  // Group: Settings
  draft?: boolean;
};

export interface Building {
  //
  /* --- Page Content --- */

  /** Name of the building */
  title: string;
  /** Raw completion date for the building */
  completion_date?: string;
  /** Process the raw content as a markdown object */
  body: Markdown;
  /** Convert first clause from the body as the excerpt */
  excerpt: Markdown;
  /** Dynamic content areas for the detail page. */
  sections?: Record<
    BuildingPageLocation,
    Array<BuildingAttributeSection | BuildingRenovationSection>
  >;
  /** Processed Cloudinary image URLs from public IDs in source file. */
  images: CloudinaryImage<'gallery_item'>[];
  /** The first image is set as the featured image. */
  featured_image?: CloudinaryImage<'card_thumb' | 'compact_card_hero' | 'hero' | 'sidebar'>;

  /* --- References --- */

  /** Cached number of tours. */
  tour_count: number;

  /* --- Location --- */

  /** Raw address for the building */
  address?: string;
  /** Coordinates for the building */
  location?: Location;
  /** Details that can be used directly on the map */
  map_marker?: MapMarker;
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
