import React from "react";

const StockMetrics = ({ companyOfficers }) => {
  console.log("companyOfficers", companyOfficers);
  return (
    <section className="card my-5 text-gray-600 body-font">
      <div className="container px-5 py-5 mx-auto">
        <div className="flex flex-col text-left w-full mb-5">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Key Management
          </h1>
        </div>
        <div className="flex flex-wrap -m-2">
          {companyOfficers &&
            companyOfficers.slice(0, 6).map((officer) => (
              <div key={officer.name} className="p-2 lg:w-1/3 md:w-1/2 w-full">
                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                  <div className="flex-grow">
                    <h2 className="text-gray-900 title-font font-medium">
                      {officer.name}
                      {officer.age ? `, ${officer.age}` : ""}
                    </h2>
                    <p className="text-gray-500 my-0">{officer.title}</p>
                    {officer.totalPay && (
                      <p className="text-gray-500 my-0">
                        Salary: {officer.totalPay.fmt}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default StockMetrics;
