import React from "react";

import HomeHero from "./HomeHero";
import HomeContent from "./HomeContent";

import MainLayout from "components/layouts/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <HomeHero />
      <HomeContent />
      <section></section>
    </MainLayout>
  );
};

export default Home;
