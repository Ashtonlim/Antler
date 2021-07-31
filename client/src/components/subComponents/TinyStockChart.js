import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import TinyGraph from "./TinyGraph";
import { getCompanyInfo, getChartInfo } from "api/YF";

const TinyStockChart = ({ ticker }) => {
  const [YFPrice, setYFPrice] = useState({});
  const [graphData, setGraphData] = useState({});
  const [range, setRange] = useState("1Y");

  useEffect(() => {
    const initTinyStockChart = async () => {
      try {
        const { quoteSummary } = await getCompanyInfo(ticker);
        // const { historicalPriceData, max, min } = ;
        setGraphData(
          await getChartInfo({
            ticker,
            range,
            interval: "5d",
            type: "tinygraph",
          })
        );
        setYFPrice(quoteSummary.result[0].price);
      } catch (err) {
        console.log(err);
      }
    };
    initTinyStockChart();
  }, [ticker, range]);

  // console.log({ range });
  const changeRange = (e) => {
    console.log(e.target.innerText);

    switch (e.target.innerText) {
      case "1Y":
        setRange("5Y");
        break;
      case "5Y":
        setRange("6MO");
        break;
      case "6MO":
        setRange("1Y");
        break;
      default:
        setRange("1Y");
    }
  };

  return (
    <Link
      to={`/stock/${ticker}`}
      className="augDM p-3.5 mr-4 shadow-xl rounded-md inline-block transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
    >
      <h3>
        {ticker ? ticker : "(Ticker)"} {YFPrice.currencySymbol}
        {YFPrice.regularMarketPrice?.raw} UP
        <span
          className={`pl-1 mx-1 rounded ${
            ((graphData.last - graphData.first) / graphData.first) * 100 >= 0
              ? "text-green-700 bg-green-200"
              : "text-red-700 bg-red-200"
          }`}
        >
          {(
            ((graphData.last - graphData.first) / graphData.first) *
            100
          ).toFixed(2) + "%"}{" "}
        </span>
        IN{" "}
        <button
          onClick={changeRange}
          className="px-1 font-medium border-2 border-gray-600 hover:bg-blue-300 rounded"
        >
          {range}
        </button>
      </h3>
      <TinyGraph ticker={ticker} data={graphData} />
    </Link>
  );
};

export default TinyStockChart;
