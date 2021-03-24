import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import { version } from '../package.json'
import AdapterType from '@jbrowse/core/pluggableElementTypes/AdapterType'
import { AdapterClass, configSchema } from './ImportanceAdapter'

import rendererFactory, {
  configSchema as ImportanceRendererConfigSchema,
} from './ImportanceRenderer'
import {
  configSchemaFactory as ImportanceDisplayConfigSchemaFactory,
  stateModelFactory as ImportanceDisplayModelFactory,
} from './ImportanceDisplay'

export default class MyProjectPlugin extends Plugin {
  name = 'MyProject'
  version = version

  install(pluginManager: PluginManager) {
    const WigglePlugin = pluginManager.getPlugin(
      'WigglePlugin',
    ) as import('@jbrowse/plugin-wiggle').default
    const DisplayType =
      pluginManager.lib['@jbrowse/core/pluggableElementTypes/DisplayType']

    const {
      LinearWiggleDisplayReactComponent,
      XYPlotRendererReactComponent,
      //@ts-ignore
    } = WigglePlugin.exports

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'ImportanceAdapter',
          AdapterClass,
          configSchema,
        }),
    )

    pluginManager.addDisplayType(() => {
      const configSchema = ImportanceDisplayConfigSchemaFactory(pluginManager)
      return new DisplayType({
        name: 'ImportanceDisplay',
        configSchema,
        stateModel: ImportanceDisplayModelFactory(pluginManager, configSchema),
        trackType: 'FeatureTrack',
        viewType: 'LinearGenomeView',
        ReactComponent: LinearWiggleDisplayReactComponent,
      })
    })

    pluginManager.addRendererType(() => {
      //@ts-ignore
      const ImportanceRenderer = new rendererFactory(pluginManager)
      const configSchema = ImportanceRendererConfigSchema
      return new ImportanceRenderer({
        name: 'ImportanceRenderer',
        ReactComponent: XYPlotRendererReactComponent,
        configSchema,
        pluginManager,
      })
    })
  }

  configure(pluginManager: PluginManager) {}
}
