"use client";

import { PageProductsList, AppLoadData } from "@components";
import { useAppFeatureCheck } from "@hooks";

const Products = () => {
  const requireFeature = [
    // หน้าค้นหาผลิตภัณฑ์
    "product.query",

    // หน้าข้อมูลทั่วไป
    "product.general.read",
    "product.general.write",

    // หน้าตั้งค่า
    "product.setting.read",
    "product.setting.write",
  ];

  const { validFeature } = useAppFeatureCheck(requireFeature);

  if (!validFeature) {
    return <AppLoadData loadingState={3} />;
  }

  return <PageProductsList />;
};

export default Products;
