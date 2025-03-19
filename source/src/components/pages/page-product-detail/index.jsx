"use client";
import { useState, useEffect } from "react";
import { useAppSnackbar, useAppRouter, useAppForm } from "@hooks";
import { Yup } from "@/utilities";
import {
  Grid,
  TextField,
  Typography,
  FormHelperText,
  Switch,
  FormControlLabel,
  Button,
  Card,
  useTheme,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppCard, AppCardWithTab } from "@/components";
import { Controller } from "react-hook-form";
import { setDialog } from "@stores/slices";
import { useAppDispatch, useAppSelector } from "@hooks";
import {
  PageCommonData,
  PageCommonSetting,
  PageDocumentSetting,
} from "./components";

const PageProductsDetail = ({
  productId,
  productName,
  i_package,
  mode,
  type,
}) => {
  const router = useAppRouter();
  const theme = useTheme();
  const [data, setData] = useState();
  const [tabContent, setTabContent] = useState([]);
  const [tabLabel, setTabLabel] = useState([]);
  const { handleSnackAlert } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { dialog } = useAppSelector((state) => state.global);
  const validationSchema = Yup.object().shape({
    planCode: Yup.string().nullable(),
    name: Yup.string(),
    CalculateFromCoverageToPremium: Yup.mixed().nullable(),
    CalculateFromPremiumToCoverage: Yup.mixed().nullable(),
    AskFatca: Yup.mixed().nullable(),
    SellFatca: Yup.mixed().nullable(),
    AskCrs: Yup.mixed().nullable(),
    SellCrs: Yup.mixed().nullable(),
    AskHealth: Yup.mixed().nullable(),
    has_return_amount: Yup.mixed().nullable(),
    next_installment: Yup.mixed().nullable(),
    tax_deduction: Yup.mixed().nullable(),
    Calculate_factor: Yup.mixed().nullable(),
    send_sms: Yup.mixed().nullable(),
    send_email: Yup.mixed().nullable(),
  });
  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      commonData: {
        IPlan: [
          {
            i_package: "",
            plan_code: "",
            product_name: "",
            promise_type: "",
            is_active: null,
            active_status: "",
            create_by: "",
            create_date: null,
            update_by: "",
            update_date: null,
          },
        ],
        ICapital: [
          {
            n_no: null,
          },
        ],
      },
      commonSetting: {
        is_active: null,
        create_date: null,
        create_by: "",
        update_date: null,
        update_by: "",
        product_plan_id: "",
        i_package: "",
        title: "",
        description: "",
        content_url: "",
        beneficiary_content_url: "",
        is_fatca: false,
        is_crs: false,
        is_refund: false,
        is_tax: false,
        is_send_mail: false,
        is_send_sms: false,
        is_recurring: false,
        is_health: false,
        is_factor: false,
        is_sale_fatca: false,
        is_sale_crs: false,
        i_plan: "",
        is_check_fatca: false,
        remark_marketing_name: "",
        item_name: "",
        is_download: null,
      },
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    handleNotiification("บันทึกข้อมูลสำเร็จ", () => {
      setTimeout(() => {}, 400);
    });
    try {
      console.log("submit", { data });
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };
  const handleResetForm = () => {
    const alert = handleNotiification("ล้างข้อมูลสำเร็จ", () => {
      return true;
    });
    console.log(alert);
  };

  const handleBack = () => {
    router.push(`/products/`);
  };

  useEffect(() => {
    setTab();
  }, []);

  const setTab = () => {
    let data = [
      <PageCommonData
        //formMethods={{ ...formMethods }}
        productId={productId}
        i_package={i_package}
        type={type}
      />,
      <PageCommonSetting
        formMethods={{ ...formMethods }}
        productId={productId}
        mode={mode}
        type={type}
      />,
    ];
    let labelTab = ["ข้อมูลทั่วไป", "ตั้งค่าทั่วไป"];
    setTabContent(data);
    setTabLabel(labelTab);
  };

  const handleNotiification = (message, callback) => {
    dispatch(
      setDialog({
        ...dialog,
        open: true,
        title: message,
        useDefaultBehavior: false,
        renderAction: () => {
          return (
            <Grid container rowGap={2} justifyContent={"space-around"} p={2}>
              <Grid item xs={12} md={"auto"}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: theme.palette.common.white,
                    paddingX: 3,
                  }}
                  onClick={() => {
                    dispatch(
                      setDialog({
                        ...dialog,
                        open: false,
                        title: message,
                      })
                    );
                    callback();
                  }}
                >
                  ยืนยัน
                </Button>
              </Grid>
            </Grid>
          );
        },
      })
    );
  };
  /* to do list
  ตอน error api => เอา component ออกทั้งหมด
  ตอนโหลด => ใส่ process load
  */
  return (
    <Grid>
      <form onSubmit={onSubmit}>
        <AppCardWithTab
          mode={""}
          tabContent={tabContent}
          tabLabels={tabLabel}
        ></AppCardWithTab>
        <Grid container mt={2}>
          <Grid item xs>
            <Card>
              <Grid container spacing={2} justifyContent={"end"} pr={4}>
                <Grid item xs="auto" my={3}>
                  <Button
                    sx={{
                      border: "1px solid #ccc",

                      color: "black",
                    }}
                    onClick={handleBack}
                  >
                    ยกเลิก
                  </Button>
                </Grid>
                {/*  */}
                <Grid item xs="auto" my={3}>
                  <Button
                    disabled={mode === "VIEW"}
                    sx={{
                      border: "1px solid #ccc",

                      color: "black",
                    }}
                    onClick={handleResetForm}
                  >
                    ล้างข้อมูล
                  </Button>
                </Grid>
                <Grid item xs="auto" my={3}>
                  <Button
                    disabled={mode === "VIEW"}
                    type="submit"
                    sx={{
                      backgroundColor: theme.palette.primary.main,

                      color: "white",
                    }}
                  >
                    บันทึก
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default PageProductsDetail;
