import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { getCompanyInfo } from "api/YF";

import MainLayout from "./layouts/MainLayout";
import Graph from "./Graph";
import BuySellModal from "./subComponents/BuySellModal";
import GC from "context";

const Stock = (props) => {
  const { state } = useContext(GC);
  const symbol = useLocation().pathname.split("/").pop();
  const range = ["1D", "5D", "3MO", "6MO", "1Y", "5Y", "MAX"];
  console.log("alksdjfl");

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
    var localarr = JSON.parse(localStorage["arr" + "+" + state.username]);
    if (localarr.includes(symbol) === false) {
      alert(symbol + " is added to watchlist!");
      localarr.push(symbol);
      localStorage["arr" + "+" + state.username] = JSON.stringify(localarr);
    } else {
      alert(symbol + " is already in watchlist!");
    }
  };

  return (
    <MainLayout>
      <section>
        {coyInfo && ticker && (
          <div>
            <h1 className="my-1">{coyInfo.price.shortName}</h1>
            <div style={{ float: "right" }}>
              {state.loggedIn ? (
                <>
                  <BuySellModal
                    coyInfo={coyInfo}
                    symbol={symbol}
                    state={state}
                  />
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
            <h3 className="m-0">
              {coyInfo.price.exchangeName}: {ticker}
            </h3>
            <h3 className="inblk">{coyInfo.price.regularMarketPrice.raw}</h3>{" "}
            <span> {coyInfo.price.currency}</span>
            <span
              className={
                coyInfo.price.regularMarketChange.raw > 0 ? "gr" : "rd"
              }
            >
              {" "}
              {coyInfo.price.regularMarketChange.fmt} (
              {coyInfo.price.regularMarketChangePercent.fmt})
            </span>
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
          <div>
            <div>Volume {coyInfo.summaryDetail.volume.fmt}</div>
            <div>Market Cap {coyInfo.summaryDetail.marketCap.fmt}</div>
            <div>52-wk high {coyInfo.summaryDetail.fiftyTwoWeekHigh.fmt}</div>
            <div>52-wk low {coyInfo.summaryDetail.fiftyTwoWeekLow.fmt}</div>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Stock;
