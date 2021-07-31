import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

import MainLayout from "components/layouts/MainLayout";
import TinyStockChart from "components/subComponents/TinyStockChart";
import ButtonTWP from "components/subComponents/ButtonTWP";

import GC from "context";
import { EDIT_TO_WATCHLIST } from "actionTypes";
import { getCompanyInfo } from "api/YF";
import { currConv } from "api/apiUtils";

import { api_editWatchlist } from "api/user";
import { currencyF } from "utils/format";

import Graph from "./Graph";
import StockCalendarDates from "./StockCalendarDates";
import StockMetrics from "./StockMetrics";
import StockOfficers from "./StockOfficers";
import Modal from "components/subComponents/Modal";

const Stock = (props) => {
  const { state, dispatch } = useContext(GC);
  const symbol = useLocation().pathname.split("/").pop();
  const range = ["1D", "5D", "3MO", "6MO", "1Y", "5Y", "MAX"];

  const [onFocus, setOnFocus] = useState(1);
  const [coyInfo, setCoyInfo] = useState("");
  const [ticker, setTicker] = useState(symbol.toUpperCase());
  const [forex, setForex] = useState(0);
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [noOfSharesToBuy, setNoOfSharesToBuy] = useState(0);

  useEffect(() => {
    setTicker(symbol.toUpperCase());
    const getInfo = async () => {
      try {
        const res = await getCompanyInfo(symbol, [
          "assetProfile",
          "summaryDetail",
          "price",
        ]);
        const apiData = res.quoteSummary?.result[0];

        // use api results directly, probably easier/fewer issues
        document.title =
          apiData.price?.shortName && symbol
            ? `${
                apiData.price?.longName
              } ${symbol.toUpperCase()} Stock Price | Antler`
            : "Antler Company Stock Price";

        console.log({ apiData });
        setCoyInfo(apiData);
        setForex(
          (
            await currConv({
              from: apiData.price?.currency,
              to: "SGD",
            })
          )[`${apiData.price?.currency.toUpperCase()}_SGD`]
        );
      } catch (err) {
        // props.history.push("/stocks/TSLA");
        console.log(err);
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
        type: EDIT_TO_WATCHLIST,
        payload: await api_editWatchlist({
          value: { action: "update", tickers: [ticker] },
        }),
      });
    } catch ({ message }) {
      console.log(message);
    }
  };

  const rmFromWatchlist = async () => {
    try {
      dispatch({
        type: EDIT_TO_WATCHLIST,
        payload: await api_editWatchlist({
          value: { action: "delete", tickers: [ticker] },
        }),
      });
    } catch ({ message }) {
      console.log(message);
    }
  };

  const shareBuyInput = (e) => {
    const val = +e.target.value;
    const limit = ~~(
      (state.userObj?.funds * (1 / forex)) /
      coyInfo.price?.regularMarketPrice?.raw
    );

    if (isNaN(val) || val < 0) return;
    if (val > limit) setNoOfSharesToBuy(limit);
    else setNoOfSharesToBuy(val);
  };

  const buyShares = () => {
    try {
    } catch (err) {}
  };

  return (
    <MainLayout>
      {coyInfo.price ? (
        <Modal
          title={`Buy ${coyInfo.price?.shortName} Shares`}
          visibility={buyModalVisible}
          onClose={() => setBuyModalVisible(false)}
          footerButtons={[
            <ButtonTWP
              key={1}
              text={`Buy ${noOfSharesToBuy} shares for ${currencyF(
                noOfSharesToBuy * coyInfo.price.regularMarketPrice.raw * forex,
                "SGD"
              )}`}
              onClick={buyShares}
            />,
          ]}
        >
          <div className="relative p-6 flex-auto">
            <div>
              <span className="link px-3">
                {`Max shares buyable: ${~~(
                  (state.userObj?.funds * (1 / forex)) /
                  coyInfo.price?.regularMarketPrice?.raw
                )}`}
              </span>
              {/* <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Shares:
            </label> */}
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 px-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">Purchase</span>
                </div>

                <input
                  type="text"
                  name="shares"
                  id="price"
                  value={noOfSharesToBuy}
                  onChange={shareBuyInput}
                  className="focus:indigo-500 focus:border-indigo-500 block w-full pl-20 py-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                />

                <div className="absolute inset-y-0 right-0 px-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    shares x{" "}
                    {currencyF(
                      coyInfo.price.regularMarketPrice?.raw,
                      coyInfo.price.currency
                    )}
                    /share =
                    {` ${currencyF(
                      noOfSharesToBuy * coyInfo.price.regularMarketPrice.raw,
                      coyInfo.price.currency
                    )} ${coyInfo.price.currency}`}
                  </span>
                </div>
              </div>
              <div className="text-right px-3">
                {`(1 ${
                  coyInfo.price?.currency
                } = ${forex} SGD) Total: ${currencyF(
                  noOfSharesToBuy *
                    coyInfo.price.regularMarketPrice.raw *
                    forex,
                  "SGD"
                )}`}
              </div>
              <div className="text-right px-3">
                {`Remainder Funds: ${currencyF(
                  state.userObj?.funds -
                    noOfSharesToBuy *
                      coyInfo.price.regularMarketPrice.raw *
                      forex,
                  "SGD"
                )}`}
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        <div></div>
      )}
      <section className="card mb-3">
        {coyInfo && ticker && (
          <div>
            <div style={{ float: "right" }}>
              {state.loggedIn ? (
                <>
                  {state.userObj.stock_watchlist.includes(ticker) ? (
                    <ButtonTWP
                      text="Remove from Watchlist"
                      onClick={rmFromWatchlist}
                    />
                  ) : (
                    <ButtonTWP
                      text="Add to Watchlist"
                      onClick={addToWatchlist}
                    />
                  )}
                  <ButtonTWP
                    className="ml-12 mr-5"
                    text="Buy"
                    color="green"
                    onClick={setBuyModalVisible}
                  />
                  <ButtonTWP
                    className=""
                    text="Sell"
                    color="red"
                    onClick={setSellModalVisible}
                  />
                </>
              ) : (
                <Link to="/login">
                  <ButtonTWP text="Login to Trade" />
                </Link>
              )}
            </div>

            <h1 className="di mtb-0">
              {currencyF(
                coyInfo.price.regularMarketPrice.raw,
                coyInfo.price.currency
              )}{" "}
              {coyInfo.price.currency}
              <span
                className={`ml-2 p-1 px-3 ${
                  coyInfo.price.regularMarketChangePercent?.raw >= 0
                    ? "text-green-700 bg-green-100"
                    : "text-red-700 bg-red-100"
                } rounded`}
              >
                Today{" "}
                {coyInfo.price.regularMarketChange?.raw > 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}{" "}
                {coyInfo.price.regularMarketChange.fmt} {coyInfo.price.currency}{" "}
                ({coyInfo.price.regularMarketChangePercent.fmt})
              </span>
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

      <div className="mb-5">
        <TinyStockChart ticker={"GOOG"} />
        <TinyStockChart ticker={"FUTU"} />
        <TinyStockChart ticker={"MSFT"} />
        <TinyStockChart ticker={"BABA"} />
      </div>

      {coyInfo.summaryDetail && (
        <StockMetrics summaryDetail={coyInfo.summaryDetail} />
      )}

      <StockCalendarDates />

      {/* {coyInfo.assetProfile && (
        <StockOfficers companyOfficers={coyInfo.assetProfile.companyOfficers} />
      )} */}
    </MainLayout>
  );
};

export default Stock;
