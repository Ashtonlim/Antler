import React from "react";

import HomeHero from "./HomeHero";
import HomeContent from "./HomeContent";

import MainLayout from "components/layouts/MainLayout";

import { Button, Space } from 'antd';

const Home = () => {
  return (
    <MainLayout>
      <section>Hello
      <Button type="primary">Primary Button</Button>
      </section>
      <HomeHero />
      <HomeContent />
    </MainLayout>
  );
};

export default Home;
