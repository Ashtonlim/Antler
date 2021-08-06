import React from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";

import { currencyF } from "utils/format";

const createInnerAndOuterTables = (data) => {
  if (!Array.isArray(data)) return { innerTableData: [], outerTableData: [] };

  const innerTableData = data.reduce((acc, { ticker, stock_orders }) => {
    acc[ticker] = {
      // need to add key, quite unnecessary computational cost
      stock_orders: stock_orders.map((e, key) => ({ key, ...e })),
      ...stock_orders.reduce(
        (totalAcc, { quantity, order_price }) => ({
          totalQty: totalAcc.totalQty + quantity,
          totalVal: totalAcc.totalVal + order_price * quantity,
        }),
        { totalQty: 0, totalVal: 0 }
      ),
    };

    return acc;
  }, {});

  // Object.entries({key1: val1, key2, val2}) -> [[key1, val1], [key2, val2]]
  const outerTableData = Object.entries(innerTableData).map(
    ([ticker, { totalQty, totalVal }]) => ({
      key: ticker,
      ticker: <Link to={`/stock/${ticker}`}>{ticker}</Link>,
      avgPrice: currencyF(totalVal / totalQty),
      totalVal: currencyF(totalVal),
      totalQty,
    })
  );

  // console.log({ innerTableData, outerTableData });
  return { data, outerTableData, innerTableData };
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
        dataSource={innerTableData[e.ticker.props.children]["stock_orders"]}
        pagination={false}
      />
    );
  };

  const columns = [
    { title: "Ticker", dataIndex: "ticker", key: "ticker" },
    { title: "Avg price", dataIndex: "avgPrice", key: "avgPrice" },
    { title: "Total value", dataIndex: "totalVal", key: "totalVal" },
    { title: "Total shares", dataIndex: "totalQty", key: "totalQty" },
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
