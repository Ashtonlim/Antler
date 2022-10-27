/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { Table } from 'antd'

import { currF, round } from 'utils/format'
import useYfws from 'components/hooks/useYfws'

const UpDown = ({ val }) => {
  const c = val >= 0 ? 'green' : 'red'
  return (
    <span className={`p-1 px-3 rounded text-${c}-700 bg-${c}-100 font-bold`}>
      {val}%
    </span>
  )
}

const PortfolioTable = ({ innerTableData, outerTableData }) => {
  const [OTB, setOTB] = useState(outerTableData)
  const { next } = useYfws(outerTableData.map((e) => e.key.toUpperCase()))
  // console.log({ s: next })
  useEffect(() => {
    if (OTB.length) {
      // do open here, prevent running it twice????
      let i = OTB.findIndex((e) => e.key === next.id)
      OTB[i]['mktPrice'] = [next.price, next.currency]
      OTB[i]['pnl'] = ((next.price - OTB[i].avgVal) / OTB[i].avgVal) * 100
      // console.log({ next, OTB });

      setOTB([...OTB])
    }
  }, [outerTableData])

  const expandedRowRender = (e) => {
    const columns = [
      { title: 'Price', dataIndex: 'order_price', key: 'order_price' },
      { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
      { title: 'Order date', dataIndex: 'createdAt', key: 'createdAt' },
    ]

    return (
      <Table
        columns={columns}
        dataSource={innerTableData[e.ticker.props.children]['stock_orders']}
        pagination={false}
      />
    )
  }

  const columns = [
    { title: 'Ticker', dataIndex: 'ticker', key: 'ticker' },
    {
      title: 'Avg price',
      dataIndex: 'avgVal',
      key: 'avgVal',
      render: (t) => currF(t),
    },
    {
      title: 'Total value',
      dataIndex: 'totalVal',
      key: 'totalVal',
      render: (t) => currF(t),
    },
    { title: 'Total shares', dataIndex: 'totalQty', key: 'totalQty' },
    {
      title: 'Market price',
      dataIndex: 'mktPrice',
      key: 'mktPrice',
      render: (t) =>
        !t && !Array.isArray(t) && isNaN(t[0]) ? '-' : `${currF(t[0], t[1])}`,
    },
    {
      title: 'Profit/Loss %',
      dataIndex: 'pnl',
      key: 'pnl',
      render: (t) => (isNaN(t) ? '-' : <UpDown val={round(t, 2)} />), // incase YF provides invalid type?
    },
    {
      title: 'Weightage in %',
      dataIndex: 'weightage',
      key: 'weightage',
      render: (t) => `${round(t, 3)}%`,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ]

  return (
    <>
      <Table
        className="components-table-demo-nested"
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={outerTableData}
      />
    </>
  )
}

export default PortfolioTable
