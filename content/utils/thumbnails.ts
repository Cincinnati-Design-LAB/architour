import { FieldEnumOptionThumbnails } from '@stackbit/types';

type ThumbnailOptions = {
  dirname: string;
  options: string[];
};

export function getThumbnailOptions(options: ThumbnailOptions): FieldEnumOptionThumbnails[] {
  return options.options.map((name) => ({
    value: name,
    label: name,
    thumbnail: `.stackbit/thumbnails/${options.dirname}/${name}.png`,
  }));
}
