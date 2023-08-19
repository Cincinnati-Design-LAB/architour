import type { BuildingPageLocation } from '@/content/schema/Building';
import type { BuildingAttribute, RawBuildingAttribute } from '@/content/schema/BuildingAttribute';

export type RawBuildingAttributeSection = {
  type: 'BuildingAttributeSection';
  attributes: RawBuildingAttribute[];
  page_location: BuildingPageLocation;
};

export type BuildingAttributeSection = Omit<
  RawBuildingAttributeSection,
  'attributes' | 'page_location'
> & {
  attributes: BuildingAttribute[];
};
