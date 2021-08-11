import React, { useEffect, useContext } from "react";
import PortfolioTable from "./PortfolioTable";

import GC from "context";
import MainLayout from "components/layouts/MainLayout";

const Portfolio = () => {
  const { state } = useContext(GC);
  useEffect(() => {}, [state]);

  return (
    <MainLayout>
      <h1>Add % of portfolio field (weightage)</h1>
      {state.userObj?.stock_portfolio ? (
        <PortfolioTable portfolio={state.userObj.stock_portfolio} />
      ) : (
        ""
      )}
    </MainLayout>
  );
};

export default Portfolio;
