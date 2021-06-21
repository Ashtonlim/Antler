import React from "react";
import { Redirect } from "react-router-dom";

import { convert } from "utils/date";
import { resHandler } from "./factory";

const { REACT_APP_CORS, REACT_APP_YF } = process.env;

const v10 = `${REACT_APP_YF}/v10`;
const v8 = `${REACT_APP_YF}/v8`;

export const getStockInfo = async (symbol = "TSLA", range = "5d", interval) => {
  const api = `${REACT_APP_CORS}/${v8}/finance/chart/${symbol}?symbol=${symbol}&range=${range}&interval=${interval}`;
  return await resHandler(await fetch(api));
};

export const getCompanyInfo = async (symbol = "TSLA", modules = ["price"]) => {
  let api = `${REACT_APP_CORS}/${v10}/finance/quoteSummary/${symbol}?modules=`;
  for (const v of modules) {
    api += "%2C" + v;
  }
  return await resHandler(await fetch(api));
};

export const getChartInfo = async (
  symbol = "TSLA",
  range = "5d",
  interval = "1d"
) => {
  const priceData = [];
  let max = 0;
  let min = 99999;
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
    const { chart } = await getStockInfo(symbol, range, interval);

    // console.log('chart')
    console.log(chart);

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
  } catch (err) {
    alert("Err in getting chart from getChartInfo() in YF.js");
    return <Redirect to="/" />;
  }
  return { priceData, max, min };
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
