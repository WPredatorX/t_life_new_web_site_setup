"use client";

import { useEffect, useState } from "react";
import { PageProductSale, AppLoadData } from "@components";
import { useAppFeatureCheck, useAppDispatch, useAppSnackbar } from "@hooks";
import { setBrokerId } from "@stores/slices";

const ProductSale = ({
  params: { productPlanId },
  searchParams: { mode, type, saleChannelId, channel, brokerId },
}) => {
  const dispatch = useAppDispatch();
  const { handleSnackAlert } = useAppSnackbar();
  const { validFeature } = useAppFeatureCheck([
    // แท็บข้อมูลทั่วไป
    "direct.product.general.read",
    "direct.product.general.write",
    "direct.product.general.request",
    "direct.product.general.approve",

    // แท็บข้อมูลการแสดงผล
    "direct.product.display.read",
    "direct.product.display.write",
    "direct.product.display.request",
    "direct.product.display.approve",
    "direct.product.display.drop",
  ]);
  const [productCondition, setProductCondition] = useState(null);

  const handleFetchProductCondition = async () => {
    try {
      const response = await fetch(
        `/api/direct?action=getSaleConditionByProductId&productId=${saleChannelId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status !== 200) throw new Error("");

      const data = await response.json();
      setProductCondition(data);
      dispatch(setBrokerId(brokerId));
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด " + error,
      });
    }
  };

  useEffect(() => {
    handleFetchProductCondition();
  }, []);

  if (!validFeature) {
    return <AppLoadData loadingState={3} />;
  }

  if (productCondition === null) {
    return <AppLoadData loadingState={0} />;
  }

  return (
    <PageProductSale
      mode={mode}
      type={type}
      channel={channel}
      productPlanId={productPlanId}
      saleChannelId={saleChannelId}
      productCondition={productCondition}
    />
  );
};

export default ProductSale;
