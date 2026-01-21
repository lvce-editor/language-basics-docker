import { exportStatic } from '@lvce-editor/shared-process'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
await exportStatic({
  root,
})
