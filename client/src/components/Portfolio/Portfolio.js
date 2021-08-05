import React, { useContext } from "react";
import PortfolioTable from "./PortfolioTable";

import GC from "context";
import MainLayout from "components/layouts/MainLayout";

const Portfolio = () => {
  const { state } = useContext(GC);

  return (
    <MainLayout>
      {state.userObj?.stock_portfolio ? (
        <PortfolioTable portfolio={state.userObj.stock_portfolio} />
      ) : (
        ""
      )}
    </MainLayout>
  );
};

export default Portfolio;
