import { convert } from 'utils/date'
import { resHandler } from './factory'
import { BASE_YF } from './apiConsts'

const v10 = `/v10`
const v8 = `/v8`

// https://query1.finance.yahoo.com/v8/finance/chart/TSLA?symbol=TSLA
// https://query1.finance.yahoo.com/v10/finance/quoteSummary/TSLA?modules=calendarEvents
// https://stackoverflow.com/questions/44030983/yahoo-finance-url-not-working Ref here for some how tos

// TODO:
// implement yahoo search API
// https://query2.finance.yahoo.com/v1/finance/search?q=a&lang=en-US&region=US&quotesCount=10&newsCount=0&listsCount=0

// USEFUL: (taken from https://quant.stackexchange.com/questions/1640/where-to-download-list-of-all-common-stocks-traded-on-nyse-nasdaq-and-amex)
// change otherlisted.txt to nasdaqlisted.txt
// echo "[\"$(echo -n "$(echo -en "$(curl -s --compressed 'ftp://ftp.nasdaqtrader.com/SymbolDirectory/otherlisted.txt' | tail -n+2 | head -n-1 | perl -pe 's/ //g' | tr '|' ' ' | awk '{printf $1" "} {print $4}')\n$(curl -s --compressed 'ftp://ftp.nasdaqtrader.com/SymbolDirectory/nasdaqlisted.txt' | tail -n+2 | head -n-1 | perl -pe 's/ //g' | tr '|' ' ' | awk '{printf $1" "} {print $7}')" | grep -v 'Y$' | awk '{print $1}' | grep -v '[^a-zA-Z]' | sort)" | perl -pe 's/\n/","/g')\"]"

export const getStockInfo = async (symbol = 'TSLA', range = '5d', interval) => {
  const api = `${BASE_YF}/${v8}/finance/chart/${symbol}?symbol=${symbol}&range=${range}&interval=${interval}`
  return await resHandler(await fetch(api))
}

export const getCompanyInfo = async (symbol = 'TSLA', modules = ['price']) => {
  let api = `${BASE_YF}/${v10}/finance/quoteSummary/${symbol}?modules=`
  for (const v of modules) {
    api += '%2C' + v
  }
  return await resHandler(await fetch(api))
}

const simpleDataTransform = ({ chart, priceData = [] }) => {
  const { adjclose } = chart.result[0].indicators.adjclose[0]
  const max = Math.max(...adjclose)
  const min = Math.min(...adjclose)
  // () => (val - min) / (max - min)
  // Math.round(v * 100) / 100

  return {
    historicalPriceData: adjclose.map((v) => (v - min) / (max - min)),
    max,
    min,
    first: adjclose[0],
    last: adjclose[adjclose.length - 1],
  }
}

const normalDataTransform = ({
  chart,
  range,
  priceData = [],
  max = 0,
  min = 4294967295, // must be more than most expensive stock
}) => {
  const close = chart.result[0].indicators.quote[0].close
  let i = 0
  if (close) {
    while (close.length) {
      if (close[0]) {
        const price = close.shift()
        if (min > price) min = price
        if (max < price) max = price
        priceData.push({
          price: +parseFloat(price).toFixed(2),
          date: i,
          y: convert(
            chart.result[0].timestamp[i],
            chart.result[0].meta.exchangeTimezoneName,
            range
          ),
          y2: chart.result[0].timestamp[i],
        })
        i++
      } else close.shift()
    }
  }
  return { priceData, max, min }
}

export const getChartInfo = async ({
  ticker = 'TSLA',
  range = '5d',
  interval = '1d',
  type = 'normal',
}) => {
  try {
    range = range.toLowerCase()
    switch (range) {
      case '1d':
        interval = '1m'
        break
      case '5d':
        interval = '30m'
        break
      case '5y':
      case 'max':
        interval = '5d'
        break
      default:
        interval = '1d'
    }
    const { chart } = await getStockInfo(ticker, range, interval)

    switch (type) {
      case 'normal':
        return normalDataTransform({ chart, range })
      case 'tinygraph':
        return simpleDataTransform({ chart })
      default:
        return normalDataTransform({ chart, range })
    }
  } catch (err) {
    console.log(err)
    // alert("Err in getting chart from getChartInfo()? in YF.js");
  }
}
