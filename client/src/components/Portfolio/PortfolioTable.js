import React from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";

import { currencyF } from "utils/format";

const createInnerAndOuterTables = (data) => {
  if (!Array.isArray(data)) return { innerTableData: [], outerTableData: [] };
  let aggregateDataOn = {};
  const innerTableData = data.reduce(
    (acc, { ticker, order_price, quantity, createdAt }) => {
      // if key doesnt exist, create one
      if (ticker in acc) {
        acc[ticker].push({ order_price, quantity, createdAt });
        aggregateDataOn[ticker]["totalValue"] += order_price * quantity;
        aggregateDataOn[ticker]["totalQuantity"] += quantity;
      } else {
        acc[ticker] = [{ order_price, quantity, createdAt }];
        aggregateDataOn[ticker] = {
          totalValue: order_price * quantity,
          totalQuantity: quantity,
        };
      }
      return acc;
    },
    {}
  );
  return {
    outerTableData: Object.entries(innerTableData).map((e) => ({
      key: e[0],
      ticker: <Link to={`/stock/${e[0]}`}>{e[0]}</Link>,
      avgPrice: currencyF(
        aggregateDataOn[e[0]]["totalValue"] /
          aggregateDataOn[e[0]]["totalQuantity"]
      ),
      totalQuantity: aggregateDataOn[e[0]]["totalQuantity"],
      totalValue: currencyF(aggregateDataOn[e[0]]["totalValue"]),
    })),
    innerTableData,
  };
};

const PortfolioTable = ({ portfolio }) => {
  const expandedRowRender = (e) => {
    const columns = [
      { title: "Price", dataIndex: "order_price", key: "order_price" },
      { title: "Quantity", dataIndex: "quantity", key: "quantity" },
      { title: "Order date", dataIndex: "createdAt", key: "createdAt" },
    ];

    console.log({ innerTableData });
    return (
      <Table
        columns={columns}
        dataSource={innerTableData[e.ticker.props.children]}
        pagination={false}
      />
    );
  };

  const columns = [
    { title: "Ticker", dataIndex: "ticker", key: "ticker" },
    { title: "Avg price", dataIndex: "avgPrice", key: "avgPrice" },
    { title: "Total value", dataIndex: "totalValue", key: "totalValue" },
    { title: "Total shares", dataIndex: "totalQuantity", key: "totalQuantity" },
  ];

  const { outerTableData, innerTableData } =
    createInnerAndOuterTables(portfolio);

  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      expandable={{ expandedRowRender }}
      dataSource={outerTableData}
    />
  );
};

export default PortfolioTable;
