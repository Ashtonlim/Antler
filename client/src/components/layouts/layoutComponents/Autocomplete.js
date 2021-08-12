import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input, AutoComplete } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { getUsers } from "api/user";
import stockData from "./stocks.json";

const renderUser = ({ username }) => {
  return {
    value: username,
    label: (
      <Link to={`/profile/${username}`}>
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
      <Link to={`/stock/${encodeURIComponent(symbol)}`}>
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

const Autocomplete = () => {
  const [searchPredict, setSearchPredict] = useState("");
  const [users, setUsers] = useState([]);
  const [stocks, setStocks] = useState([]);
  let options = [];

  useEffect(() => {
    // Review: It should be the case the user has the most recent set of stocks and users
    // To fix: requires api req everytime a user types something into search bar (finds latest lists)
    const initData = async () => {
      setStocks(stockData);
      setUsers(await getUsers());
    };
    initData();
  }, []);

  if (Array.isArray(stocks) && stocks.length > 0) {
    options.push({
      label: <span>Stocks</span>,
      options: stocks
        .filter(
          (stock) =>
            stock.symbol.includes(searchPredict) ||
            stock["name"].toUpperCase().includes(searchPredict)
        )
        .slice(0, 5)
        .map((stock) => renderStock(stock)),
    });
  } else {
    // console.log("--RMV-- Autocomplete.js: AC either empty or not array");
  }

  if (Array.isArray(users) && users.length > 0) {
    options.push({
      label: (
        <span>
          Users{users.length === 0 ? " cannot be retrieved right now" : ""}
        </span>
      ),
      options: users
        .filter((user) => user.username.toUpperCase().includes(searchPredict))
        .slice(0, 5)
        .map((user) => renderUser(user)),
    });
  } else {
    // console.log("--RMV-- users either empty or not array");
  }

  const handleSymbol = (values) => {
    setSearchPredict(values.toUpperCase());
  };

  return (
    <AutoComplete
      className="w-full"
      dropdownClassName="certain-category-search-dropdown"
      dropdownMatchSelectWidth={500}
      onChange={handleSymbol}
      options={options}
    >
      <Input.Search
        size="large"
        placeholder="Search for Companies or Users..."
      />
    </AutoComplete>
  );
};

export default Autocomplete;
