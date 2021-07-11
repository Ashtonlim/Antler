import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { Statistic, Row, Col, Button, Tooltip, Tag } from "antd";
import {
  QuestionCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

import { getCompanyInfo } from "api/YF";
import MainLayout from "./layouts/MainLayout";
import Graph from "./Graph";
// import BuySellModal from "./subComponents/BuySellModal";
import GC from "context";

const Stock = (props) => {
  const { state } = useContext(GC);
  const symbol = useLocation().pathname.split("/").pop();
  const range = ["1D", "5D", "3MO", "6MO", "1Y", "5Y", "MAX"];

  const [onFocus, setOnFocus] = useState(1);
  const [coyInfo, setcoyInfo] = useState("");
  const [ticker, setTicker] = useState(symbol.toUpperCase());

  useEffect(() => {
    setTicker(symbol.toUpperCase());
    const getInfo = async () => {
      try {
        const { quoteSummary } = await getCompanyInfo(symbol, [
          "summaryDetail",
          "price",
        ]);

        setcoyInfo(quoteSummary.result[0]);
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

  const addWL = async () => {
    var localarr = JSON.parse(localStorage[`arr + ${state.username}`]);
    if (localarr.includes(symbol) === false) {
      alert(`${symbol} is added to watchlist!`);
      localarr.push(symbol);
      localStorage[`arr + ${state.username}`] = JSON.stringify(localarr);
    } else {
      alert(`${symbol} is already in watchlist!`);
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
                  <Button type="primary" size="large" onClick={addWL}>
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
      <section className="my-5">
        {coyInfo && (
          <Row className="card" gutter={16}>
            <Col span={3}>
              <Statistic
                title={
                  <Tooltip title="The average number of shares traded each day over the past 30 days">
                    Volume <QuestionCircleOutlined />
                  </Tooltip>
                }
                value={coyInfo.summaryDetail.volume.fmt}
              />
            </Col>

            <Col span={3}>
              <Statistic
                title={
                  <Tooltip title="The ratio of annual dividend to current share price that estimates the dividend return of a stock">
                    Dividend <QuestionCircleOutlined />
                  </Tooltip>
                }
                value={coyInfo.summaryDetail.dividendYield.fmt || "-"}
              />
            </Col>

            <Col span={4}>
              <Statistic
                title={
                  <Tooltip title="The ratio of current share price to trailing 12-month EPS that signals if the price is high or low compared to other stocks">
                    Price/Earnings Ratio <QuestionCircleOutlined />
                  </Tooltip>
                }
                value={
                  coyInfo.summaryDetail.trailingPE
                    ? coyInfo.summaryDetail.trailingPE.fmt
                    : "-"
                }
              />
            </Col>

            <Col span={4}>
              <Statistic
                title={
                  <Tooltip title="A valuation method that multiplies the price of a company's shares by the total number of outstanding shares.">
                    Market Cap <QuestionCircleOutlined />
                  </Tooltip>
                }
                value={
                  coyInfo.summaryDetail.marketCap.fmt
                    ? `${coyInfo.summaryDetail.marketCap.fmt} ${coyInfo.summaryDetail.currency}`
                    : "-"
                }
              />
            </Col>

            <Col span={6}>
              <Statistic
                title={
                  <Tooltip title="The difference between the high and low prices over the past 52 weeks">
                    <span>
                      52 Week Range <QuestionCircleOutlined />
                    </span>
                  </Tooltip>
                }
                value={`$${coyInfo.summaryDetail.fiftyTwoWeekLow.fmt} - $${coyInfo.summaryDetail.fiftyTwoWeekHigh.fmt}`}
              />
            </Col>
            {/* <Col span={12}>
          <Statistic title="Active Users" value={112894} loading />
        </Col> */}
          </Row>
        )}
      </section>
    </MainLayout>
  );
};

export default Stock;
