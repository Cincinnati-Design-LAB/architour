import { makeSource } from 'contentlayer/source-files'

import { Building } from './content/schema/Building'
import { Tour } from './content/schema/Tour'

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Building, Tour],
  onExtraFieldData: 'ignore',
})
