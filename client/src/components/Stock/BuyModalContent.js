import React from "react";
import { currencyF } from "utils/format";

const BuyModalContent = ({
  price,
  forex,
  noOfSharesToBuy,
  setNoOfSharesToBuy,
  funds,
}) => {
  const onNoOfShareToBuyChange = (e) => {
    const val = +e.target.value;
    const limit = ~~(funds / (price?.regularMarketPrice?.raw * forex));

    if (isNaN(val) || val < 0) return;
    if (val > limit) setNoOfSharesToBuy(limit);
    else setNoOfSharesToBuy(val);
  };

  return (
    <div className="relative p-6 flex-auto">
      {/* Review: removed a div here, not sure if will cause issues... check di#01 */}
      <span className="link px-3">
        {`Max shares buyable: ${~~(
          (funds * (1 / forex)) /
          price.regularMarketPrice?.raw
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
          <span className="text-gray-500 sm:text-sm">Buy</span>
        </div>

        <input
          type="text"
          name="shares"
          id="price"
          value={noOfSharesToBuy}
          onChange={onNoOfShareToBuyChange}
          className="focus:indigo-500 focus:border-indigo-500 block w-full pl-10 py-3 pr-12 sm:text-sm border-gray-300 rounded-md"
          placeholder="0"
        />

        <div className="absolute inset-y-0 right-0 px-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">
            shares x {currencyF(price.regularMarketPrice?.raw, price.currency)}
            /share =
            {` ${currencyF(
              noOfSharesToBuy * price.regularMarketPrice.raw,
              price.currency
            )} ${price.currency}`}
          </span>
        </div>
      </div>
      <div className="text-right px-3">
        {`Total: ${currencyF(
          noOfSharesToBuy * price.regularMarketPrice.raw * forex,
          "SGD"
        )}`}
      </div>
      <div className="text-right px-3">
        {`Your New Balance: ${currencyF(
          funds + noOfSharesToBuy * price.regularMarketPrice.raw * forex,
          "SGD"
        )}`}
      </div>
    </div>
  );
};

export default BuyModalContent;