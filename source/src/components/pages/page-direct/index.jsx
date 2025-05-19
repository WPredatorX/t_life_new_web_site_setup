"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@hooks";
import { setTabIndex, setPromotionCode } from "@stores/slices";
import { AppDirectBrokerCard } from "@components";

const PageDirect = ({ tabIndex, promotionCode }) => {
  const dispatch = useAppDispatch();
  const { tabIndex: currentTabIndex, promotionCode: currentPromotionCode } =
    useAppSelector((state) => state.global);

  useEffect(() => {
    if (tabIndex !== currentTabIndex) {
      dispatch(setTabIndex(tabIndex));
    }
  }, [tabIndex, currentTabIndex]);

  useEffect(() => {
    if (promotionCode !== currentPromotionCode) {
      dispatch(setPromotionCode(promotionCode));
    }
  }, [promotionCode, currentPromotionCode]);

  return <AppDirectBrokerCard mode={"direct"} channel={"606"} />;
};

export default PageDirect;
