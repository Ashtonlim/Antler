import React, { useEffect, useState } from 'react'

import { Table } from 'antd'

import { getCompanyInfo } from 'api/YF.js'
import { processData } from 'utils/dataHandling'

const StocksTable = ({ symbols }) => {
  const [data, setData] = useState([])
  console.log(`inside table ${symbols}`)

  useEffect(() => {
    const apiFill = async () => {
      if (Array.isArray(symbols) && symbols.length) {
        setData(
          await Promise.all(
            await symbols.map(async (ticker, key) =>
              processData(
                (
                  await getCompanyInfo(ticker)
                ).quoteSummary.result[0].price,
                key
              )
            )
          )
        )
      }
    }
    apiFill()
  }, [symbols])

  const locale = {
    emptyText: '-',
  }

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra)
  }

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'Symbol',
      render: (text) => <a href={'stock/' + [text]}>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'Name',
    },
    {
      title: 'Last Price (USD)',
      dataIndex: 'LastPrice',
    },
    {
      title: 'Market Time',
      dataIndex: 'MarketTime',
    },
    {
      title: 'Change',
      dataIndex: 'Change',
    },
    {
      title: 'Change (%)',
      dataIndex: 'perChange',
    },
    {
      title: 'Volume',
      dataIndex: 'Volume',
    },
    {
      title: 'Average Volume',
      dataIndex: 'AvgVol',
    },
    {
      title: 'Market Cap',
      dataIndex: 'MarketCap',
    },
  ]

  return (
    <>
      {data && (
        <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          locale={locale}
        />
      )}
    </>
  )
}

export default StocksTable
