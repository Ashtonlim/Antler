import React from "react";
import { Statistic, Row, Col, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const StockMetrics = ({ coyInfo }) => {
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
            value={coyInfo.summaryDetail.volume.fmt}
          />
        </Col>

        <Col span={3}>
          <Statistic
            title={
              <Tooltip title="The ratio of annual dividend to current share price that estimates the dividend return of a stock">
                Dividend <QuestionCircleOutlined />
              </Tooltip>
            }
            value={coyInfo.summaryDetail.dividendYield.fmt || "-"}
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
              coyInfo.summaryDetail.trailingPE
                ? coyInfo.summaryDetail.trailingPE.fmt
                : "-"
            }
          />
        </Col>

        <Col span={4}>
          <Statistic
            title={
              <Tooltip title="A valuation method that multiplies the price of a company's shares by the total number of outstanding shares.">
                Market Cap <QuestionCircleOutlined />
              </Tooltip>
            }
            value={
              coyInfo.summaryDetail.marketCap.fmt
                ? `${coyInfo.summaryDetail.marketCap.fmt} ${coyInfo.summaryDetail.currency}`
                : "-"
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
            value={`$${coyInfo.summaryDetail.fiftyTwoWeekLow.fmt} - $${coyInfo.summaryDetail.fiftyTwoWeekHigh.fmt}`}
          />
        </Col>
        {/* <Col span={12}>
          <Statistic title="Active Users" value={112894} loading />
        </Col> */}
      </Row>
    </section>
  );
};

export default StockMetrics;
