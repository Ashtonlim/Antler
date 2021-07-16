import React, { useContext, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Modal, Input } from "antd";

import MainLayout from "./layouts/MainLayout";
import GC from "context";

const Profile = () => {
  const { state } = useContext(GC);
  const { pathname } = useLocation();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (value) => {
    console.log(value);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <MainLayout width="24">
      <Modal
        title="Fund your account"
        className="augDM"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input placeholder="Basic usage" onPressEnter={handleOk} />
      </Modal>
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
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      <img
                        alt="Profile"
                        src="https://dummyimage.com/150x150"
                        className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                        style={{ width: "150px", maxWidth: "150px" }}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center text-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <Link
                        className="eDM align-middle bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                        to="/logout"
                        style={{ transition: "all .15s ease" }}
                      >
                        Add funds
                      </Link>
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
                  <div className="mb-2 text-gray-700">
                    {state.userObj.phone_num}
                  </div>
                </div>
                <div className="mt-10 py-10 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <Link
                        className="eDM align-middle bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md px-4 py-2 rounded outline-none focus:outline-none mb-1"
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
