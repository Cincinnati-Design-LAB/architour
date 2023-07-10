import { Building } from './types';

/**
 * The shape of content expected by the map component.
 */
export type MapMarker = {
  type: 'Feature';
  properties: {
    title: string;
    excerpt: Building['excerpt'];
    image: Building['featuredImage'];
    urlPath: Building['urlPath'];
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
  urlPath,
}: {
  excerpt: Building['excerpt'];
  image: Building['featuredImage'];
  location: Building['location'];
  title: Building['title'];
  urlPath: Building['urlPath'];
}): MapMarker {
  return {
    type: 'Feature',
    properties: {
      title,
      image,
      excerpt,
      urlPath,
    },
    geometry: {
      type: 'Point',
      coordinates: [location.lng, location.lat],
    },
  };
}
