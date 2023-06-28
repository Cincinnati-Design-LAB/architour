import { makeSource } from 'contentlayer/source-files'

import { Building } from './content/schema/Building'
import { SiteConfig } from './content/schema/SiteConfig'
import { Tour } from './content/schema/Tour'

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Building, Tour, SiteConfig],
  disableImportAliasWarning: true,
})
