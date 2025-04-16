"use client";
import { useState, useEffect } from "react";
import { useAppSnackbar, useAppRouter, useAppForm } from "@hooks";
import {
  Tab,
  Grid,
  TextField,
  Typography,
  FormHelperText,
  Switch,
  FormControlLabel,
  Button,
  Card,
  useTheme,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { Yup } from "@/utilities";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppCard, AppCardWithTab } from "@/components";
import { Controller } from "react-hook-form";
import { setDialog } from "@stores/slices";
import { useAppDispatch, useAppSelector } from "@hooks";
import { PageCommonDataProductSale, PageDataOutput } from "./components";

const PageProductsSale = ({
  productPlanId,
  mode,
  type,
  saleChannelId,
  productCondition,
}) => {
  const [tabContent, setTabContent] = useState([]);
  const [tabLabel, setTabLabel] = useState([]);
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const brokerId = useAppSelector((state) => state.global.brokerId);
  const dispatch = useAppDispatch();
  useEffect(() => {
    settab();
  }, []);
  const settab = () => {
    console.log("productcondition index", productCondition);
    let data = [
      <PageCommonDataProductSale
        productId={productPlanId}
        type={type}
        saleChannelId={saleChannelId}
        productCondition={productCondition}
      />,
      <PageDataOutput />,
    ];
    let labeltab = ["ข้อมูลทั่วไป", "ข้อมูลการแสดงผล"];
    setTabContent(data);
    setTabLabel(labeltab);
  };

  if (loading) {
    return <CircularProgress />;
  }
  return (
    <Grid container>
      <Grid item xs={12}>
        <AppCard title={"สินค้าที่ขาย"}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography>Plan Code</Typography>
              <TextField
                fullWidth
                value={productCondition ? productCondition.i_plan : ""}
                size="small"
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>ชื่อ</Typography>
              <TextField
                fullWidth
                value={productCondition ? productCondition.title : ""}
                size="small"
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>โปรโมชั่น</Typography>
              <TextField
                fullWidth
                value={productCondition ? productCondition.promotion : ""}
                size="small"
                disabled
              />
            </Grid>
          </Grid>
        </AppCard>
      </Grid>
      <Grid item xs={12} mt={2}>
        <AppCardWithTab
          mode={mode}
          tabContent={tabContent}
          tabLabels={tabLabel}
          cardstyle={{
            border: "1px solid",
            borderColor: "#e7e7e7",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default PageProductsSale;
