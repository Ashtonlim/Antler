import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, AutoComplete } from "antd";
import { UserOutlined } from "@ant-design/icons";

import stockData from "./stocks.json";

const renderUser = ({ username }) => {
  return {
    value: username,
    label: (
      <Link to={`/friendprofile/${username}`}>
        <div className="ruRow">
          {username}
          <span>
            <UserOutlined />
          </span>
        </div>
      </Link>
    ),
  };
};

const renderStock = ({ symbol, name }) => {
  return {
    value: symbol,
    label: (
      <Link to={`/stocks/${encodeURIComponent(symbol)}`}>
        <li>
          <div className="sb-row ruRow">
            <div className="sb-symbol">{symbol}</div>
            <div className="sb-stock-name">{name}</div>
          </div>
        </li>
      </Link>
    ),
  };
};

const Autocomplete = ({ history }) => {
  const [searchPredict, setSearchPredict] = useState("");
  const [users, setUsers] = useState([]);
  const [stocks, setStocks] = useState([]);
  // console.log(stocks)
  useEffect(() => {
    const initUsersAndStocks = async () => {
      // setUsers(await getUsers());
      setStocks(stockData);
    };

    initUsersAndStocks();
  }, []);

  const handleSymbol = (values) => {
    setSearchPredict(values.toUpperCase());
  };

  const options = [
    {
      label: <span>Stocks</span>,
      options: stocks
        .filter(
          (stock) =>
            stock.symbol.includes(searchPredict) ||
            stock["name"].toUpperCase().includes(searchPredict)
        )
        .slice(0, 5)
        .map((stock) => renderStock(stock)),
    },
    // {
    //   label: <span>Users</span>,
    //   options: users
    //     .filter((user) => user.username.toUpperCase().includes(searchPredict))
    //     .slice(0, 5)
    //     .map((user) => renderUser(user)),
    // },
  ];

  return (
    <AutoComplete
      dropdownClassName="certain-category-search-dropdown"
      dropdownMatchSelectWidth={500}
      onChange={handleSymbol}
      style={{
        width: 550,
      }}
      options={options}
    >
      <Input.Search size="large" placeholder="input here" />
    </AutoComplete>
  );
};

export default Autocomplete;
