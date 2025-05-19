"use client";

import { useState, useEffect } from "react";
import {
  Tab,
  Tabs,
  Grid,
  Card,
  Divider,
  TextField,
  Typography,
  CardContent,
} from "@mui/material";
import { AppCard } from "@/components";
import { useAppFeatureCheck, useAppSnackbar } from "@hooks";
import { PageCommonDataProductSale, PageProductDisplay } from "./components";

const PageProductsSale = ({
  mode,
  type,
  channel,
  productPlanId,
  saleChannelId,
  productCondition,
}) => {
  const [broker, setBroker] = useState();
  const { handleSnackAlert } = useAppSnackbar();
  const { validFeature: grantGeneral } = useAppFeatureCheck([
    "direct.product.general.read",
    "direct.product.general.write",
    "direct.product.general.request",
    "direct.product.general.approve",
  ]);
  const { validFeature: grantDisplay } = useAppFeatureCheck([
    "direct.product.display.read",
    "direct.product.display.write",
    "direct.product.display.request",
    "direct.product.display.approve",
    "direct.product.display.drop",
  ]);
  const [value, setValue] = useState(grantGeneral ? 0 : 1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFetchBrokerData = async () => {
    try {
      const payload = {
        i_subbusiness_line: channel,
      };
      const response = await fetch(`/api/direct?action=GetDirectGeneralInfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      const targetData = data[0];
      setBroker(targetData);
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    }
  };

  useEffect(() => {
    handleFetchBrokerData();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <AppCard title={"สินค้าที่ขาย"}>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={4}>
              <Typography>ช่องทาง</Typography>
              <TextField fullWidth value={channel} size="small" disabled />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>ชื่อช่องทาง</Typography>
              <TextField
                fullWidth
                value={broker?.c_subbusiness_line}
                size="small"
                disabled
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography>Plan Code</Typography>
              <TextField
                fullWidth
                value={productCondition.i_plan ? productCondition.i_plan : ""}
                size="small"
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>ชื่อ</Typography>
              <TextField
                fullWidth
                value={productCondition.title ? productCondition.title : ""}
                size="small"
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>โปรโมชั่น</Typography>
              <TextField
                fullWidth
                value={
                  productCondition.promotion ? productCondition.promotion : ""
                }
                size="small"
                disabled
              />
            </Grid>
          </Grid>
        </AppCard>
      </Grid>
      <Grid item xs={12} mt={2}>
        <Card>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            {grantGeneral && <Tab value={0} label={"ข้อมูลทั่วไป"} />}
            {grantDisplay && <Tab value={1} label={"ข้อมูลการแสดงผล"} />}
          </Tabs>
          <Divider />
          <CardContent>
            <Grid container>
              {value === 0 && grantGeneral && (
                <Grid item xs={12}>
                  <PageCommonDataProductSale
                    mode={mode}
                    type={type}
                    channel={channel}
                    productId={productPlanId}
                    saleChannelId={saleChannelId}
                    productCondition={productCondition}
                  />
                </Grid>
              )}
              {value === 1 && grantDisplay && (
                <Grid item xs={12}>
                  <PageProductDisplay
                    mode={mode}
                    type={type}
                    channel={channel}
                    productId={productPlanId}
                    saleChannelId={saleChannelId}
                    productCondition={productCondition}
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PageProductsSale;
