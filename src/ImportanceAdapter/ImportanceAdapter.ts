import {
  BaseFeatureDataAdapter,
  BaseOptions,
} from '@jbrowse/core/data_adapters/BaseAdapter'
import { AnyConfigurationModel } from '@jbrowse/core/configuration/configurationSchema'
import { getSubAdapterType } from '@jbrowse/core/data_adapters/dataAdapterCache'
import { NoAssemblyRegion } from '@jbrowse/core/util/types'
import { openLocation } from '@jbrowse/core/util/io'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import SimpleFeature, { Feature } from '@jbrowse/core/util/simpleFeature'
import { map, mergeAll, toArray } from 'rxjs/operators'
import { readConfObject } from '@jbrowse/core/configuration'
import { rectifyStats, UnrectifiedFeatureStats } from '@jbrowse/core/util/stats'

import configSchema from './configSchema'

interface WiggleOptions extends BaseOptions {
  resolution?: number
}

export default class ImportanceAdapter extends BaseFeatureDataAdapter {
  public static capabilities = [
    'hasResolution',
    'hasLocalStats',
    'hasGlobalStats',
  ]

  private sequenceAdapter: any
  private wiggleAdapter: any

  public constructor(
    config: AnyConfigurationModel,
    getSubAdapter?: getSubAdapterType,
  ) {
    super(config)

    const sequenceAdapterConfig = readConfObject(config, 'sequenceAdapter')
    if (sequenceAdapterConfig && getSubAdapter) {
      const { dataAdapter } = getSubAdapter(sequenceAdapterConfig)
      this.sequenceAdapter = dataAdapter as BaseFeatureDataAdapter
    }

    const wiggleAdapterConfig = readConfObject(config, 'wiggleAdapter')
    if (wiggleAdapterConfig && getSubAdapter) {
      const { dataAdapter } = getSubAdapter(wiggleAdapterConfig)
      this.wiggleAdapter = dataAdapter as BaseFeatureDataAdapter
    }
  }

  public async getRefNames(opts?: BaseOptions) {
    return this.wiggleAdapter.getRefNames()
  }

  public async getGlobalStats(opts?: BaseOptions) {
    return this.wiggleAdapter.getGlobalStats()
  }

  public getFeatures(region: NoAssemblyRegion, opts: WiggleOptions = {}) {
    const { refName, start, end } = region
    const {
      bpPerPx = 0,
      signal,
      resolution = 1,
      statusCallback = () => {},
    } = opts
    return ObservableCreate<Feature>(async observer => {
      // wig features (quantitative array)
      const features = this.wiggleAdapter.getFeatures(region, opts)
      const featureArray = await features.pipe(toArray()).toPromise()

      // sequence features (features have .get('seq'))
      const sequence = this.sequenceAdapter.getFeatures(region, opts)
      const sequenceFeatureArray = await sequence.pipe(toArray()).toPromise()

      console.log({ featureArray, sequenceFeatureArray })
    }, signal)
  }

  public freeResources(): void {}
}

// const myarray = new Array(region.end-region.start)
// features.forEach(feature => {
// })
// inside there
// feature.get('start')-region.start
// index
// myarray[index]++
