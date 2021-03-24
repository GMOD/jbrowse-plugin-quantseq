import PluginManager from '@jbrowse/core/PluginManager'
import { readConfObject } from '@jbrowse/core/configuration'
import { max } from 'rxjs/operators'

export default function rendererFactory(pluginManager: PluginManager) {
  const WigglePlugin = pluginManager.getPlugin(
    'WigglePlugin',
  ) as import('@jbrowse/plugin-wiggle').default
  const {
    utils: { getScale },
    WiggleBaseRenderer,
    //@ts-ignore
  } = WigglePlugin.exports

  const { featureSpanPx } = pluginManager.lib['@jbrowse/core/util']

  return class ImportanceRenderer extends WiggleBaseRenderer {
    draw(ctx: CanvasRenderingContext2D, props: any) {
      const {
        features,
        regions,
        bpPerPx,
        config,
        scaleOpts,
        height: unadjustedHeight,
        displayCrossHatches,
        ticks: { values },
      } = props
      const [region] = regions
      const YSCALEBAR_LABEL_OFFSET = 5
      const height = unadjustedHeight - YSCALEBAR_LABEL_OFFSET * 2
      const opts = { ...scaleOpts, range: [0, height] }
      const width = (region.end - region.start) / bpPerPx

      const scale = getScale(opts)
      const toY = (n: number) => height - scale(n) + YSCALEBAR_LABEL_OFFSET

      ctx.textAlign = 'center'
      for (const feature of features.values()) {
        console.log(feature)
        const [leftPx, rightPx] = featureSpanPx(feature, region, bpPerPx)
        const score = feature.get('score') as number
        ctx.fillStyle = readConfObject(config, 'color', [feature])
        console.log(toY(score) / height)
        // ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.fillText(
          feature.get('base'),
          leftPx + (rightPx - leftPx) / 2,
          height,
        )
      }

      if (displayCrossHatches) {
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(200,200,200,0.8)'
        values.forEach((tick: number) => {
          ctx.beginPath()
          ctx.moveTo(0, Math.round(toY(tick)))
          ctx.lineTo(width, Math.round(toY(tick)))
          ctx.stroke()
        })
      }
    }
  }
}
