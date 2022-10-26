import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

import useResetState from 'components/hooks/useResetState'
import MainLayout from 'components/layouts/MainLayout'
import ButtonTWP from 'components/common/ButtonTWP'
import { getCompanyInfo } from 'api/YF'
import { currF } from 'utils/format'

import PortfolioTable from './PortfolioTable'

const Portfolio = () => {
  const [inOut, setInOut] = useState([[], []])
  const { state } = useResetState()

  useEffect(() => {
    const data = state.userObj?.stock_portfolio
    if (typeof data === 'undefined' || !Array.isArray(data)) return

    let investedInX = 0

    const innie = data.reduce((acc, { ticker, stock_orders }) => {
      acc[ticker] = {
        // need to add key, quite unnecessary computational cost
        stock_orders: stock_orders.map(
          ({ order_price, quantity, createdAt }, key) => ({
            key,
            quantity,
            order_price: currF(order_price),
            createdAt: dayjs(createdAt)
              .tz('Asia/Singapore')
              .format('DD MMM YY hh:mma'),
          })
        ),
        ...stock_orders.reduce(
          (totalAcc, { quantity, order_price }) => ({
            totalQty: totalAcc.totalQty + quantity,
            // review: totalVal is rounded later but will it ever accumalate to a rounding error if enough rows of trades?
            totalVal: totalAcc.totalVal + order_price * quantity,
          }),
          { totalQty: 0, totalVal: 0 }
        ),
      }

      return acc
    }, {})

    const initData = async () => {
      try {
        // Object.entries({key1: val1, key2, val2}) -> [[key1, val1], [key2, val2]]
        let outie = await Promise.all(
          Object.entries(innie).map(
            async ([ticker, { totalQty, totalVal }]) => {
              investedInX += totalVal

              const {
                quoteSummary: {
                  result: [{ price }],
                },
              } = await getCompanyInfo(ticker)

              return {
                key: ticker,
                ticker: <Link to={`/stock/${ticker}`}>{ticker}</Link>,
                avgVal: totalVal / totalQty,
                totalVal: totalVal,
                totalQty,
                mktPrice: [price?.regularMarketPrice?.raw, price?.currency],
                info: price,
                action: (
                  <span>
                    <ButtonTWP
                      text="buy"
                      color="green"
                      className="mr-3 text-xs"
                    />
                    <ButtonTWP
                      text="sell"
                      color="red"
                      className="mr-3 text-xs"
                    />
                  </span>
                ),
              }
            }
          )
        )

        outie = outie.map((e) => {
          return {
            ...e,
            weightage: (e.totalVal / investedInX) * 100,
            pnl: ((e.mktPrice[0] - e.avgVal) / e.avgVal) * 100,
          }
        })

        // console.log("params", { inner, outer, innie, outie });
        setInOut([innie, outie])
        // setInner(innie);
        // setOuter(outie);
      } catch (err) {
        alert(err)
      }
    }

    initData()
  }, [state])

  return (
    <MainLayout>
      {state?.userObj?.stock_portfolio ? (
        <PortfolioTable innerTableData={inOut[0]} outerTableData={inOut[1]} />
      ) : (
        ''
      )}
    </MainLayout>
  )
}

export default Portfolio
