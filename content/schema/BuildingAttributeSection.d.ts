import type { BuildingAttribute, RawBuildingAttribute } from './BuildingAttribute.d';

export type RawBuildingAttributeSection = {
  attributes: RawBuildingAttribute[];
  page_location: 'above_images' | 'below_images' | 'above_map' | 'below_map';
};

export type BuildingAttributeSections = {
  above_images: BuildingAttribute[];
  below_images: BuildingAttribute[];
  above_map: BuildingAttribute[];
  below_map: BuildingAttribute[];
};
