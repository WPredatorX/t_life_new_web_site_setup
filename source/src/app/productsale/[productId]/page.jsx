"use client";
import { PageProductSale } from "@/components";
const ProductSale = ({
  params: { productId },
  searchParams: { mode, type },
}) => {
  return <PageProductSale productId={productId} mode={mode} type={type} />;
};

export default ProductSale;
