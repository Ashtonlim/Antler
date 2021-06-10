import React from "react";
export default (props) => (
  <div class="material-textfield">
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
