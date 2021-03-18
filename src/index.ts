import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import { version } from '../package.json'
import AdapterType from '@jbrowse/core/pluggableElementTypes/AdapterType'
import { AdapterClass, configSchema } from './ImportanceAdapter'

export default class MyProjectPlugin extends Plugin {
  name = 'MyProject'
  version = version

  install(pluginManager: PluginManager) {
    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'ImportanceAdapter',
          AdapterClass,
          configSchema,
        }),
    )
  }

  configure(pluginManager: PluginManager) {}
}
