import React, { useState, useEffect, useContext } from "react";

import GC from "context";
import { api_addFunds } from "api/user";
import { DEPOSIT_FUNDS } from "actionTypes";

const NotificationPopups = ({ visibility, onClose, msgList, setMsgList }) => {
  const { dispatch } = useContext(GC);
  const [depositVal, setDepositVal] = useState("1.00");

  useEffect(() => {}, [visibility]);

  const onDepositValChange = (e) => {
    // val is a string
    const val = e.target.value;
    if (isNaN(val) || +val > 9999) {
      return;
    }
    const aftDecimal = val.split(".")[1];
    if (aftDecimal?.length > 2) {
      return;
    }
    setDepositVal(val);
  };

  const removeEnded = (listOfPopups) => {
    // once items in msgList expires, remove it
    // calculated by seeing if current time is past > initialised at time + duration to exists
    return listOfPopups.reduce((acc, msg) => {
      if (msg.iat + msg.expiresIn > Date.now()) {
        acc.push(msg);
      }
      return acc;
    }, []);
  };

  const depositFunds = async () => {
    try {
      dispatch({
        type: DEPOSIT_FUNDS,
        payload: await api_addFunds({ value: depositVal }),
      });

      console.log(msgList);
      setMsgList([
        // Review: Not ideal, only clears msgList if user deposits funds again.
        ...removeEnded(msgList),
        {
          type: "error",
          message: `$${depositVal} was deposited to your Account`,
          iat: Date.now(),
          expiresIn: 2000,
        },
      ]);
      onClose();
    } catch ({ message }) {
      console.log(msgList);
      setMsgList([
        ...removeEnded(msgList),
        { type: "error", message, iat: Date.now(), expiresIn: 2000 },
      ]);
    }
  };

  return visibility ? (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-4/5 sm:w-3/5 lg:w-2/5">
          {/*content*/}
          <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <div className="text-2xl font-semibold">Fund Your Account</div>
              <button
                className="ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onClose}
              >
                <span className="text-black block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    name="price"
                    value={depositVal}
                    onChange={onDepositValChange}
                    id="price"
                    className="focus:indigo-500 focus:border-indigo-500 block w-full pl-7 py-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="currency" className="sr-only">
                      Currency
                    </label>
                    {/* Review: For potential future use */}
                    {/* <select
                      id="currency"
                      name="currency"
                      className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                    >
                      <option>USD</option>
                      <option>CAD</option>
                      <option>EUR</option>
                    </select> */}
                  </div>
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="eDM bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={depositFunds}
              >
                Add{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(depositVal)}{" "}
                to your account
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  ) : (
    <></>
  );
};

export default NotificationPopups;
