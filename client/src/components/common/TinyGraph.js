import React, { useEffect } from 'react'
import { TinyArea } from '@antv/g2plot'

const TinyGraph = ({ ticker, data, width = 250 }) => {
  useEffect(() => {
    const initGraph = async () => {
      document.getElementById(`antTinyGraph-${ticker}`).innerHTML = ''

      const tinyArea = new TinyArea(`antTinyGraph-${ticker}`, {
        height: 60,
        width,
        autoFit: false,
        data: data.historicalPriceData,
        smooth: true,
        areaStyle: {
          fill: '#d6e3fd',
        },
        meta: {
          scale: [2400, 2800],
        },
        tooltip: {
          customItems: (originalItems) => {
            // idk why i can't do it the proper way as accord to docs
            // v * (data.max-data.min) + data.min
            if (originalItems[0].mappingData._origin.y[0] !== '$') {
              originalItems[0].mappingData._origin.y = `$${(
                originalItems[0].mappingData._origin.y * (data.max - data.min) +
                data.min
              ).toFixed(2)}`
            }
            // console.log(originalItems);
            return originalItems
          },
        },
      })

      tinyArea.render()
    }
    initGraph()
  }, [ticker, data])
  return <div id={`antTinyGraph-${ticker}`}></div>
}

export default TinyGraph
