import {
  BaseFeatureDataAdapter,
  BaseOptions,
} from '@jbrowse/core/data_adapters/BaseAdapter'
import { AnyConfigurationModel } from '@jbrowse/core/configuration/configurationSchema'
import { getSubAdapterType } from '@jbrowse/core/data_adapters/dataAdapterCache'
import { NoAssemblyRegion } from '@jbrowse/core/util/types'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import SimpleFeature, { Feature } from '@jbrowse/core/util/simpleFeature'
import { toArray } from 'rxjs/operators'
import { readConfObject } from '@jbrowse/core/configuration'

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
    return this.wiggleAdapter.getRefNames(opts)
  }

  public async getGlobalStats(opts?: BaseOptions) {
    return this.wiggleAdapter.getGlobalStats(opts)
  }

  public getFeatures(region: NoAssemblyRegion, opts: WiggleOptions = {}) {
    const { refName } = region
    const { signal } = opts
    return ObservableCreate<Feature>(async observer => {
      // wig features (quantitative array)
      // const newOpts = { ...opts, scale: 10 }
      // this gives binned features Array [1-500 : score], [500-1000: score]
      const features = this.wiggleAdapter.getFeatures(region, opts)
      const featureArray = await features.pipe(toArray()).toPromise()

      // sequence features (features have .get('seq'))
      const sequence = this.sequenceAdapter.getFeatures(region, opts)
      const sequenceFeatureArray = await sequence.pipe(toArray()).toPromise()

      // console.log({ featureArray, sequenceFeatureArray })
      // console.log(sequenceFeatureArray[0].data)
      // console.log({ refName, start, end })

      const seqString = sequenceFeatureArray[0].get('seq')
      const scoreArray = new Array(region.end - region.start)
      // @ts-ignore
      featureArray.forEach((feature: any) => {
        const featureStart = feature.get('start')
        const featureEnd = feature.get('end')

        for (let i = featureStart; i < featureEnd; i++) {
          if (i - region.start >= 0 && i - region.start < scoreArray.length) {
            scoreArray[i - region.start] = {
              base: seqString[i - region.start],
              score: feature.get('score'),
            }
          }
        }
      })

      console.log(scoreArray)

      // return features
      scoreArray.forEach((score, i) => {
        const start = region.start + i
        const end = region.start + i + 1
        observer.next(
          new SimpleFeature({
            id: `${refName} ${start}-${end}`,
            data: { refName, start, end, ...score },
          }),
        )
      })
      observer.complete()
    }, signal)
  }

  public freeResources(): void {}
}
