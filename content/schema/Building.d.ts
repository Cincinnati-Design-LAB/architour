import { RawLocation } from '@/content/schema/Location';
import { CloudinaryImage } from '@/content/utils/images';
import { MapMarker } from '@/content/utils/map';
import { Markdown } from '@/content/utils/markdown';

export type RawBuilding = {
  /** Parse body of the markdown file */
  content: string;

  title: string;
  images?: string[];
  completion_date?: string;
  // sections?: Array<RawBuildingAttributeSection | RawBuildingRenovationSection>

  address?: string;
  location?: RawLocation;
  static_map?: string;
  static_map_cache?: string;

  draft?: boolean;
};

export interface Building {
  //
  /* --- Text Content --- */

  completion_date?: string;
  address?: string;

  name: string;
  /** [Transformed] Cached number of tours. */
  tourCount: number;
  /** Processed Cloudinary image URLs from public IDs in source file. */
  images: CloudinaryImage<'gallery_item'>[];
  /** The first image is set as the featured image. */
  featuredImage?: CloudinaryImage<'card_thumb' | 'compact_card_hero' | 'hero' | 'sidebar'>;
  /** Convert first clause from the body as the excerpt */
  excerpt?: Markdown;
  /** Details that can be used directly on the map */
  mapMarker?: MapMarker;
  // sections?: Array<BuildingAttributeSection | BuildingRenovationSection>

  /* --- Location --- */

  /** Transformed Cloudinary image object from static map */
  staticMap?: CloudinaryImage<'sidebar'>;

  /* --- Meta --- */

  /** Relative path to the file from the root of the project. */
  stackbitId: string;
  /** URL path to the detail page for the building. */
  urlPath: string;
  /** File path basename without the extension */
  slug: string;
  /**
   * Indicates if the building is ready to be published, which can affect
   * whether the build passes or not, based on validation_errors.
   */
  draft?: boolean;
  /** Validation errors that get attached when in edit mode */
  // validation_errors?: string[];
}
