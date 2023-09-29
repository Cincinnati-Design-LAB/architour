import { FieldEnumOptionThumbnails } from '@stackbit/types';

export const iconNames = [
  'alert',
  'arrow-left',
  'arrow-right',
  'building',
  'calendar',
  'cancel',
  'clock',
  'draft',
  'eye',
  'expand',
  'link-external',
  'menu',
] as const;

export const iconOptions: FieldEnumOptionThumbnails[] = iconNames.map((name) => ({
  value: name,
  label: name,
  thumbnail: `.stackbit/thumbnails/icon/${name}.png`,
}));

export type IconName = (typeof iconNames)[number];
