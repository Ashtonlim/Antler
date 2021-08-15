import React, { useState, useEffect } from "react";
import { Table } from "antd";
import protobuf from "protobufjs";

import { currF, round } from "utils/format";

const UpDown = ({ val }) => {
  return (
    <span
      className={`p-1 px-3 ${
        val >= 0 ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
      } rounded`}
    >
      {val}%
    </span>
  );
};

const PortfolioTable = ({ innerTableData, outerTableData, setOuter }) => {
  const [OTB, setOTB] = useState(outerTableData);
  useEffect(() => {
    if (OTB.length) {
      // do open here, prevent running it twice????
      protobuf.load("./YPricingData.proto", (error, root) => {
        if (error) {
          return alert(error);
        }

        const yfticker = root.lookupType("yfticker");
        const ws = new WebSocket("wss://streamer.finance.yahoo.com/");
        ws.onopen = function open() {
          ws.send(
            JSON.stringify({
              subscribe: OTB.map((e) => e.key.toUpperCase()),
            })
          );
          console.log("connected");
        };

        // when does this dc?
        ws.onclose = function close() {
          console.log("disconnected");
        };

        ws.onmessage = function incoming(message) {
          // new Buffer(data, "base64") ===  Uint8Array.from(window.atob(data), (c) => c.charCodeAt(0))
          // avoiding Buffer to avoid installing Buffer package.
          // data is a Base64 encoded binary string (binary represented as ascii) that is converted to arr of integers.
          // atob converts the Ascii TO Binary -> (ATOB) and
          // the following => fn is just mapping the binary array produced into integers
          // to test: window.atob(message.data).split('').map(c => c.charCodeAt(0))
          // atob produces a string, split converts to arr, map so u can return arr of integers
          // const next = yfticker.decode(new Buffer(message.data, "base64")); // prev usage

          let next = yfticker.decode(
            Uint8Array.from(window.atob(message.data), (c) => c.charCodeAt(0))
          );

          console.log({ root, yfticker, next, OTB });

          let i = OTB.findIndex((e) => e.key === next.id);

          OTB[i]["mktPrice"] = [next.price, next.currency];
          OTB[i]["pnl"] =
            ((next.price - OTB[i].avgPrice) / OTB[i].avgPrice) * 100;
          setOTB([...OTB]);
        };
      });
    }
  }, [outerTableData]);

  const expandedRowRender = (e) => {
    const columns = [
      { title: "Price", dataIndex: "order_price", key: "order_price" },
      { title: "Quantity", dataIndex: "quantity", key: "quantity" },
      { title: "Order date", dataIndex: "createdAt", key: "createdAt" },
    ];

    return (
      <Table
        columns={columns}
        dataSource={innerTableData[e.ticker.props.children]["stock_orders"]}
        pagination={false}
      />
    );
  };

  const columns = [
    { title: "Ticker", dataIndex: "ticker", key: "ticker" },
    {
      title: "Avg price",
      dataIndex: "avgPrice",
      key: "avgPrice",
      render: (t) => currF(t),
    },
    {
      title: "Total value",
      dataIndex: "totalVal",
      key: "totalVal",
      render: (t) => currF(t),
    },
    { title: "Total shares", dataIndex: "totalQty", key: "totalQty" },
    {
      title: "Current market price",
      dataIndex: "mktPrice",
      key: "mktPrice",
      render: (t) =>
        !t && !Array.isArray(t) && isNaN(t[0]) ? "-" : `${currF(t[0], t[1])}`,
    },
    {
      title: "Profit/Loss %",
      dataIndex: "pnl",
      key: "pnl",
      // incase YF provides invalid type?
      render: (t) => (isNaN(t) ? "-" : <UpDown val={round(t, 2)} />),
    },
    {
      title: "Weightage in %",
      dataIndex: "weightage",
      key: "weightage",
      render: (t) => `${round(t, 3)}%`,
    },

    {
      title: "action",
      dataIndex: "action",
      key: "action",
    },
  ];

  return (
    <>
      <Table
        className="components-table-demo-nested"
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={outerTableData}
      />
    </>
  );
};

export default PortfolioTable;
