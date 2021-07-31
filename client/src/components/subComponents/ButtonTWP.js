import React from "react";

const ButtonTWP = ({ children, text, onClick, className, color = "blue" }) => {
  return (
    <button
      onClick={onClick}
      className={`eDM bg-${color}-500 hover:bg-${color}-600 uppercase text-white font-bold hover:shadow-md px-4 py-2 rounded outline-none focus:outline-none ${className}`}
    >
      {children ? children : text}
    </button>
  );
};

export default ButtonTWP;
