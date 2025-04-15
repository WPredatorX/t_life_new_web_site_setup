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
} from "@mui/material";
import { Yup } from "@/utilities";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppCard, AppCardWithTab } from "@/components";
import { Controller } from "react-hook-form";
import { setDialog } from "@stores/slices";
import { useAppDispatch, useAppSelector } from "@hooks";
import { PageCommonDataProductSale, PageDataOutput } from "./components";

const PageProductsSale = ({ productPlanId, mode, type, saleChannelId }) => {
  const [tabContent, setTabContent] = useState([]);
  const [tabLabel, setTabLabel] = useState([]);
  const theme = useTheme();
  const [productCondition, setProductCondition] = useState(null);
  const [productPlan, setProductPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const brokerId = useAppSelector((state) => state.global.brokerId);
  const dispatch = useAppDispatch();
  useEffect(() => {

    handleAddOrUpdateProduct();
    handleFetchProductCondition();
    settab();
  }, []);
  const settab = () => {
    let data = [
      <PageCommonDataProductSale productId={productPlanId} type={type} saleChannelId={saleChannelId} />,
      <PageDataOutput />,
    ];
    let labeltab = ["ข้อมูลทั่วไป", "ข้อมูลการแสดงผล"];
    setTabContent(data);
    setTabLabel(labeltab);
  };
  const handleAddOrUpdateProduct = async () => {
    setLoading(true);
    const body = {
      is_active: true,
      create_date: null,
      create_by: "Systems",
      update_date: null,
      update_by: null,
      product_sale_channel_id: saleChannelId,
      product_plan_id: productPlanId,
      channel_id: null,
      broker_id: brokerId,
      min_coverage_amount: 0,
      max_coverage_amount: 0,
      min_age_years: 0,
      min_age_months: 0,
      min_age_days: 0,
      max_age_years: 0,
      max_age_months: 0,
      max_age_days: 0,
      product_sale_group_type: "1"
    }
    const response = await fetch(
      `/api/direct?action=AddOrUpdateProductPlanByChannel`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();


    setProductPlan(data);

    setLoading(false);
  };

  const handleFetchProductCondition = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/direct?action=getSaleConditionByProductId&productId=${saleChannelId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    setProductCondition(data);
    setLoading(false);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <AppCard title={"สินค้าที่ขาย"}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography>Plan Code</Typography>
              <TextField fullWidth value={productCondition ? productCondition.i_plan : ""} size="small" disabled />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>ชื่อ</Typography>
              <TextField fullWidth value={productCondition ? productCondition.title : ""} size="small" disabled />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>โปรโมชั่น</Typography>
              <TextField fullWidth value={productCondition ? productCondition.promotion : ""} size="small" disabled />
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
      <Grid item xs={12} mt={2}>
        <Card>
          <Grid container spacing={2} justifyContent={"center"} mt={2}>
            <Grid item xs={11.3}>
              <Grid container justifyContent={"end"} spacing={2}>
                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    sx={{
                      color: theme.palette.common.white,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  >
                    ยกเลิกการใช้งาน
                  </Button>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button variant="outlined">ยกเลิก</Button>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button variant="outlined">ล้างค่า</Button>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    sx={{
                      color: theme.palette.common.white,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  >
                    ขออนุมัติ
                  </Button>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    sx={{
                      color: theme.palette.common.white,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  >
                    บันทึกแบบร่าง
                  </Button>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    sx={{
                      color: theme.palette.common.white,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  >
                    ดูตัวอย่าง
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent={"center"} mt={2}>
            <Grid item xs={11.3}>
              <Grid container justifyContent={"end"} columnGap={2}>
                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    sx={{
                      color: "white",
                      backgroundColor: theme.palette.error.dark,
                    }}
                  >
                    ไม่อนุมัติข้อมูลทั่วไป
                  </Button>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    sx={{
                      color: "white",
                      background: "green",
                    }}
                  >
                    อนุมัติข้อมูลทั่วไป
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container mt={2} justifyContent={"center"} mb={4}>
            <Grid item xs={11.3}>
              <Grid container justifyContent={"end"} columnGap={2}>
                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    sx={{
                      color: "white",
                      backgroundColor: theme.palette.error.dark,
                    }}
                  >
                    ไม่อนุมัติข้อมูลการแสดงผล
                  </Button>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    sx={{
                      color: "white",
                      background: "green",
                    }}
                  >
                    อนุมัติข้อมูลการแสดงผล
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PageProductsSale;
