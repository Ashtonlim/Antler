import React from "react";

// reqPF (require pass fail messages/hints)
// validity (is the input valid or invalid)
export default (props) => {
  return (
    <div>
      <input className="inp-cbx" id="noon" type="checkbox" />
      <label className="cbx" htmlFor="noon">
        <span>
          <svg width="12px" height="10px">
            <use xlinkHref="#check"></use>
          </svg>
        </span>
        <span>{props.text}</span>
      </label>
      <svg className="inline-svg">
        <symbol id="check" viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  );
};
