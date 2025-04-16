"use client";
import { PageProductSale } from "@/components";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
const ProductSale = ({
  params: { productId },
  searchParams: { mode, type, saleChannelId },
}) => {
  const [loading, setLoading] = useState(false);
  const [productCondition, setProductCondition] = useState(null);
  useEffect(() => {
    handleFetchProductCondition();
  }, []);
  const handleFetchProductCondition = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/direct?action=getSaleConditionByProductId&productId=${saleChannelId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setProductCondition(data);
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด " + error,
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <CircularProgress />;
  }
  return (
    <PageProductSale
      productPlanId={productId}
      mode={mode}
      type={type}
      saleChannelId={saleChannelId}
      productCondition={{ ...productCondition }}
    />
  );
};

export default ProductSale;
