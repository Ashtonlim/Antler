import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import MainLayout from "components/layouts/MainLayout";
import NotificationPopups from "components/subComponents/NotificationPopups";
import Modal from "components/subComponents/Modal";

import GC from "context";
import { api_addFunds } from "api/user";
import { DEPOSIT_FUNDS } from "actionTypes";
import { expiresIn } from "consts";
import { currF } from "utils/format";

const Profile = () => {
  const { state, dispatch } = useContext(GC);
  const [visibility, setVisibility] = useState(false);
  const [depositVal, setDepositVal] = useState("1.00");
  const [msgList, setMsgList] = useState([]);

  useEffect(() => {
    document.title = `${state.userObj?.username?.toUpperCase()} Profile | Antler`;
  });

  const onDepositValChange = (e) => {
    // val is a string
    const val = e.target.value;
    if (isNaN(val) || +val > 9999) return;

    // do not update if user tries to type past 2 d.p.
    if (val.split(".")[1]?.length > 2) return;

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
    console.log({ depositVal });
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
          type: "success",
          message: `${currF(depositVal)} was deposited to your Account`,
          iat: Date.now(),
          expiresIn,
        },
      ]);
      // setVisibility(false);
    } catch ({ message }) {
      console.log(msgList);
      setMsgList([
        ...removeEnded(msgList),
        { type: "error", message, iat: Date.now(), expiresIn },
      ]);
    }
  };

  return (
    <MainLayout width="24">
      {msgList.length && (
        <div className="fixed z-10 flex flex-col items-start pt-4 mt-12">
          {msgList.map((msg) => (
            <NotificationPopups
              key={msg.iat}
              type={msg.type}
              message={msg.message}
              iat={msg.iat}
              expiresIn={msg.expiresIn}
            />
          ))}
        </div>
      )}
      {visibility && (
        <Modal
          title="Fund Your Account"
          visibility={visibility}
          onClose={() => setVisibility(false)}
          msgList={msgList}
          setMsgList={setMsgList}
          footerButtons={[
            <button
              key={1}
              className="eDM bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={depositFunds}
            >
              Add {currF(depositVal)} to your account
            </button>,
          ]}
        >
          <div className="relative p-6 flex-auto">
            {/* remove this div and should work? removed in Stock.js, Review: if any issues (di#01) */}
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
        </Modal>
      )}
      <div className="profile-page -mt-24">
        <section className="relative block" style={{ height: "500px" }}>
          <div
            className="eDM absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
        </section>
        <section className="relative py-16">
          <div className="container mx-auto px-4">
            <div className="augDM relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 lg:order-2 flex justify-center">
                    <img
                      alt="Profile"
                      src="https://dummyimage.com/150x150"
                      className="shadow-xl rounded-full h-auto border-none -mt-20"
                      style={{
                        width: "150px",
                        height: "150px",
                        maxWidth: "150px",
                      }}
                    />
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center text-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <button
                        className="eDM align-middle bg-blue-500 hover:bg-blue-600 uppercase text-white font-bold hover:shadow-md px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                        onClick={() => {
                          setVisibility(true);
                        }}
                        style={{ transition: "all .15s ease" }}
                      >
                        Add funds
                      </button>
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                          ${state.userObj.funds}
                        </span>
                        <span className="text-sm text-gray-500">Funds</span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                          22
                        </span>
                        <span className="text-sm text-gray-500">Friends</span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                          89
                        </span>
                        <span className="text-sm text-gray-500">Posts</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                    {state.userObj?.name?.toUpperCase()}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                    {state.userObj?.email}
                  </div>
                  <div className="mb-2 text-gray-700">
                    Phone Number: {state.userObj?.phone_num}
                  </div>
                  <div className="mb-2 text-gray-700">Lorum epsum</div>
                </div>
                <div className="mt-10 py-10 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <Link
                        className="eDM align-middle bg-blue-500 hover:bg-blue-600 uppercase text-white font-bold hover:shadow-md hover:text-white px-4 py-2 rounded outline-none focus:outline-none mb-1"
                        to="/logout"
                        style={{ transition: "all .15s ease" }}
                      >
                        Logout
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Profile;
