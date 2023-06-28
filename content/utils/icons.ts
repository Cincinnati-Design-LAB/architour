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
] as const

export type IconName = (typeof iconNames)[number]
