import React, { useState, useEffect } from "react";
import { currF } from "utils/format";

const SellModalContent = ({
  ticker,
  price,
  forex,
  noOfSharesToSell,
  setNoOfSharesToSell,
  funds,
  stock_portfolio,
}) => {
  const [limit, setLimit] = useState(0);
  //   const [limit] = useState(0);

  // account for changes in portfolio? (i.e. user opens another tab)
  useEffect(() => {
    const orders = stock_portfolio.find(
      (e) => e.ticker === ticker
    )?.stock_orders;
    // if orders not array than orders.length should not execute so it is safe
    if (Array.isArray(orders) && orders.length > 0) {
      setLimit(orders.reduce((acc, e) => acc + e.quantity, 0));
    } else {
      setNoOfSharesToSell(0);
      setLimit(0);
      console.log("running");
    }
  }, [stock_portfolio, ticker, setNoOfSharesToSell]);

  const onSellSharesChange = (e) => {
    const val = +e.target.value;

    if (isNaN(val) || val < 0) return;
    if (val > limit) setNoOfSharesToSell(limit);
    else setNoOfSharesToSell(val);
  };

  return (
    <div className="relative p-6 flex-auto">
      <span className="link px-3">{`Shares you own: ${
        limit ? limit : 0
      }`}</span>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 px-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">Sell</span>
        </div>

        <input
          type="text"
          name="shares"
          id="price"
          value={noOfSharesToSell}
          onChange={onSellSharesChange}
          className="focus:indigo-500 focus:border-indigo-500 block w-full pl-10 py-3 pr-12 sm:text-sm border-gray-300 rounded-md"
          placeholder="0"
        />

        <div className="absolute inset-y-0 right-0 px-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">
            shares x {currF(price.regularMarketPrice?.raw, price.currency)}
            /share =
            {` ${currF(
              noOfSharesToSell * price.regularMarketPrice.raw,
              price.currency
            )} ${price.currency}`}
          </span>
        </div>
      </div>
      <div className="text-right px-3">
        {`Total: ${currF(
          noOfSharesToSell * price.regularMarketPrice.raw * forex,
          "SGD"
        )}`}
      </div>
      <div className="text-right px-3">
        {`Your New Balance: ${currF(
          funds + noOfSharesToSell * price.regularMarketPrice.raw * forex,
          "SGD"
        )}`}
      </div>
    </div>
  );
};

export default SellModalContent;
