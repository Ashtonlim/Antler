import React, { useState, useEffect } from 'react'
import { currF } from 'utils/format'

const BuyModalContent = ({
  price,
  forex,
  noOfSharesToBuy,
  setNoOfSharesToBuy,
  funds,
}) => {
  // setNoOfSharesToBuy
  const [limit, setLimit] = useState(
    ~~(funds / (price?.regularMarketPrice?.raw * forex))
  )
  useEffect(() => {
    let max = ~~(funds / (price?.regularMarketPrice?.raw * forex))
    if (max === 0) setNoOfSharesToBuy(max)
    setLimit(max)
  }, [setNoOfSharesToBuy, funds, price, forex])

  const onBuySharesChange = (e) => {
    const val = +e.target.value

    if (isNaN(val) || val < 0) return
    if (val > limit) setNoOfSharesToBuy(limit)
    else if (limit === 0) setNoOfSharesToBuy(0)
    else setNoOfSharesToBuy(val)
  }

  return (
    <div className="relative p-6 flex-auto">
      {/* Review: removed a div here, not sure if will cause issues... check di#01 */}
      {/* <span className="link px-3">{`Buy max : ${limit} shares`}</span> */}

      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 px-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">Buy</span>
        </div>

        <input
          type="text"
          name="shares"
          id="price"
          value={noOfSharesToBuy}
          onChange={onBuySharesChange}
          className="focus:indigo-500 focus:border-indigo-500 block w-full pl-10 py-3 pr-12 sm:text-sm border-gray-300 rounded-md"
          placeholder="0"
        />

        <div className="absolute inset-y-0 right-0 px-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">
            shares for {currF(price.regularMarketPrice?.raw, price.currency)} =
            {` ${currF(
              noOfSharesToBuy * price.regularMarketPrice.raw,
              price.currency
            )} ${price.currency}`}
          </span>
        </div>
      </div>
      <div className="text-right px-3">
        {`Total ${currF(
          noOfSharesToBuy * price.regularMarketPrice.raw * forex,
          'SGD'
        )}`}
      </div>
      <div className="text-right px-3">
        {`Your New Balance: ${currF(
          funds - noOfSharesToBuy * price.regularMarketPrice.raw * forex,
          'SGD'
        )}`}
      </div>
    </div>
  )
}

export default BuyModalContent

// ${console.log("sell", {
//   funds,
//   noOfSharesToBuy,
//   forex,
//   price: price.regularMarketPrice.raw,
//   OG: funds + noOfSharesToBuy * price.regularMarketPrice.raw * forex,
//   dtc: dollarsToCents(
//     funds + noOfSharesToBuy * price.regularMarketPrice.raw * forex
//   ),
//   currF: currF(
//     funds + noOfSharesToBuy * price.regularMarketPrice.raw * forex,
//     "SGD"
//   ),
// })}
