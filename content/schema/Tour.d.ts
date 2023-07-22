import { IconName } from '@/content/utils/icons';

export type RawTour = {
  title: string;
  image?: string;
  time_estimate?: string;
  icon?: IconName;
  description?: string;

  buildings?: string[];

  static_map?: string;
  static_map_cache?: string;

  draft?: boolean;
};

export interface Tour {
  stackbit_id: string;
  url_path: string;
  mapUrlPath: string;
  slug: string;

  name: string;
  // image?: CloudinaryImage
  time_estimate?: string;
  icon?: IconName;
  description?: string;

  buildings: Building[];

  // staticMap?: StaticMap

  draft?: boolean;
}
