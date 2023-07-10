export type RawBuilding = {
  title: string
  images?: string[]
  completion_date?: string
  // sections?: Array<RawBuildingAttributeSection | RawBuildingRenovationSection>

  address?: string
  // location?: RawLocation
  static_map?: string
  static_map_cache?: string

  draft?: boolean
}

export interface Building {
  stackbitId: string
  urlPath: string
  slug: string

  completion_date?: string
  address?: string
  draft?: boolean

  name: string
  tourCount: number
  // images?: CloudinaryImage[]
  // featuredImage?: CloudinaryImage
  excerpt?: string
  // mapMarker?: MapMarker
  // sections?: Array<BuildingAttributeSection | BuildingRenovationSection>

  // location?: Location
  // staticMap?: StaticMap
}
