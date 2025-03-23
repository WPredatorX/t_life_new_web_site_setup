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
  i_package,
  mode,
  type,
  product_plan_id,
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
            n_no: "",
            m_sa: "",
          },
        ],
      },
      commonSetting: {
        product_plan_id: "",
        i_package: "",
        title: "",
        description: "",
        content_url: "",
        beneficiary_content_url: "",
        is_fatca: true,
        is_crs: true,
        is_refund: true,
        is_tex: true,
        is_send_mail: true,
        is_send_sms: true,
        is_recurring: true,
        is_health: true,
        is_factor: true,
        is_sale_fatca: true,
        is_sale_crs: true,
        i_plan: "",
        ordinary_class: null,
        is_check_fatca: true,
        remark_marketing_name: "",
        item_name: "",
        is_download: true,
        c_package: "",
        quo_document_id: null,
        document_id: null,
        is_active: true,
        create_date: null,
        create_by: "",
        update_date: null,
        update_by: "",
        cal_temp_code: "",
      },
    },
  });

  const { reset, watch, setValue } = formMethods;

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
    reset();
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
    handleFetchProduct();
  }, []);

  const setTab = () => {
    let data = [
      <PageCommonData
        formMethods={{ ...formMethods }}
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
  const handleFetchProduct = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        let response = await fetch(
          `/api/products?action=getInsurancePlan&IPackage=${i_package}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const dataInsurancePlan = await response.json();

        let responseCapital = await fetch(
          `/api/products?action=getAllInsuredCapital&IPackage=${i_package}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const dataInsuranceCapital = await responseCapital.json();

        let dataBody = JSON.stringify({
          product_plan_id: product_plan_id,
          i_package: i_package,
        });

        let responseProductOnShelf = await fetch(
          `/api/products?action=GetProductOnShelfById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: dataBody,
          }
        );

        const dataProduct = await responseProductOnShelf.json();

        reset({
          IPlan: dataInsurancePlan || [],
          ICapital: dataInsuranceCapital || [],
          commonSetting: dataProduct[0],
        });
      } catch (error) {
        handleSnackAlert({
          open: true,
          message: `ขออภัย เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้อง ${error}`,
        });
      } finally {
        setLoading(false);
      }
    }, 0);
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
  const handleFetchProductOnShelf = async () => {
    let dataBody = JSON.stringify({
      product_plan_id: product_plan_id,
      i_package: i_package,
    });
    const response = await fetch(
      `/api/products?action=GetProductOnShelfById`, //&pageNumber=${start}&pageSize=${limit}
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: dataBody,
      }
    );
    const data = await response.json();
  };
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
