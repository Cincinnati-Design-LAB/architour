import { Building } from '@/content/schema/Building';
import type { RawTour, Tour } from '@/content/schema/Tour';
import { EDITOR_MODE, ROOT_DIR } from '@/content/utils/constants';
import { cloudinaryImageUrl } from '@/content/utils/images';
import { processMarkdown } from '@/content/utils/markdown';
import path from 'path';

/* ----- Transformer ----- */

type TourTransformerOptions = {
  /** Raw tour from a source file, already filtered for context. */
  raw: RawTour;
  /** Absolute path to the source file. */
  filePath: string;
};

/**
 * Transforms a raw tour object into a tour object that can be used in the
 * application. The raw tour is expected to be a JS object parsed from a
 * markdown file.
 */
export async function transformTour(options: TourTransformerOptions): Promise<Tour> {
  const { filePath, raw } = options;
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
  const image = raw.image ? cloudinaryImageUrl(raw.image) : undefined;
  // Static map gets transformed into a cloudinary URL
  const static_map = raw.static_map ? cloudinaryImageUrl(raw.static_map) : undefined;
  // Initialize buildings array as a list of building IDs.
  const buildings = [];
  // Keep track of the building IDs that are referenced in the tour. This is
  // used to attach the building references, and also used by the associated
  // buildings to build references to the tour.
  const building_ids = raw.building_ids || [];

  // Build the tour object from the transformed fields above.
  const tour: Tour = {
    buildings,
    building_ids,
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
  // Return the tour object
  return tour;
}

/* ----- Reference Attacher ----- */

type TourReferenceAttacherOptions = {
  tour: Tour;
  tours: Array<Tour>;
  buildings: Array<Building>;
};

/**
 * Attaches references to the tour object. This is processed after the initial
 * transformation. Attached objects have been processed, but do not have their
 * references attached.
 */
export async function attachTourRefs(options: TourReferenceAttacherOptions): Promise<Tour> {
  const buildings = structuredClone(options.buildings);
  const tour = structuredClone(options.tour);
  tour.buildings = (tour.building_ids || [])
    .map((filePath) => buildings.find((building) => building.stackbit_id === filePath))
    .filter(Boolean);
  // We don't need the raw references in the cached file.
  delete tour.building_ids;
  return tour;
}

/* ----- Validator ----- */

type TourValidatorOptions = {
  tour: Tour;
};

/**
 * Throws an error if tour does not meet minimum requirements for content.
 */
export function validateTour(options: TourValidatorOptions): boolean {
  const { tour } = options;
  tour.validation_errors = [];

  // The following fields are required
  const requiredFields: Array<keyof Tour> = [
    'title',
    'image',
    // 'time_estimate',
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
    throw new Error(
      `Validation failed for tour: ${tour.title}\n${tour.validation_errors.join('\n')}`,
    );
  }

  return true;
}
