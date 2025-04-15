"use client";
import { PageProductSale } from "@/components";
const ProductSale = ({
  params: { productId },
  searchParams: { mode, type, saleChannelId },
}) => {
  return <PageProductSale productPlanId={productId} mode={mode} type={type} saleChannelId={saleChannelId} />;
};

export default ProductSale;
