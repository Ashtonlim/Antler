import React from "react";

const ModalContentAddFunds = ({ depositVal, setDepositVal }) => {
  // setNoOfSharesToBuy

  const onDepositValChange = (e) => {
    // val is a string
    const val = e.target.value;

    if (isNaN(val) || +val > 9999) return;
    if (val.split(".")[1]?.length > 2) return; // do not update if user tries to type past 2 d.p.

    setDepositVal(val);
  };

  return (
    <div className="relative p-6 flex-auto">
      {/* remove this div and should work? removed in Stock.js, Review: if any issues (di#01) */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 pl-3"
        >
          Price
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">SGD</span>
          </div>
          <input
            type="text"
            name="price"
            value={depositVal}
            onChange={onDepositValChange}
            id="price"
            className="focus:indigo-500 focus:border-indigo-500 block w-full pl-12 py-3 pr-12 sm:text-sm border-gray-300 rounded-md"
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
  );
};

export default ModalContentAddFunds;
