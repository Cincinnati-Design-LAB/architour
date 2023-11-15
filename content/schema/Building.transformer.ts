import type { Building, BuildingPageLocation, RawBuilding } from '@/content/schema/Building.d';
import { BuildingAttributeSection } from '@/content/schema/BuildingAttributeSection';
import { BuildingRenovationSection } from '@/content/schema/BuildingRenovationSection';
import { Tour } from '@/content/schema/Tour';
import { EDITOR_MODE, ROOT_DIR } from '@/content/utils/constants';
import { cloudinaryImageUrl } from '@/content/utils/images';
import { mapMarkerData } from '@/content/utils/map';
import { processMarkdown } from '@/content/utils/markdown';
import { getExcerpt } from '@/content/utils/text';
import path from 'path';

/* ----- Transformer ----- */

type BuildingTransformerOptions = {
  /** Raw building from a source file, already filtered for context. */
  raw: RawBuilding;
  /** Absolute path to the source file. */
  filePath: string;
};

/**
 * Transforms a raw building object into a building object that can be used in
 * the application. The raw building is expected to be a JS object parsed from a
 * markdown file.
 *
 * @returns Building with all attributes, but without proper references.
 */
export async function transformBuilding(options: BuildingTransformerOptions): Promise<Building> {
  const { raw, filePath } = options;
  // Pass-through fields
  const title = raw.title;
  const location = raw.location;
  const address = raw.address;
  const completion_date = raw.completion_date;
  // Create slug using the filename
  const slug = path.basename(filePath, path.extname(filePath));
  // Stackbit ID is the relative path to the file from the root of the project
  const stackbit_id = path.relative(ROOT_DIR, filePath);
  // URL path is the slug prefixed with `/buildings/`
  const url_path = `/buildings/${slug}`;
  // Draft is true unless explicitly set to false in the source file
  const draft = raw.draft === false ? false : true;
  // Transform the list of image IDs into a list of image URLs
  const images = (raw.images || []).map((id) => cloudinaryImageUrl(id));
  // If there is an image, use it as the featured image
  const featured_image =
    raw.images && raw.images[0] ? cloudinaryImageUrl(raw.images[0]) : undefined;
  // Transform the markdown content into a markdown object
  const body = await processMarkdown(raw.content);
  // Transform the markdown content into an excerpt
  const excerpt = await processMarkdown(getExcerpt(raw.content));
  // Add static map image if it exists
  const static_map = raw.static_map ? cloudinaryImageUrl(raw.static_map) : undefined;
  // Build map marker data if there is a location
  const map_marker = raw.location?.lat
    ? mapMarkerData({
        excerpt,
        url_path: url_path,
        image: featured_image,
        location: raw.location,
        title: raw.title,
      })
    : undefined;
  // Transform the sections by collecting them into page locations
  const getPageSection = (page_location: BuildingPageLocation) => {
    return (raw.sections || [])
      .filter((section) => section.page_location === page_location)
      .map((rawSection) => {
        const { page_location, ...sectionProps } = rawSection as any;
        const section: BuildingAttributeSection | BuildingRenovationSection = sectionProps;
        section.fieldPath = `sections.${raw.sections.indexOf(rawSection)}`;
        return section;
      });
  };
  const sections = Object.fromEntries(
    ['above_images', 'below_images', 'above_map', 'below_map'].map(
      (page_location: BuildingPageLocation) => [page_location, getPageSection(page_location)],
    ),
  ) as Record<BuildingPageLocation, Array<BuildingAttributeSection | BuildingRenovationSection>>;
  // Initialize tours as an empty array. These will be populated later.
  const tours = [] as Array<Tour>;
  // Build the building object from the transformed fields above.
  const building: Building = {
    address,
    body,
    completion_date,
    draft,
    excerpt,
    featured_image,
    images,
    location,
    map_marker,
    sections,
    slug,
    stackbit_id,
    static_map,
    title,
    tours,
    url_path,
    validation_errors: [],
  };
  // Return the building object
  return building;
}

/* ----- Reference Attacher ----- */

type BuildingReferenceAttacherOptions = {
  building: Building;
  tours: Array<Tour>;
  buildings: Array<Building>;
};

/**
 * Attaches references to the building object. This is processed after the
 * initial transformation. Attached objects have been processed, but do not have
 * their references attached.
 */
export async function attachBuildingRefs(
  options: BuildingReferenceAttacherOptions,
): Promise<Building> {
  const tours = structuredClone(options.tours);
  const building = structuredClone(options.building);
  building.tours = tours.filter((tour) => tour.building_ids.includes(building.stackbit_id));
  return building;
}

/* ----- Validator ----- */

type BuildingValidatorOptions = {
  building: Building;
};

/**
 * Throws an error if building does not meet minimum requirements for content.
 */
export function validateBuilding(options: BuildingValidatorOptions): boolean {
  const { building } = options;
  building.validation_errors = [];

  // The following fields are required
  const requiredFields: Array<keyof Building> = [
    'title',
    'address',
    'completion_date',
    'static_map',
  ];
  for (const field of requiredFields) {
    if (!building[field]) building.validation_errors.push(`Missing required field: ${field}`);
  }
  // `body` is a structured field
  if (!building.body?.raw) building.validation_errors.push('Missing required field: body');
  // Latitude and longitude must be set
  if (!building.location?.lat || !building.location?.lng) {
    building.validation_errors.push('Location has not been set');
  }
  // Must have at least one image
  if (!building.images || building.images.length < 1) {
    building.validation_errors.push('Must have at least one image');
  }

  // Keep the validation errors on the building, but don't throw an error in
  // editor mode.
  if (EDITOR_MODE) return true;
  // Throw an error if there are validation errors when not in editor mode.
  if (building.validation_errors.length > 0) {
    throw new Error(
      `Validation failed for building: ${building.title}\n${building.validation_errors.join('\n')}`,
    );
  }

  return true;
}
