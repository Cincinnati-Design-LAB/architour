import { Building } from '@/content/schema/Building';
import { IconName } from '@/content/utils/icons';
import { Markdown } from '@/content/utils/markdown';
import { CloudinaryImage } from '@content';

export type RawTour = {
  // Meta information
  file_path: string;
  // Group: Content
  title: string;
  image?: string;
  time_estimate?: string;
  icon?: IconName;
  description?: string;
  // Group: Buildings
  building_ids?: string[];
  // Group: Map
  static_map?: string;
  static_map_cache?: string;
  // Group: Settings
  draft?: boolean;
};

export interface Tour {
  /* --- Page Content --- */

  /** Name of the tour */
  title: string;
  /** Primary featured image */
  image?: CloudinaryImage;
  /** Time it takes to complete the tour when walking */
  time_estimate?: string;
  /** Short description of the tour */
  description?: Markdown;
  /** Name of the icon used for the tour */
  icon?: IconName;

  /* --- References --- */

  /**
   * List of transformed buildings, but without the cached tour count, to avoid
   * an endless transformation loop.
   */
  buildings: Building[];
  /**
   * Leftover reference from raw buildings. This gets removed during
   * transformation and will not be available after the tour has been fully
   * processed.
   */
  building_ids?: string[];

  /* --- Location --- */

  /**
   * Transformed Cloudinary image object from static map, which is built from
   * the location of all the buildings on the tour.
   */
  static_map?: CloudinaryImage<'sidebar'>;

  /* --- Meta --- */

  /** Relative path to the file from the root of the project. */
  stackbit_id: string;
  /** URL path to the detail page for the tour. */
  url_path: string;
  /** URL path to the map page for the tour. */
  map_url_path: string;
  /** File path basename without the extension */
  slug: string;
  /**
   * Indicates if the tour is ready to be published, which can affect whether
   * the build passes or not, based on validation_errors.
   */
  draft?: boolean;
  /** Validation errors that get attached when in edit mode */
  validation_errors: string[];
}
