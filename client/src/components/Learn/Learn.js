import React from "react";
import MainLayout from "components/layouts/MainLayout";

import useData from "./useData";

const Learn = () => {
  const { URL, start, stop, reset } = useData(0, 500);
  console.log({ URL });

  return (
    <MainLayout>
      {" "}
      <div>
        count:
        <button className="p-2 ml-4 bg-gray-200 font-bold" onClick={start}>
          START
        </button>
        <button className="p-2 ml-4 bg-gray-200 font-bold" onClick={stop}>
          STOP
        </button>
        <button className="p-2 ml-4 bg-gray-200 font-bold" onClick={reset}>
          RESET
        </button>
      </div>
    </MainLayout>
  );
};

export default Learn;
