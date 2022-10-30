/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { Table, Statistic, Row, Col, Tooltip } from 'antd'

import useYfws from 'components/hooks/useYfws'
import { currF, round } from 'utils/format'
import { QuestionCircleOutlined } from '@ant-design/icons'

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
      {
        title: 'Price brought at',
        dataIndex: 'order_price',
        key: 'order_price',
      },
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
      title: () => (
        <Tooltip title="The weightage is calculated by taking the value of ">
          Avg price{' '}
          <QuestionCircleOutlined style={{ fontSize: '11px', color: '#aaa' }} />
        </Tooltip>
      ),
      dataIndex: 'avgVal',
      key: 'avgVal',
      render: (t) => currF(t),
    },
    {
      title: () => (
        <Tooltip title="The weightage is calculated by taking the value of ">
          Total value{' '}
          <QuestionCircleOutlined style={{ fontSize: '11px', color: '#aaa' }} />
        </Tooltip>
      ),
      dataIndex: 'totalVal',
      key: 'totalVal',
      render: (t) => currF(t),
    },
    { title: 'Total shares', dataIndex: 'totalQty', key: 'totalQty' },
    {
      title: () => (
        <Tooltip title="The weightage is calculated by taking the value of ">
          Market price{' '}
          <QuestionCircleOutlined style={{ fontSize: '11px', color: '#aaa' }} />
        </Tooltip>
      ),
      dataIndex: 'mktPrice',
      key: 'mktPrice',
      render: (t) =>
        !t && !Array.isArray(t) && isNaN(t[0]) ? '-' : `${currF(t[0], t[1])}`,
    },
    {
      title: () => (
        <Tooltip title="The weightage is calculated by taking the value of ">
          Profit/Loss in %{' '}
          <QuestionCircleOutlined style={{ fontSize: '11px', color: '#aaa' }} />
        </Tooltip>
      ),
      dataIndex: 'pnl',
      key: 'pnl',
      render: (t) => (isNaN(t) ? '-' : <UpDown val={round(t, 2)} />), // incase YF provides invalid type?
    },
    {
      title: () => (
        <Tooltip title="The weightage is calculated by taking the Total value of the stock you own over the sum of the total value of assets owned ">
          Weightage in %{' '}
          <QuestionCircleOutlined style={{ fontSize: '11px', color: '#aaa' }} />
        </Tooltip>
      ),
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
