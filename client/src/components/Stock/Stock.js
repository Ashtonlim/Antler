import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { Button, Tag } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

import MainLayout from "../layouts/MainLayout";

import GC from "context";
import { getCompanyInfo } from "api/YF";
import { api_editWatchlist } from "api/user";
import { ADD_TO_WATCHLIST } from "actionTypes";

import Graph from "./Graph";
import StockCalendarDates from "./StockCalendarDates";
import StockMetrics from "./StockMetrics";
import StockOfficers from "./StockOfficers";

// import BuySellModal from "./subComponents/BuySellModal";

const Stock = (props) => {
  const { state, dispatch } = useContext(GC);
  const symbol = useLocation().pathname.split("/").pop();
  const range = ["1D", "5D", "3MO", "6MO", "1Y", "5Y", "MAX"];

  const [onFocus, setOnFocus] = useState(1);
  const [coyInfo, setCoyInfo] = useState("");
  const [ticker, setTicker] = useState(symbol.toUpperCase());

  useEffect(() => {
    setTicker(symbol.toUpperCase());
    const getInfo = async () => {
      try {
        const { quoteSummary } = await getCompanyInfo(symbol, [
          "assetProfile",
          "summaryDetail",
          "price",
        ]);

        console.log("quoteSummary", quoteSummary);
        setCoyInfo(quoteSummary.result[0]);
      } catch (err) {
        props.history.push("/stocks/TSLA");
      }
    };
    getInfo();
    console.log("change range", range[onFocus]);
  }, [props, onFocus]);

  const handleClick = (e) => {
    console.log("change date", range[onFocus]);
    setOnFocus(Array.from(e.currentTarget.children).indexOf(e.target));
  };

  const addToWatchlist = async () => {
    try {
      dispatch({
        type: ADD_TO_WATCHLIST,
        payload: await api_editWatchlist({
          value: { type: "add", tickers: [ticker] },
        }),
      });

      // setVisibility(false);
    } catch ({ message }) {
      console.log(message);
    }
  };

  return (
    <MainLayout>
      <section className="card mb-3">
        {coyInfo && ticker && (
          <div>
            <div style={{ float: "right" }}>
              {state.loggedIn ? (
                <>
                  {/* <BuySellModal
                    coyInfo={coyInfo}
                    symbol={symbol}
                    state={state}
                  /> */}
                  <Button type="primary" size="large" onClick={addToWatchlist}>
                    Add to Watchlist
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button size="large" type="primary">
                    Login to Trade
                  </Button>
                </Link>
              )}
            </div>

            <h1 className="di mtb-0">
              {coyInfo.price.regularMarketPrice.raw} {coyInfo.price.currency}
              <Tag
                style={{ margin: "0px 10px" }}
                icon={
                  coyInfo.price.regularMarketChange.raw > 0 ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )
                }
                color={
                  coyInfo.price.regularMarketChange.raw > 0 ? "#87d068" : "#f50"
                }
              >
                <span>
                  {" "}
                  {coyInfo.price.regularMarketChange.fmt}{" "}
                  {coyInfo.price.currency} (
                  {coyInfo.price.regularMarketChangePercent.fmt})
                </span>
              </Tag>
            </h1>
            <h2 className="mtb-0 m-0">
              {ticker}: {coyInfo.price.shortName}
            </h2>

            <div className="m-0">Listed on {coyInfo.price.exchangeName}</div>
          </div>
        )}
        <div onClick={handleClick} className="dateRangeBtns my-2">
          {range.map((r, key) => (
            <div
              key={key}
              className={`cbx dateRangeBtn ${key === onFocus ? "focus" : ""}`}
            >
              {r}
            </div>
          ))}
        </div>

        <div style={{ height: "500px" }} id="g">
          {ticker && <Graph ticker={symbol} range={range[onFocus]} />}
        </div>
      </section>

      {coyInfo.summaryDetail && (
        <StockMetrics summaryDetail={coyInfo.summaryDetail} />
      )}

      <StockCalendarDates />
      {coyInfo.assetProfile && (
        <StockOfficers companyOfficers={coyInfo.assetProfile.companyOfficers} />
      )}
    </MainLayout>
  );
};

export default Stock;
