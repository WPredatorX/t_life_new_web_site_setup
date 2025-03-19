import { useState, useEffect } from "react";
import { Tab, Card, Button, Grid, Tabs, Typography } from "@mui/material";
import {
  AppCommonData,
  AppProductList,
  AppProfile,
  AppPromotion,
} from "./components";
import AppCardWithTabs from "../app-cardwithtabs";

const AppDirectBrokerCard = ({ mode }) => {
  const [tabContent, setTabContent] = useState([]);
  const [tabLabel, setTabLabel] = useState([]);

  useEffect(() => {
    settab();
  }, []);

  const settab = () => {
    if (mode === "Direct") {
      let data = [
        <AppCommonData mode={mode} />,
        <AppProductList mode={mode} />,
        <AppProfile />,
        <AppPromotion />,
      ];
      setTabContent(data);
      let labeltab = [
        "ข้อมูลทั่วไป",
        "ผลิตภัณฑ์ที่ขาย",
        "โปรไฟล์แสดงผล",
        "โปรโมชั่น",
      ];
      setTabLabel(labeltab);
    } else if (mode === "Broker") {
      let data = [
        <AppCommonData mode={mode} />,
        <AppProductList mode={mode} />,
        <AppProfile />,
      ];
      let labeltab = ["ข้อมูลทั่วไป", "ผลิตภัณฑ์ที่ขาย", "โปรไฟล์แสดงผล"];
      setTabContent(data);
      setTabLabel(labeltab);
    }
  };

  return (
    <Grid>
      <AppCardWithTabs
        mode={mode}
        tabContent={tabContent}
        tabLabels={tabLabel}
      ></AppCardWithTabs>
    </Grid>
  );
};

export default AppDirectBrokerCard;
