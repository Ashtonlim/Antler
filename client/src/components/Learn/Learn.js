import React from "react";
import MainLayout from "components/layouts/MainLayout";

import useData from "./useData";
import useYfws from "components/hooks/useYfws";

const Learn = () => {
  const { URL, start, stop, reset } = useData(0, 500);

  const { next } = useYfws(["jpy=x"]);
  console.log(next);

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
