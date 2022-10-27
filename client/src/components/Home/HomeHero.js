import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import AllTheData from 'media/AllTheData'
import { getCompanyInfo } from 'api/YF'
import { currF } from 'utils/format'

const { REACT_APP_NAME } = process.env

const HomeHero = () => {
  // hardcoded
  const companyLogoURL = [
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png',
    'https://logodownload.org/wp-content/uploads/2016/10/airbnb-logo-3-1.png',
  ]

  const [companyData, setCompanyData] = useState([])
  const [indexData, setIndexData] = useState([])

  useEffect(() => {
    const initData = async () => {
      try {
        setCompanyData(
          await Promise.all([
            getCompanyInfo('aapl'),
            getCompanyInfo('msft'),
            getCompanyInfo('abnb'),
          ])
        )
        setIndexData(
          await Promise.all([
            getCompanyInfo('%5EGSPC'),
            getCompanyInfo('%5EIXIC'),
            getCompanyInfo('%5EDJI'),
          ])
        )
      } catch (err) {
        console.log(err)
      }
    }
    initData()
  }, [])
  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-0 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            A Social Hub For Investing.
          </h1>
          <p className="mb-8 leading-relaxed">
            {REACT_APP_NAME} makes it easier than ever to track your
            investments. Follow other investors and find amazing research by
            other users and our own analysts.
          </p>
          <div className="flex w-full md:justify-start justify-center items-end">
            <div className="relative mr-4 md:w-full lg:w-full xl:w-1/2 w-2/4">
              <label
                htmlFor="hero-field"
                className="leading-7 text-sm text-gray-600"
              >
                Search a Stock
              </label>
              <input
                type="text"
                id="hero-field"
                name="hero-field"
                className="w-full bg-gray-100 rounded border bg-opacity-50 border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-transparent focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              Search
            </button>
          </div>
          <p className="text-sm mt-2 text-gray-500 mb-8 w-full">
            Try Microsoft or their ticker MSFT.
          </p>

          <p className="font-bold text-2xl mb-3 leading-relaxed">Indexes</p>
          <div className="mb-8 flex lg:flex-row md:flex-col">
            {indexData &&
              indexData.map((e, i) => (
                <Link
                  key={`${e.quoteSummary.result[0].price.symbol}`}
                  to={`/stock/${e.quoteSummary.result[0].price.symbol}`}
                  className="bg-gray-200 inline-flex py-3 px-5 rounded-lg items-center lg:mr-4 md:mr-0 mr-4 md:mt-4 mt-0 lg:mt-0 hover:bg-gray-300 focus:outline-none"
                >
                  <span className="flex items-start flex-col leading-none">
                    <span className="title-font font-medium mb-1">
                      {e.quoteSummary.result[0].price.shortName}
                    </span>
                    <span className="text-xs text-gray-600">
                      {currF(
                        e.quoteSummary.result[0].price.regularMarketPrice.raw,
                        e.quoteSummary.result[0].price.currency
                      )}{' '}
                      {e.quoteSummary.result[0].price.currency}
                    </span>
                  </span>
                </Link>
              ))}
          </div>

          <p className="font-bold text-2xl mb-3 leading-relaxed">Stocks</p>
          <div className="flex lg:flex-row md:flex-col">
            {companyData &&
              companyData.map((e, i) => (
                <Link
                  key={`${e.quoteSummary.result[0].price.symbol}`}
                  to={`/stock/${e.quoteSummary.result[0].price.symbol}`}
                  className="bg-gray-200 inline-flex py-3 px-5 rounded-lg items-center lg:mr-4 md:mr-0 mr-4 md:mt-4 mt-0 lg:mt-0 hover:bg-gray-300 focus:outline-none"
                >
                  <img
                    src={companyLogoURL[i]}
                    alt={`${e.quoteSummary.result[0].price.longName} logo`}
                    className="w-6"
                  />
                  <span className="ml-4 flex items-start flex-col leading-none">
                    <span className="title-font font-medium mb-1">
                      {e.quoteSummary.result[0].price.symbol}
                    </span>
                    <span className="text-xs text-gray-600">
                      {currF(
                        e.quoteSummary.result[0].price.regularMarketPrice.raw,
                        e.quoteSummary.result[0].price.currency
                      )}{' '}
                      {e.quoteSummary.result[0].price.currency}
                    </span>
                  </span>
                </Link>
              ))}
          </div>
        </div>

        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <AllTheData />
          {/* <img
              className="object-cover object-center rounded"
              alt="hero"
              src="https://i.imgur.com/nLqnuZS.jpeg"
            /> */}
        </div>
      </div>
    </section>
  )
}

export default HomeHero
