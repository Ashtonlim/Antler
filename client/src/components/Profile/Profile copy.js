import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import GC from "context";
import { api_addFunds } from "api/user";
import { DEPOSIT_FUNDS } from "actionTypes";

const errMsgs = [
  {
    type: "error",
    message: "Error at server",
  },
];

const Profile = () => {
  const { state, dispatch } = useContext(GC);

  const [depositVal, setDepositVal] = useState("100.00");
  const [depositFundsErr, setDepositFundsErr] = useState(errMsgs);

  const [visibility, setVisibility] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = `${state.userObj.username} Profile | Antler`;
  });

  const onDepositValChange = (e) => {
    // val = string
    const val = e.target.value;
    if (isNaN(val) || +val > 9999) {
      return;
    }
    const aftDecimal = val.split(".")[1];
    if (aftDecimal?.length > 2) {
      return;
    }
    console.log(val);
    setDepositVal(val);
  };

  const depositFunds = async () => {
    console.log(depositVal);
    // console.log(await api_addFunds({ value depositVal }));
    try {
      dispatch({
        type: DEPOSIT_FUNDS,
        payload: await api_addFunds({ value: depositVal }),
      });
    } catch (err) {
      setDepositFundsErr({
        ...depositFundsErr,
        show: true,
        message: err.message,
      });
      setTimeout(() => {
        setDepositFundsErr({ ...depositFundsErr, show: false, message: "" });
      }, 4000);
    }
  };

  return (
    <MainLayout width="24">
      {depositFundsErr.show && (
        <div className="absolute z-10 text-center py-4 lg:px-4">
          <div
            className="p-2 bg-red-800 items-center text-red-100 leading-none lg:rounded-full flex lg:inline-flex"
            role="alert"
          >
            <span className="flex rounded-full bg-red-500 uppercase px-2 py-1 font-bold mr-3">
              {depositFundsErr.type}
            </span>
            <span className="font-semibold mr-2 text-left flex-auto ">
              {depositFundsErr.message}
            </span>
            <button
              onClick={() => {
                setDepositFundsErr({
                  ...depositFundsErr,
                  show: false,
                  message: "",
                });
              }}
              className="block outline-none focus:outline-none"
            >
              <span className="text-lg">×</span>
            </button>
          </div>
        </div>
      )}
      {visibility && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-4/5 sm:w-3/5 lg:w-2/5">
              {/*content*/}
              <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <div className="text-2xl font-semibold">
                    Fund Your Account
                  </div>
                  <button
                    className="ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setVisibility(false)}
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
                    onClick={() => setVisibility(false)}
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
      )}
      <div className="profile-page -mt-10">
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
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
            style={{ height: "70px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-gray-300 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
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
                    {state.userObj.name.toUpperCase()}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                    {state.userObj.email}
                  </div>
                  <div className="mb-2 text-gray-700">
                    Phone Number: {state.userObj.phone_num}
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
