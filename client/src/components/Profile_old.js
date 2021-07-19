import React, { useContext, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Form, Modal, Input, Button } from "antd";

import MainLayout from "./layouts/MainLayout";
import GC from "context";

const AddFundsModal = ({
  isModalVisible,
  setIsModalVisible,
  onChange,
  num = 10,
}) => {
  console.log(num);
  const [deposit, setDeposit] = useState(22);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const triggerChange = (changedValue) => {
    onChange?.({
      deposit,
      ...changedValue,
    });
  };

  const onDepositChange = (e) => {
    const val = parseInt(e.target.value || "0", 10);

    if (Number.isNaN(val)) {
      console.log("not num");
      return;
    }

    triggerChange({ num: val });
  };

  const onFinish = (val) => {
    console.log("Success:", val);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const checkPrice = (_, value) => {
    console.log(value);
    if (value.number > 0) {
      return Promise.resolve();
    }

    return Promise.reject(new Error("Price must be greater than zero!"));
  };

  return (
    <Modal
      title="Fund your Account"
      width={600}
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <button
          key="cancel"
          className="eDM text-xs bg-blue-500 hover:bg-blue-600 uppercase text-white font-bold hover:shadow-md px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1"
          onClick={handleCancel}
          style={{ transition: "all .15s ease" }}
        >
          Cancel
        </button>,
      ]}
    >
      <Form
        name="basic"
        layout="inline"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="deposit"
          value={num}
          style={{ width: "65%" }}
          rules={[
            {
              validator: checkPrice,
            },
            {
              required: true,
              message: "Please input your deposit amount!",
            },
          ]}
        >
          <Input
            name="deposit"
            type="text"
            placeholder="Amount to add to account"
            onChange={onDepositChange}
            prefix="$"
            suffix="SGD"
          />
        </Form.Item>

        <Form.Item className="justify-end">
          <button
            className="eDM text-xs bg-blue-500 hover:bg-blue-600 uppercase text-white font-bold hover:shadow-md px-4 py-2 rounded outline-none focus:outline-none mb-1"
            type="submit"
          >
            Add Funds
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Profile = () => {
  const { state } = useContext(GC);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <MainLayout width="24">
      <AddFundsModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
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
                        onClick={showModal}
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
