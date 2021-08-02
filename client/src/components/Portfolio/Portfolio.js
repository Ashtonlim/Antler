import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";

import GC from "context";
import MainLayout from "components/layouts/MainLayout";
import { currencyF } from "utils/format";

const createL1 = (data) => {
  let total = {};
  const innerTableData = data.reduce(
    (acc, { ticker, order_price, quantity, createdAt }) => {
      if (ticker in acc) {
        acc[ticker].push({ price: order_price, quantity, createdAt });
        total[ticker]["totalValue"] += order_price * quantity;
        total[ticker]["totalQuantity"] += quantity;
      } else {
        acc[ticker] = [{ price: order_price, quantity, createdAt }];
        total[ticker] = {
          totalValue: order_price * quantity,
          totalQuantity: quantity,
        };
      }
      return acc;
    },
    {}
  );
  console.log(total);
  return {
    outerTableData: Object.entries(innerTableData).map((e) => ({
      key: e[0],
      ticker: <Link to={`/stock/${e[0]}`}>{e[0]}</Link>,
      avgPrice: currencyF(
        total[e[0]]["totalValue"] / total[e[0]]["totalQuantity"]
      ),
      totalQuantity: total[e[0]]["totalQuantity"],
      totalValue: currencyF(total[e[0]]["totalValue"]),
    })),
    innerTableData,
  };
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

  const { outerTableData, innerTableData } = createL1(portfolio);

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
