import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";

import GC from "context";
import MainLayout from "components/layouts/MainLayout";

const createL1 = (data) => {
  // for (let i = 0; i < data.length; i++) {
  //   const element = data[i].ticker;
  // }
  // console.log(
  //   "get unique tickers",
  //   data.reduce(
  //     (acc, { ticker }) => (acc.includes(ticker) ? acc : [...acc, ticker]),
  //     []
  //   )
  // );

  // = {
  //   orders: ,
  //   // (acc[ticker].avgPrice * acc["sumQty"] + order_price * quantity) /
  //   // (acc["sumQty"] + quantity),
  // };

  // console.log(
  //   "get unique tickers",
  //   data.reduce((acc, { ticker, order_price, quantity, createdAt }) => {
  //     if (ticker in acc) {
  //       acc[ticker]["orders"].push({ order_price, quantity, createdAt });
  //     } else {
  //       acc[ticker] = { orders: [{ order_price, quantity, createdAt }] };
  //     }
  //     return acc;
  //   }, {})
  // );

  const innerTableData = data.reduce(
    (acc, { ticker, order_price, quantity, createdAt }) => {
      if (ticker in acc) {
        acc[ticker].push({ price: order_price, quantity, createdAt });
      } else {
        acc[ticker] = [{ price: order_price, quantity, createdAt }];
      }
      return acc;
    },
    {}
  );

  // const outerTableData = {}
  // for (const [key, value] of Object.entries(innerTableData)) {
  //   innerTableData[key].reduce((acc, curr) => {acc}, [])
  //   // outerTableData
  // }

  console.log(
    "akjsd",
    Object.entries(innerTableData).map((e) => ({
      ticker: e[0],
      avg_price: 5,
      quantity: 10,
    }))
  );

  return {
    innerTableData,
    outerTableData: Object.entries(innerTableData).map((e) => ({
      ticker: <Link to={`/stock/${e[0]}`}>{e[0]}</Link>,
      avg_price: 5,
      quantity: 10,
    })),
  };

  // ...e[1].reduce((acc, {order_price, quantity}))
};

const Portfolio = () => {
  const { state } = useContext(GC);
  const [portfolio, setPortfolio] = useState([]);
  useEffect(() => {
    // const initPortfolio = () => {
    // };
    // initPortfolio()
    console.log(state.userObj);
    setPortfolio(state.userObj.stock_portfolio);
  }, [state.userObj.stock_portfolio]);

  const expandedRowRender = (e) => {
    const columns = [
      { title: "Price", dataIndex: "price", key: "price" },
      { title: "Quantity", dataIndex: "quantity", key: "quantity" },
      { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
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
    { title: "Avg_price", dataIndex: "avg_price", key: "avg_price" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
  ];

  const { innerTableData, outerTableData } = createL1(portfolio);
  console.log({ innerTableData, outerTableData });
  return (
    <MainLayout>
      <Table
        className="components-table-demo-nested"
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={outerTableData}
      />
    </MainLayout>
  );
};

export default Portfolio;
