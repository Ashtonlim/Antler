import React, { useEffect } from 'react'
import { Chart } from '@antv/g2'

import { getChartInfo } from 'api/YF'
import { convert5d1m } from 'utils/date'

const Graph = ({ ticker, range, history }) => {
  useEffect(() => {
    document.getElementById('antg').innerHTML = ''

    const initGraph = async () => {
      try {
        const { priceData, max, min } = await getChartInfo({ ticker, range })

        let chart = new Chart({
          container: 'antg',
          autoFit: true,
          height: 300,
        })

        let tickCount = priceData.length <= 10 ? priceData.length : '10'
        chart.data(priceData)
        chart.scale({
          price: {
            // explain: use "max - min" prob more suitable. works well w high stock prices and small stock price fluctuation
            max: max + (max - min) * 0.1,
            min: min - (max - min) * 0.1, // min has to be > 0, negative stock price impossible
          },
          date: { tickCount },
        })

        // i =/= date in priceData, find out why
        chart.axis('date', {
          label: {
            formatter: (i) => {
              return convert5d1m(priceData[i].y2, range)
            },
          },
        })
        chart.tooltip({ title: 'y' })
        chart
          .area()
          .position('date*price')
          .color('#1890ff')
          .style({ fillOpacity: 0.2 })
        chart.line().position('date*price').color('#1890ff')
        chart.render()
      } catch (err) {
        console.log('graph.js', err)
      }
    }

    initGraph()
  }, [ticker, range])

  return <div id="antg"></div>
}
export default Graph
