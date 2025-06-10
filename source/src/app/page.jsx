"use client";

import { useAppFeatureCheck } from "@hooks";
import { AppLoadData } from "@components";

const Home = () => {
  const requireFeature = ["home"];
  const { validFeature } = useAppFeatureCheck(requireFeature);

  if (!validFeature) {
    return <AppLoadData loadingState={3} />;
  }

  return (
    <div>
      <main>Home</main>
    </div>
  );
};

export default Home;
