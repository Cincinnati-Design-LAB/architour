import { Building } from '@/content/schema/Building';
import type { RawTour, Tour } from '@/content/schema/Tour';
import { EDITOR_MODE, ROOT_DIR } from '@/content/utils/constants';
import { cloudinaryImageUrls } from '@/content/utils/images';
import { processMarkdown } from '@/content/utils/markdown';
import path from 'path';

/* ----- Transformer ----- */

type TourTransformerOptions = {
  raw: RawTour;
  filePath: string;
  allBuildings?: Building[];
};

/**
 * Transforms a raw tour object into a tour object that can be used in the
 * application. The raw tour is expected to be a JS object parsed from a
 * markdown file.
 *
 * @param raw Raw tour from the source file
 * @param filePath Absolute path to the source file
 * @returns Transformed tour that can be written to the cache directory or used
 * as needed
 */
export async function transformTour(options: TourTransformerOptions): Promise<Tour> {
  const { filePath, raw, allBuildings } = options;
  // Pass-through fields
  const title = raw.title;
  const time_estimate = raw.time_estimate;
  const icon = raw.icon;
  // Create slug using the filename
  const slug = path.basename(filePath, path.extname(filePath));
  // Stackbit ID is the relative path to the file from the root of the project
  const stackbit_id = path.relative(ROOT_DIR, filePath);
  // URL path is the slug prefixed with `/tours/`
  const url_path = `/tours/${slug}`;
  // Map URL path is the slug prefixed with `/tours/` and suffixed with `/map`
  const map_url_path = `/tours/${slug}/map`;
  // Draft is true unless explicitly set to false in the source file
  const draft = raw.draft === false ? false : true;
  // Description gets transformed into markdown
  const description = await processMarkdown(raw.description);
  // Image gets transformed into a cloudinary URL
  const image = raw.image ? cloudinaryImageUrls(raw.image, ['card_hero', 'hero']) : undefined;
  // Static map gets transformed into a cloudinary URL
  const static_map = raw.static_map ? cloudinaryImageUrls(raw.static_map, ['sidebar']) : undefined;
  // Resolve building references
  let buildings = (raw.buildings || [])
    .map((filePath) => (allBuildings || []).find((building) => building.stackbit_id === filePath))
    .filter(Boolean);

  // Build the tour object from the transformed fields above.
  const tour: Tour = {
    buildings,
    description,
    draft,
    icon,
    image,
    map_url_path,
    slug,
    stackbit_id,
    static_map,
    time_estimate,
    title,
    url_path,
    validation_errors: [],
  };
  // Validate the tour object
  validateTour(tour);
  // Return the tour object
  return tour;
}

/* ----- Validator ----- */

/**
 * Throws an error if tour does not meet minimum requirements for content.
 *
 * @param tour Contentlayer tour object
 * @returns Transformed tour object
 */
export function validateTour(tour: Tour): boolean {
  tour.validation_errors = [];

  // The following fields are required
  const requiredFields: Array<keyof Tour> = [
    'title',
    'image',
    'time_estimate',
    'description',
    'static_map',
  ];
  for (const field of requiredFields) {
    if (!tour[field]) tour.validation_errors.push(`Missing required field: ${field}`);
  }
  // Must have at least one image
  if (tour.buildings.length < 1) tour.validation_errors.push('Must have at least one building');

  // Keep the validation errors on the tour, but don't throw an error in
  // editor mode.
  if (EDITOR_MODE) return true;
  // Throw an error if there are validation errors when not in editor mode.
  if (tour.validation_errors.length > 0) {
    throw new Error(`Validation failed.\n${tour.validation_errors.join('\n')}`);
  }

  return true;
}
