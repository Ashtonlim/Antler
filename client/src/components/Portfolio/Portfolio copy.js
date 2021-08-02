import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";

import GC from "context";
import MainLayout from "components/layouts/MainLayout";

const Portfolio = () => {
  const { state, dispatch } = useContext(GC);
  const [portfolio, setPortfolio] = useState([]);
  useEffect(() => {
    // const initPortfolio = () => {
    // };
    // initPortfolio()
    console.log(state.userObj);
    setPortfolio(state.userObj.stock_portfolio);
  }, [state.userObj.stock_portfolio]);

  const columns = [
    {
      title: "Ticker",
      dataIndex: "ticker",
      // specify the condition of filtering result
      // here is that finding the ticker started with `value`
      //   onFilter: (value, record) => record.ticker.indexOf(value) === 0,
      sorter: {
        // requires props.children bc ticker now in <Link> component
        compare: (a, b) =>
          a.ticker.props.children.localeCompare(b.ticker.props.children),
        multiple: 2, //priority
      },
    },
    {
      title: "Order Price",
      dataIndex: "order_price",
      defaultSortOrder: "descend",
      sorter: {
        compare: (a, b) => a.order_price - b.order_price,
        multiple: 1, //priority
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: {
        compare: (a, b) => a.quantity - b.quantity,
        multiple: 3, //priority
      },
    },
  ];

  const data = portfolio.map(({ ticker, order_price, quantity }, key) => ({
    key,
    ticker: <Link to={`/stock/${ticker}`}>{ticker}</Link>,
    order_price,
    quantity,
  }));
  console.log(data);

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <MainLayout>
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </MainLayout>
  );
};

export default Portfolio;
