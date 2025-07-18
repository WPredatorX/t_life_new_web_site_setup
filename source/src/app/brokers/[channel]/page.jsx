"use client";

import { PageBroker, AppLoadData } from "@/components";
import { useAppFeatureCheck } from "@hooks";

const Brokers = ({ params: { channel }, searchParams: { tabIndex } }) => {
  const { validFeature } = useAppFeatureCheck([
    // แท็บข้อมูลทั่วไป
    "broker.general.read",
    "broker.general.write",

    // แท็บผลิตภัณฑ์ที่ขาย
    "broker.product.query",

    // แท็บข้อมูลทั่วไปของสินค้า
    "broker.product.general.read",
    "broker.product.general.write",
    "broker.product.general.approve",
    "broker.product.general.request",

    // แท็บข้อมูลการแสดงผลของสินค้า
    "broker.product.display.read",
    "broker.product.display.write",
    "broker.product.display.request",
    "broker.product.display.approve",
    "broker.product.drop",

    // แท็บโปรไฟล์แสดงผล
    "broker.profile.read",
    "broker.profile.write",
    "broker.profile.request",
    "broker.profile.approve",
  ]);

  if (!validFeature) {
    return <AppLoadData loadingState={3} />;
  }

  return <PageBroker channel={channel} tabIndex={parseInt(tabIndex ?? 0)} />;
};

export default Brokers;
