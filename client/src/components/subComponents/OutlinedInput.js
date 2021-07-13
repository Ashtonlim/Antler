import React from "react";

const OutlinedInput = (props) => (
  <div className="material-textfield">
    <input
      className={props.classes}
      type={props.type}
      placeholder={props.placeholder}
      onChange={props.onChange}
      value={props.value}
    />
    <label>{props.label || "Label"}</label>
  </div>
);

export default OutlinedInput;
