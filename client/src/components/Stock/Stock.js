import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

import MainLayout from 'components/layouts/MainLayout'
import TinyStockChart from 'components/common/TinyStockChart'
import ButtonTWP from 'components/common/ButtonTWP'

import GC from 'context'
import { EDIT_TO_WATCHLIST, BUY_STOCK, SELL_STOCK } from 'actionTypes'
import { getCompanyInfo } from 'api/YF'
import { currConv } from 'api/apiUtils'

import { api_editWatchlist, api_buyStock, api_sellStock } from 'api/user'
import { currF } from 'utils/format'

import Graph from './Graph'
import ModalContentSell from './ModalContentSell'
import ModalContentBuy from './ModalContentBuy'
import StockCalendarDates from './StockCalendarDates'
import StockMetrics from './StockMetrics'
// import StockOfficers from "./StockOfficers";
import Modal from 'components/common/Modal'
import CommentSection from './CommentSection'

const { REACT_APP_NAME } = process.env

const x = [
  'GOOG',
  'MSFT',
  'NFLX',
  'AMD',
  'ABNB',
  'INTC',
  'KO',
  // '%5EGSPC',
  // '%5EIXIC',
  'AMZN',
  'MC.PA',
  'NKE',
]
const ra = (arr) => arr.splice(Math.random() * arr.length, 1)
const rTickers = [ra(x), ra(x), ra(x), ra(x)]

const Stock = (props) => {
  const { state, dispatch } = useContext(GC)
  const symbol = useLocation().pathname.split('/').pop()
  const range = ['1D', '5D', '3MO', '6MO', '1Y', '5Y', 'MAX']

  const [onFocus, setOnFocus] = useState(1)
  const [randomTickers] = useState(rTickers)

  const [coyInfo, setCoyInfo] = useState('')
  const [ticker, setTicker] = useState(symbol.toUpperCase())
  const [forex, setForex] = useState(0)
  const [buyModalVisible, setBuyModalVisible] = useState(false)
  const [sellModalVisible, setSellModalVisible] = useState(false)
  const [noOfSharesToBuy, setNoOfSharesToBuy] = useState(1)
  const [noOfSharesToSell, setNoOfSharesToSell] = useState(1)

  useEffect(() => {
    setTicker(symbol.toUpperCase())
    const getInfo = async () => {
      try {
        const { quoteSummary } = await getCompanyInfo(symbol, [
          'assetProfile',
          'summaryDetail',
          'price',
        ])
        const apiData = quoteSummary?.result[0]

        // use api results directly, probably easier/fewer issues
        document.title =
          apiData.price?.shortName && symbol
            ? `${
                apiData.price?.shortName
              } ${symbol.toUpperCase()} Stock Price | ${REACT_APP_NAME}`
            : `Company Stock Price | ${REACT_APP_NAME}`

        setCoyInfo(apiData)
        setForex(
          (
            await currConv({
              from: apiData.price?.currency,
              to: 'SGD',
            })
          )[`${apiData.price?.currency?.toUpperCase()}_SGD`]
        )
      } catch (err) {
        console.log(err)
      }
    }
    getInfo()
  }, [props, onFocus, symbol])

  const handleClick = (e) => {
    console.log('change date', range[onFocus])
    setOnFocus(Array.from(e.currentTarget.children).indexOf(e.target))
  }

  const addToWatchlist = async () => {
    try {
      dispatch({
        type: EDIT_TO_WATCHLIST,
        payload: await api_editWatchlist({ val: { action: 'add', ticker } }),
      })
    } catch ({ message }) {
      console.log(message)
    }
  }

  const rmFromWatchlist = async () => {
    try {
      dispatch({
        type: EDIT_TO_WATCHLIST,
        payload: await api_editWatchlist({ val: { action: 'del', ticker } }),
      })
    } catch ({ message }) {
      console.log(message)
    }
  }

  const buyShares = async () => {
    try {
      dispatch({
        type: BUY_STOCK,
        payload: await api_buyStock({
          ticker,
          quantity: noOfSharesToBuy,
          unitCost: coyInfo.price.regularMarketPrice.raw,
          totalCost: noOfSharesToBuy * coyInfo.price.regularMarketPrice.raw,
          forex,
        }),
      })
    } catch ({ message }) {
      console.log(message)
    }
  }

  const sellShares = async () => {
    try {
      dispatch({
        type: SELL_STOCK,
        payload: await api_sellStock({
          ticker,
          quantity: noOfSharesToSell,
          unitCost: coyInfo.price.regularMarketPrice.raw,
          totalCost: noOfSharesToSell * coyInfo.price.regularMarketPrice.raw,
          forex,
        }),
      })
      // setNoOfSharesToSell(0);
      // setSellModalVisible(false);
    } catch ({ message }) {
      console.log({ action: 'sell stock', message })
    }
  }

  return (
    <MainLayout>
      {coyInfo.price ? (
        <>
          <Modal
            title={`Buy ${coyInfo.price?.shortName} Shares`}
            visible={buyModalVisible}
            setVisible={setBuyModalVisible}
            footerButtons={[
              <ButtonTWP
                key={1}
                text={`Buy ${noOfSharesToBuy} shares for ${currF(
                  noOfSharesToBuy *
                    coyInfo.price.regularMarketPrice.raw *
                    forex,
                  'SGD'
                )}`}
                onClick={buyShares}
                disabled={noOfSharesToBuy === 0}
              />,
            ]}
          >
            <ModalContentBuy
              price={coyInfo.price}
              forex={forex}
              ticker={ticker}
              noOfSharesToBuy={noOfSharesToBuy}
              setNoOfSharesToBuy={setNoOfSharesToBuy}
              funds={state.userObj.funds}
            />
          </Modal>
          <Modal
            title={`Sell ${coyInfo.price?.shortName} Shares`}
            visible={sellModalVisible}
            setVisible={setSellModalVisible}
            footerButtons={[
              <ButtonTWP
                key={1}
                text={`Sell ${noOfSharesToSell} shares for ${currF(
                  noOfSharesToSell *
                    coyInfo.price.regularMarketPrice.raw *
                    forex,
                  'SGD'
                )}`}
                onClick={sellShares}
                disabled={noOfSharesToSell === 0}
              />,
            ]}
          >
            <ModalContentSell
              ticker={ticker}
              price={coyInfo.price}
              forex={forex}
              noOfSharesToSell={noOfSharesToSell}
              setNoOfSharesToSell={setNoOfSharesToSell}
              funds={state.userObj.funds}
              stock_portfolio={state.userObj.stock_portfolio}
            />
          </Modal>
        </>
      ) : (
        <div></div>
      )}
      <div className="flex justify-between">
        <section className="card mb-3" style={{ width: '65%' }}>
          {coyInfo && ticker && (
            <div>
              <div style={{ float: 'right' }}>
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
                {currF(
                  coyInfo.price.regularMarketPrice.raw,
                  coyInfo.price.currency
                )}{' '}
                {coyInfo.price.currency}
                <span
                  className={`ml-2 p-1 px-3 ${
                    coyInfo.price.regularMarketChangePercent?.raw >= 0
                      ? 'text-green-700 bg-green-100'
                      : 'text-red-700 bg-red-100'
                  } rounded`}
                >
                  Today{' '}
                  {coyInfo.price.regularMarketChange?.raw > 0 ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}{' '}
                  {coyInfo.price.regularMarketChange.fmt}{' '}
                  {coyInfo.price.currency} (
                  {coyInfo.price.regularMarketChangePercent.fmt})
                </span>
              </h1>
              <p className="mtb-0 m-0">
                <span className="font-medium ">
                  {ticker}: {coyInfo.price.shortName}
                </span>{' '}
                - Listed on {coyInfo.price.exchangeName}
              </p>

              <div className="m-0"></div>
              <div>
                You own{' '}
                {state.userObj?.stock_portfolio
                  ?.filter((item) => item.ticker === ticker)[0]
                  ?.stock_orders?.reduce(
                    (agg, item) => agg + item.quantity,
                    0
                  ) || 'no'}{' '}
                shares of {coyInfo.price.shortName}
              </div>
            </div>
          )}
          <div onClick={handleClick} className="dateRangeBtns my-2">
            {range.map((r, key) => (
              <div
                key={key}
                className={`cbx dateRangeBtn ${key === onFocus ? 'focus' : ''}`}
              >
                {r}
              </div>
            ))}
          </div>

          <div style={{ height: '300px' }} id="g">
            {ticker && <Graph ticker={symbol} range={range[onFocus]} />}
          </div>
        </section>
        <CommentSection
          ticker={symbol}
          loggedIn={state.loggedIn}
          userObj={state.userObj}
        />
      </div>

      <h3 className="text-xl mt-8">Discover More</h3>
      <div className="mb-5">
        {randomTickers.map((ticker) => (
          <TinyStockChart ticker={ticker} />
        ))}
      </div>

      {coyInfo.summaryDetail && (
        <StockMetrics summaryDetail={coyInfo.summaryDetail} />
      )}

      <StockCalendarDates />

      {/* {coyInfo.assetProfile && (
        <StockOfficers companyOfficers={coyInfo.assetProfile.companyOfficers} />
      )} */}
    </MainLayout>
  )
}

export default Stock
