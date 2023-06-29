/* ----- Pages ----- */

import { Building } from './Building'
import { Tour } from './Tour'

/* ----- Data ----- */

import { SiteConfig } from './SiteConfig'

/* ----- Objects ----- */

import { BuildingAttribute } from './BuildingAttribute'
import { BuildingAttributeSection } from './BuildingAttributeSection'
import { BuildingRenovation } from './BuildingRenovation'
import { BuildingRenovationSection } from './BuildingRenovationSection'
import { Location } from './Location'
import { SiteFooter, SiteFooterContact, SiteFooterLink } from './SiteFooter'
import { SiteHeader, SiteHeaderLink } from './SiteHeader'

/* ----- Exported Models ----- */

export const models = [
  Building,
  BuildingAttribute,
  BuildingAttributeSection,
  BuildingRenovation,
  BuildingRenovationSection,
  Location,
  SiteConfig,
  SiteHeader,
  SiteHeaderLink,
  SiteFooter,
  SiteFooterContact,
  SiteFooterLink,
  Tour,
]
