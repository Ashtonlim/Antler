import React, { useState, useEffect } from "react";

const NotificationPopups = ({
  expiresIn = 4000,
  count = 0,
  type = "success",
  message = "Include Success Message",
  iat,
}) => {
  const [visible, setVisible] = useState(true);

  // console.log("NotificationPopups: ", message, visible);

  useEffect(() => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, expiresIn);
  }, [expiresIn, iat]);

  return visible ? (
    <div key={iat} className="text-center py-2 lg:px-4">
      <div
        className={`p-2 ${
          type === "success" ? "bg-green-700" : "bg-red-800"
        } items-center text-red-100 leading-none lg:rounded-full flex lg:inline-flex`}
        role="alert"
      >
        <span
          className={`flex rounded-full ${
            type === "success" ? "bg-green-500" : "bg-red-500"
          } uppercase px-2 py-1 font-bold mr-3`}
        >
          {type}
        </span>
        <span className="font-semibold mr-2 text-left flex-auto ">
          {message}
        </span>
        <button
          onClick={() => {
            setVisible(false);
          }}
          className="block outline-none focus:outline-none"
        >
          <span className="text-lg">×</span>
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default NotificationPopups;
