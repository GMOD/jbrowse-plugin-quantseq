import { ConfigurationSchema } from '@jbrowse/core/configuration'
export { default } from './ImportanceRenderer'

export const configSchema = ConfigurationSchema(
  'ImportanceRenderer',
  {},
  { explicitlyTyped: true },
)
