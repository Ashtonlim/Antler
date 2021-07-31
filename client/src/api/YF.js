import { convert } from "utils/date";
import { resHandler } from "./factory";

const { REACT_APP_AUTH } = process.env;

const v10 = `/v10`;
const v8 = `/v8`;
const BASE = REACT_APP_AUTH;

// https://query1.finance.yahoo.com/v8/finance/chart/TSLA?symbol=TSLA
// https://query1.finance.yahoo.com/v10/finance/quoteSummary/TSLA?modules=calendarEvents
// https://stackoverflow.com/questions/44030983/yahoo-finance-url-not-working Ref here for some how tos

export const getStockInfo = async (symbol = "TSLA", range = "5d", interval) => {
  const api = `${BASE}/${v8}/finance/chart/${symbol}?symbol=${symbol}&range=${range}&interval=${interval}`;
  return await resHandler(await fetch(api));
};

export const getCompanyInfo = async (symbol = "TSLA", modules = ["price"]) => {
  let api = `${BASE}/${v10}/finance/quoteSummary/${symbol}?modules=`;
  for (const v of modules) {
    api += "%2C" + v;
  }
  return await resHandler(await fetch(api));
};

const simpleDataTransform = ({ chart, priceData = [] }) => {
  const { adjclose } = chart.result[0].indicators.adjclose[0];
  const max = Math.max(...adjclose);
  const min = Math.min(...adjclose);
  // () => (val - min) / (max - min)
  // Math.round(v * 100) / 100

  return {
    historicalPriceData: adjclose.map((v) => (v - min) / (max - min)),
    max,
    min,
    first: adjclose[0],
    last: adjclose[adjclose.length - 1],
  };
};

const normalDataTransform = ({
  chart,
  range,
  priceData = [],
  max = 0,
  min = 4294967295, // must be more than most expensive stock
}) => {
  const close = chart.result[0].indicators.quote[0].close;
  let i = 0;
  if (close) {
    while (close.length) {
      if (close[0]) {
        const price = close.shift();
        if (min > price) min = price;
        if (max < price) max = price;
        priceData.push({
          price: +parseFloat(price).toFixed(2),
          date: i,
          y: convert(
            chart.result[0].timestamp[i],
            chart.result[0].meta.exchangeTimezoneName,
            range
          ),
          y2: chart.result[0].timestamp[i],
        });
        i++;
      } else close.shift();
    }
  }
  return { priceData, max, min };
};

export const getChartInfo = async ({
  ticker = "TSLA",
  range = "5d",
  interval = "1d",
  type = "normal",
}) => {
  try {
    range = range.toLowerCase();
    switch (range) {
      case "1d":
        interval = "1m";
        break;
      case "5d":
        interval = "30m";
        break;
      case "5y":
      case "max":
        interval = "5d";
        break;
      default:
        interval = "1d";
    }
    const { chart } = await getStockInfo(ticker, range, interval);

    switch (type) {
      case "normal":
        return normalDataTransform({ chart, range });
      case "tinygraph":
        return simpleDataTransform({ chart });
      default:
        return normalDataTransform({ chart, range });
    }
  } catch (err) {
    console.log(err);
    // alert("Err in getting chart from getChartInfo()? in YF.js");
  }
};

// plot with close price
// https://query1.finance.yahoo.com/v8/finance/chart/TSLA?symbol=TSLA&period1=1601478000&period2=1602217685&interval=1h&includePrePost=true`
// https://query1.finance.yahoo.com/v8/finance/chart/TSLA?region=US&lang=en-US&includePrePost=false&interval=1d&range=1d

// const priceData = close.map((price, i) => {
//   if (price)
//     return {
//       price: +parseFloat(price).toFixed(2),
//       date: i,
//       y: convert(chart.result[0].timestamp[i]),
//       y2: chart.result[0].timestamp[i],
//     }
// })

// const api = `${REACT_APP_CORS}/${v8}/finance/chart/${symbol}?symbol=${symbol}&period1=${p1}&period2=${p2}&interval=${interval}&includePrePost=true`
// console.log(api)

// const v7 = `${REACT_APP_YF}/v7`

// const q2 = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=`

// const getBasicInfo = async (symbol = 'TSLA') => {
//   const api = `${REACT_APP_CORS}/${q2}${symbol}`

//   const res = await fetch(api)
//   if (res.ok) return await res.json()

//   const err = await res.text()
//   throw new Error(err)
// }
