import PluginManager from '@jbrowse/core/PluginManager'
import { getOrigin, getColor } from '../util'

export default function rendererFactory(pluginManager: PluginManager) {
  const WigglePlugin = pluginManager.getPlugin(
    'WigglePlugin',
  ) as import('@jbrowse/plugin-wiggle').default
  const {
    utils: { getScale },
    //@ts-ignore
    XYPlotRenderer,
    //@ts-ignore
  } = WigglePlugin.exports

  const { featureSpanPx } = pluginManager.lib['@jbrowse/core/util']

  return class QuantitativeSequenceRenderer extends XYPlotRenderer {
    draw(ctx: CanvasRenderingContext2D, props: any) {
      const {
        features,
        regions,
        bpPerPx,
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
      const originY = getOrigin(scaleOpts.scaleType)
      const scale = getScale(opts)

      if (region.end - region.start > 5000) {
        console.log('using super')
        super.draw(ctx, props)
        return
      }

      const toY = (n: number) => height - scale(n) + YSCALEBAR_LABEL_OFFSET
      const toHeight = (n: number) => toY(originY) - toY(n)

      console.log({ features })
      ctx.textAlign = 'center'
      ctx.font = '10px sans-serif'
      for (const feature of features.values()) {
        const [leftPx, rightPx] = featureSpanPx(feature, region, bpPerPx)
        const w = rightPx - leftPx + 0.4 // fudge factor for subpixel rendering
        const score = feature.get('score') as number
        const base = feature.get('base')
        ctx.fillStyle = getColor(base)
        if (1 / bpPerPx < 5) {
          ctx.fillRect(leftPx, toY(score), w, toHeight(score))
        } else {
          console.log({
            height: toHeight(score),
            y: toY(score),
          })
          ctx.setTransform(
            w / 10,
            0,
            0,
            toHeight(score) / 10,
            leftPx * 2 + (rightPx - leftPx),
            height + (toY(score) - toHeight(score)), // 1, //toY(score),
          )
          // ctx.setTransform(
          //   1,
          //   0,
          //   0,
          //   1, // toHeight(score) / 10,
          //   leftPx, // + (rightPx - leftPx) / 2,
          //   toY(score) - 2,
          // )
          ctx.fillText(
            base,
            0, // + (rightPx - leftPx) / 2,
            20,
            //toY(score) - 2,
          )
        }
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
