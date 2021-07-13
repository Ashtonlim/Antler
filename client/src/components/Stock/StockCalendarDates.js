import React from "react";

const ImportantDatesForStocks = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="card mx-auto">
        <div className="flex flex-wrap -mx-4 -my-8">
          <div className="py-8 px-4 lg:w-1/3">
            <div className="h-full flex items-start">
              <div className="w-12 flex-shrink-0 flex flex-col text-center leading-none">
                <span className="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">
                  Jul
                </span>
                <span className="font-medium text-lg text-gray-800 title-font leading-none">
                  18
                </span>
              </div>
              <div className="flex-grow pl-6">
                <h2 className="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">
                  EARNINGS
                </h2>
                <h1 className="title-font text-xl font-medium text-gray-900 mb-3">
                  2nd Quarter Earnings
                </h1>
                <p className="leading-relaxed mb-5">Financial results</p>
              </div>
            </div>
          </div>
          <div className="py-8 px-4 lg:w-1/3">
            <div className="h-full flex items-start">
              <div className="w-12 flex-shrink-0 flex flex-col text-center leading-none">
                <span className="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">
                  Jul
                </span>
                <span className="font-medium text-lg text-gray-800 title-font leading-none">
                  18
                </span>
              </div>
              <div className="flex-grow pl-6">
                <h2 className="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">
                  SHAREHOLDER VOTING
                </h2>
                <h1 className="title-font text-xl font-medium text-gray-900 mb-3">
                  Vote for stock split
                </h1>
                <p className="leading-relaxed mb-5">Split ratio 1:4</p>
              </div>
            </div>
          </div>
          <div className="py-8 px-4 lg:w-1/3">
            <div className="h-full flex items-start">
              <div className="w-12 flex-shrink-0 flex flex-col text-center leading-none">
                <span className="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">
                  Nov
                </span>
                <span className="font-medium text-lg text-gray-800 title-font leading-none">
                  5
                </span>
              </div>
              <div className="flex-grow pl-6">
                <h2 className="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">
                  EARNINGS
                </h2>
                <h1 className="title-font text-xl font-medium text-gray-900 mb-3">
                  3rd Quarter Earnings
                </h1>
                <p className="leading-relaxed mb-5">Financial results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImportantDatesForStocks;
