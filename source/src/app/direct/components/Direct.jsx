"use client";

import { PageDirect, AppLoadData } from "@/components";
import { useAppFeatureCheck } from "@hooks";

export const dynamic = "force-dynamic";

const Direct = ({ tabIndex, promotionCode }) => {
  const { validFeature } = useAppFeatureCheck([
    // แท็บข้อมูลทั่วไป
    "direct.general.read",
    "direct.general.write",

    // แท็บผลิตภัณฑ์ที่ขาย
    "direct.product.query",

    // แท็บข้อมูลทั่วไปของสินค้า
    "direct.product.general.read",
    "direct.product.general.write",
    "direct.product.general.request",
    "direct.product.general.approve",

    // แท็บข้อมูลการแสดงผลของสินค้า
    "direct.product.display.read",
    "direct.product.display.write",
    "direct.product.display.request",
    "direct.product.display.approve",
    "direct.product.drop",

    // แท็บโปรไฟล์แสดงผล
    "direct.profile.read",
    "direct.profile.write",
    "direct.profile.request",
    "direct.profile.approve",

    // แท็บโปรโมชั่น
    "direct.promotion.query",
    "direct.promotion.read",
    "direct.promotion.write",
    "direct.promotion.request",
    "direct.promotion.approve",
    "direct.promotion.drop",
  ]);

  if (!validFeature) {
    return <AppLoadData loadingState={3} />;
  }

  return (
    <PageDirect
      tabIndex={parseInt(tabIndex ?? 0)}
      promotionCode={promotionCode ?? ""}
    />
  );
};

export default Direct;
