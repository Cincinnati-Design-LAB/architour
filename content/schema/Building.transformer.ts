import type { Building, RawBuilding } from '@/content/schema/Building.d';
import { RawBuildingAttributeSection } from '@/content/schema/BuildingAttributeSection.d';
import { EDITOR_MODE, ROOT_DIR } from '@/content/utils/constants';
import { cloudinaryImageUrls } from '@/content/utils/images';
import { mapMarkerData } from '@/content/utils/map';
import { processMarkdown } from '@/content/utils/markdown';
import { getExcerpt } from '@/content/utils/text';
import path from 'path';

export async function transformBuilding(raw: RawBuilding, filePath: string): Promise<Building> {
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
  const images = (raw.images || []).map((id) => cloudinaryImageUrls(id, ['gallery_item']));
  // If there is an image, use it as the featured image
  const featured_image =
    raw.images && raw.images[0]
      ? cloudinaryImageUrls(raw.images[0], ['card_thumb', 'compact_card_hero', 'hero', 'sidebar'])
      : undefined;
  // Transform the markdown content into a markdown object
  const body = await processMarkdown(raw.content);
  // Transform the markdown content into an excerpt
  const excerpt = await processMarkdown(getExcerpt(raw.content));
  // Add static map image if it exists
  const static_map = raw.static_map ? cloudinaryImageUrls(raw.static_map, ['sidebar']) : undefined;
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
  const getAttributesForSection = (page_location: RawBuildingAttributeSection['page_location']) => {
    return (raw.sections || []).filter((section) => section.page_location === page_location);
  };
  const sections = Object.fromEntries(
    ['above_images', 'below_images', 'above_map', 'below_map'].map(
      (page_location: RawBuildingAttributeSection['page_location']) => {
        return [page_location, getAttributesForSection(page_location)];
      },
    ),
  );

  const building: Building = {
    stackbit_id,
    url_path,
    slug,
    title,
    location,
    completion_date,
    address,
    sections,
    // TODO
    tour_count: 0,
    images,
    featured_image,
    body,
    excerpt,
    static_map,
    map_marker,
    draft,
    validation_errors: [],
  };

  validateBuilding(building);

  return building;
}

/* ----- Validator ----- */

/**
 * Throws an error if building does not meet minimum requirements for content.
 *
 * @param building Contentlayer building object
 * @returns Transformed building object
 */
export function validateBuilding(building: Building): boolean {
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
    throw new Error(`Validation failed.\n${building.validation_errors.join('\n')}`);
  }

  return true;
}
