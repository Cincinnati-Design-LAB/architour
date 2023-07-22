import { BuildingPageLocation } from '@/content/schema/Building';
import { RawBuildingRenovation } from '@/content/schema/BuildingRenovation';

export type RawBuildingRenovationSection = {
  type: 'BuildingRenovationSection';
  title: string;
  renovations: RawBuildingRenovation[];
  page_location: BuildingPageLocation;
};

export type BuildingRenovationSection = Omit<
  RawBuildingRenovationSection,
  'renovations' | 'page_location'
> & {
  renovations: BuildingRenovation[];
};
