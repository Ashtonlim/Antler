import React, { useState, useEffect } from "react";
import { saveState } from "localStorage";
import { BuyStock, SellStock, PortItemStock } from "api/stock.js";
import { getUsers } from "api/user.js";
import {
  Form,
  Button,
  InputNumber,
  Slider,
  Select,
  Modal,
  Row,
  Radio,
} from "antd";

const BuySellModal = ({ state, coyInfo, symbol }) => {
  const { Option } = Select;
  const [form] = Form.useForm();

  const [vals, setVals] = useState({
    shares: 0,
    BuySell: "",
    BuySelltext: "Place Order",
    portItem: [],
    commcost: 0,
    normval: 0,
    cashava: state.userObj.funds,
    sellport: true,
    visible: false,
    confirmLoading: false,
  });

  useEffect(() => {
    // const getInfo = async () => {
    //   try {
    //     const { purchased_prices } = await PortItemStock(
    //       state.userObj.portfolio
    //     );
    //     setVals({
    //       ...vals,
    //       portItem: purchased_prices.filter(
    //         (item) =>
    //           item.portfolio_item.stock.symbol === symbol &&
    //           !item.portfolio_item.sold
    //       ),
    //       cashava: state.userObj.funds,
    //     });
    //   } catch (err) {
    //     alert(err);
    //   }
    // };
    // getInfo();
  }, [state, coyInfo, symbol]);

  const showModal = async (e) => {
    if (e.type === "click") {
      setVals({
        ...vals,
        visible: true,
      });
    }
  };

  if (localStorage.getItem(["arr" + "+" + state.userObj.username]) === null) {
    var arr = [];
    localStorage["arr" + "+" + state.userObj.username] = JSON.stringify(arr);
    console.log(
      "arr established: " + localStorage["arr" + "+" + state.userObj.username]
    );
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values) => {
    //POST trade
    //API CALL
    const { BuySell } = values;
    console.log("start", values);
    if (BuySell === "Buy" && vals.normval) {
      if (vals.cashava < vals.normval + vals.commcost) {
        alert("Insufficent fund, add more fund.");
      }
      try {
        const res = await BuyStock({
          user_id: state.userObj._id,
          symbol,
          quantity: vals.shares,
          purchased_price: coyInfo.price.regularMarketPrice.fmt,
        });

        // console.log('buy response here')
        // console.log(res)
        saveState({
          ...state,
          funds: (await getUsers(state.userObj._id)).funds,
        });
        window.location.reload();
      } catch (err) {
        alert(err);
      }
    } else {
      if (!values.portitem_id) {
        alert("Select a portfolio item to sell");
      }
      //sell
      console.log(JSON.stringify(values));
      try {
        const res = await SellStock({
          ...values,
          user_id: state.userObj._id,
          sell_price: coyInfo.price.regularMarketPrice.fmt,
        });
        console.log("sell response here");
        console.log(res);
        saveState({
          ...state,
          funds: (await getUsers(state.userObj._id)).funds,
        });
        window.location.reload();
      } catch (err) {
        alert(err);
      }
    }

    setVals({
      ...vals,
      visible: false,
    });
  };
  const validateMessages = {
    types: {
      Price: "${label} is less than bid.",
    },
  };
  const onChangeshare = (value) => {
    setVals({
      ...vals,
      shares: value,
      visible: true,
      normval: coyInfo.price.regularMarketPrice.fmt * vals.shares,
      commcost: vals.normval / 10000,
    });
  };
  const onChangebs = (value) => {
    if (value.target.value === "Buy") {
      setVals({
        ...vals,
        BuySell: value,
        visible: true,
        sellport: true,
        BuySelltext: "Place Order",
      });
    } else if (value.target.value === "Sell") {
      setVals({ ...vals, sellport: false, BuySelltext: "Sell Order" });
    }
  };
  const onCancel = () => {
    setVals({ ...vals, visible: false });
  };

  return (
    <>
      <Button className="mr-2" type="primary" size="large" onClick={showModal}>
        Trade
      </Button>
      <Modal
        className="buymodal"
        title={symbol}
        visible={vals.visible}
        footer={null}
        confirmLoading={vals.confirmLoading}
        onCancel={onCancel}
      >
        <Form
          layout="horizontal"
          form={form}
          requiredMark={false}
          validateMessages={validateMessages}
          initialValues={{ symbol }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          colon={false}
        >
          <div className="alignleft">
            <Form.Item
              className="modalitem"
              label="Buy/Sell"
              name="BuySell"
              rules={[
                {
                  required: true,
                  message: "Please select buy or sell.",
                },
              ]}
            >
              <Radio.Group onChange={onChangebs}>
                <Radio value="Buy">Buy</Radio>
                <Radio value="Sell">Sell</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <div className="alignleft">
            <Form.Item
              className="modalitem"
              label="PortfolioItem"
              name="portitem_id"
            >
              <Select disabled={vals.sellport}>
                {vals.portItem &&
                  vals.portItem.map((item, key) => (
                    <Option key={key} value={item.portfolio_item.id}>
                      {item.portfolio_item.id}
                      {": "}
                      {item.portfolio_item.stock.company_name}
                      {" ("}
                      {item.portfolio_item.stock.symbol}
                      {" x"}
                      {item.quantity}
                      {")"}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
          <div className="alignleft">
            {coyInfo && (
              <Form.Item className="modalitem" label="Shares" name="quantity">
                <Slider
                  min={0}
                  max={vals.cashava / coyInfo.price.regularMarketPrice.fmt}
                  onChange={onChangeshare}
                  disabled={!vals.sellport}
                  value={typeof vals.shares === "number" ? vals.shares : 0}
                />
                <InputNumber
                  min={0}
                  max={vals.cashava / coyInfo.price.regularMarketPrice.fmt}
                  onChange={onChangeshare}
                  value={vals.shares}
                  disabled={!vals.sellport}
                ></InputNumber>
              </Form.Item>
            )}
          </div>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              className="orderbtn"
              htmlType="submit"
            >
              {vals.BuySelltext}
            </Button>
          </Form.Item>
          <Row>
            <div className="rowhalf">
              {coyInfo && (
                <Form.Item className="modalitem" label="Commission Cost">
                  <div className="alignleft">
                    {(
                      (coyInfo.price.regularMarketPrice.fmt * vals.shares) /
                      10000
                    ).toFixed(2)}
                  </div>
                </Form.Item>
              )}
            </div>
            <div className="rowhalf">
              {coyInfo && (
                <Form.Item className="modalitem" label="Norminal Value">
                  <div className="alignleft">
                    {(
                      coyInfo.price.regularMarketPrice.fmt * vals.shares
                    ).toFixed(2)}
                  </div>
                </Form.Item>
              )}
            </div>
          </Row>
          <Form.Item className="modalitem" label="Cash Available">
            <div className="alignleft">{vals.cashava.toFixed(2)}</div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BuySellModal;
