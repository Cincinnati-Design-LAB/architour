import { Building } from '@/content/schema/Building';

/**
 * The shape of content expected by the map component.
 */
export type MapMarker = {
  type: 'Feature';
  properties: {
    title: string;
    excerpt: Building['excerpt'];
    image: Building['featured_image'];
    url_path: Building['url_path'];
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

/**
 * Creates a map marker object from a building object.
 *
 * @param building Building object
 * @returns Map marker object
 */
export function mapMarkerData({
  excerpt,
  image,
  location,
  title,
  url_path,
}: {
  excerpt: Building['excerpt'];
  image: Building['featured_image'];
  location: Building['location'];
  title: Building['title'];
  url_path: Building['url_path'];
}): MapMarker {
  return {
    type: 'Feature',
    properties: {
      title,
      image,
      excerpt,
      url_path,
    },
    geometry: {
      type: 'Point',
      coordinates: [location.lng, location.lat],
    },
  };
}
