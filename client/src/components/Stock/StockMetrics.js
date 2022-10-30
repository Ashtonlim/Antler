import React from 'react'
import { Statistic, Row, Col, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const StockMetrics = ({ summaryDetail }) => {
  return (
    <section className="card my-5">
      <Row gutter={24}>
        <Col span={3}>
          <Statistic
            title={
              <Tooltip title="The average number of shares traded each day over the past 30 days">
                Volume <QuestionCircleOutlined />
              </Tooltip>
            }
            value={summaryDetail.volume.fmt}
          />
        </Col>

        <Col span={3}>
          <Statistic
            title={
              <Tooltip title="The ratio of annual dividend to current share price that estimates the dividend return of a stock">
                Dividend <QuestionCircleOutlined />
              </Tooltip>
            }
            value={summaryDetail.dividendYield.fmt || '-'}
          />
        </Col>

        <Col span={4}>
          <Statistic
            title={
              <Tooltip title="The ratio of current share price to trailing 12-month EPS that signals if the price is high or low compared to other stocks">
                Price/Earnings Ratio <QuestionCircleOutlined />
              </Tooltip>
            }
            value={
              summaryDetail.trailingPE ? summaryDetail.trailingPE.fmt : '-'
            }
          />
        </Col>

        <Col span={4}>
          <Statistic
            title={
              <Tooltip title="A valuation method that multiplies the price of a company's shares by the total number of outstanding shares.">
                Market Capitalisation <QuestionCircleOutlined />
              </Tooltip>
            }
            value={
              summaryDetail.marketCap.fmt
                ? `${summaryDetail.marketCap.fmt} ${summaryDetail.currency}`
                : '-'
            }
          />
        </Col>

        <Col span={5}>
          <Statistic
            title={
              <Tooltip title="The difference between the high and low prices over the past 52 weeks">
                <span>
                  52 Week Range <QuestionCircleOutlined />
                </span>
              </Tooltip>
            }
            value={`$${summaryDetail.fiftyTwoWeekLow.fmt} - $${summaryDetail.fiftyTwoWeekHigh.fmt}`}
          />
        </Col>
        {/* <Col span={12}>
          <Statistic title="Active Users" value={112894} loading />
        </Col> */}
      </Row>
    </section>
  )
}

export default StockMetrics
