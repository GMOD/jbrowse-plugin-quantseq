import { ConfigurationSchema } from '@jbrowse/core/configuration'

export default ConfigurationSchema(
  'ImportanceAdapter',
  {
    sequenceAdapter: {
      type: 'frozen',
      defaultValue: null,
    },
    wiggleAdapter: {
      type: 'frozen',
      defaultValue: null,
    },
  },
  { explicitlyTyped: true },
)
