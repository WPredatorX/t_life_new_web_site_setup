"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@hooks";
import { setTabIndex, setPromotionCode } from "@stores/slices";
import { AppDirectBrokerCard } from "@components";

const PageBroker = ({ channel, tabIndex }) => {
  const dispatch = useAppDispatch();
  const { tabIndex: currentTabIndex } = useAppSelector((state) => state.global);

  useEffect(() => {
    if (tabIndex !== currentTabIndex) {
      dispatch(setTabIndex(tabIndex));
    }
  }, [tabIndex, currentTabIndex]);

  return <AppDirectBrokerCard mode={"broker"} channel={channel} />;
};
export default PageBroker;
