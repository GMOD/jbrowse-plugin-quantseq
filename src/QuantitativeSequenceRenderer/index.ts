import { ConfigurationSchema } from '@jbrowse/core/configuration'
export { default } from './QuantitativeSequenceRenderer'

export const configSchema = ConfigurationSchema(
  'QuantitativeSequenceRenderer',
  {},
  { explicitlyTyped: true },
)
