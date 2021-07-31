import React, { useEffect } from "react";
import { Chart } from "@antv/g2";

import { getChartInfo } from "api/YF";
import { convert5d1m } from "utils/date";

const Graph = ({ ticker, range, history }) => {
  useEffect(() => {
    document.getElementById("antg").innerHTML = "";

    const initGraph = async () => {
      try {
        const { priceData, max, min } = await getChartInfo({ ticker, range });
        // console.log({ priceData, max, min });
        // if (!priceData) return history.push("/");
        // if (priceData.length === 0) return history.push("/");

        let chart = new Chart({
          container: "antg",
          autoFit: true,
          height: 500,
        });

        chart.data(priceData);

        const adjMax = max + (max - min) * 0.2;
        const adjMin = min - (max - min) * 0.2; // min has to be > 0
        // console.log({ adjMax, adjMin });
        chart.scale({
          price: {
            // expla: use "max - min" prob more suitable. works well w high stock prices and small stock price fluctuation
            max: adjMax,
            min: adjMin, // min has to be > 0
          },
          date: {
            tickCount: 10,
          },
        });

        // i =/= date in priceData, find out why
        chart.axis("date", {
          label: {
            formatter: (i) => {
              return convert5d1m(priceData[i].y2, range);
            },
          },
        });

        chart.tooltip({ title: "y" });
        chart.area().position("date*price").color("#1890ff").style({
          fillOpacity: 0.2,
        });
        chart.line().position("date*price").color("#1890ff");
        chart.render();
      } catch (err) {
        console.log("graph.js", err);
        // history.push("/");
      }
    };

    initGraph();
  }, [ticker, range]);

  return <div id="antg"></div>;
};
export default Graph;
