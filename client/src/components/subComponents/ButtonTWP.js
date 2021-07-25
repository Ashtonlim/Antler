import React from "react";

const ButtonTWP = ({ children, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="eDM bg-blue-500 hover:bg-blue-600 uppercase text-white font-bold hover:shadow-md px-4 py-2 rounded outline-none focus:outline-none"
    >
      {children ? children : text}
    </button>
  );
};

export default ButtonTWP;
