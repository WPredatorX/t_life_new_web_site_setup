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

const PageProductsSale = ({ productId, mode, type }) => {
  const [tabContent, setTabContent] = useState([]);
  const [tabLabel, setTabLabel] = useState([]);
  const theme = useTheme();
  useEffect(() => {
    settab();
  }, []);
  const settab = () => {
    let data = [
      <PageCommonDataProductSale productId={productId} type={type} />,
      <PageDataOutput />,
    ];
    let labeltab = ["ข้อมูลทั่วไป", "ข้อมูลการแสดงผล"];
    setTabContent(data);
    setTabLabel(labeltab);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <AppCard title={"สินค้าที่ขาย"}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography>Plan Code</Typography>
              <TextField fullWidth size="small" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>ชื่อ</Typography>
              <TextField fullWidth size="small" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>โปรโมชั่น</Typography>
              <TextField fullWidth size="small" />
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
