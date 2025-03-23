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
    IPlan: Yup.array().of(
      Yup.object().shape({
        i_package: Yup.string().required("กรุณาระบุรหัสแพ็คเกจ"),
        plan_code: Yup.string().nullable(),
        product_name: Yup.string().nullable(),
        promise_type: Yup.string().nullable(),
        is_active: Yup.boolean().nullable(),
        active_status: Yup.string().nullable(),
        create_by: Yup.string().nullable(),
        create_date: Yup.date().nullable(),
        update_by: Yup.string().nullable(),
        update_date: Yup.date().nullable(),
      })
    ),
    ICapital: Yup.array().of(
      Yup.object().shape({
        n_no: Yup.string().nullable(),
        m_sa: Yup.string().nullable(),
      })
    ),
    commonSetting: Yup.object().shape({
      product_plan_id: Yup.string().required("กรุณาระบุรหัสแผนสินค้า"),
      i_package: Yup.string().required("กรุณาระบุรหัสแพ็คเกจ"),
      title: Yup.string().required("กรุณาระบุหัวข้อ"),
      description: Yup.string().nullable(),
      content_url: Yup.string().nullable(),
      beneficiary_content_url: Yup.string().nullable(),
      is_fatca: Yup.boolean().default(true),
      is_crs: Yup.boolean().default(true),
      is_refund: Yup.boolean().default(true),
      is_tex: Yup.boolean().default(true),
      is_send_mail: Yup.boolean().default(true),
      is_send_sms: Yup.boolean().default(true),
      is_recurring: Yup.boolean().default(true),
      is_health: Yup.boolean().default(true),
      is_factor: Yup.boolean().default(true),
      is_sale_fatca: Yup.boolean().default(true),
      is_sale_crs: Yup.boolean().default(true),
      i_plan: Yup.string().nullable(),
      ordinary_class: Yup.object().nullable(),
      is_check_fatca: Yup.boolean().default(true),
      remark_marketing_name: Yup.string().nullable(),
      item_name: Yup.string().nullable(),
      is_download: Yup.boolean().default(true),
      c_package: Yup.string().nullable(),
      quo_document_id: Yup.string().nullable(),
      document_id: Yup.string().nullable(),
      is_active: Yup.boolean().default(true),
      create_date: Yup.date().nullable(),
      create_by: Yup.string().nullable(),
      update_date: Yup.date().nullable(),
      update_by: Yup.string().nullable(),
      cal_temp_code: Yup.string().default("01"),
    }),
    _document: Yup.object().nullable(),
    document: Yup.array().of(
      Yup.object().shape({
        detail_id: Yup.string().nullable(),
        quo_document_id: Yup.string().nullable(),
        title: Yup.string().nullable(),
        description: Yup.string().nullable(),
        seq: Yup.number().default(1),
        detail_type: Yup.number().default(1),
        product_plan_id: Yup.string().nullable(),
        document_id: Yup.string().nullable(),
        is_active: Yup.boolean().default(true),
        create_date: Yup.date().nullable(),
        create_by: Yup.string().nullable(),
        update_date: Yup.date().nullable(),
        update_by: Yup.string().nullable(),
      })
    ),
  });
  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
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
      is_CalculateFromCoverageToPremium: false,
      is_CalculateFromPremiumToCoverage: false,
      _document: [],
      document: {
        detail_id: "",
        quo_document_id: "",
        title: null,
        description: "",
        seq: 1,
        detail_type: 1,
        product_plan_id: "",
        document_id: "",
        is_active: true,
        create_date: null,
        create_by: null,
        update_date: null,
        update_by: null,
      },
    },
  });

  const { reset, watch, setValue } = formMethods;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // เตรียมข้อมูลสำหรับส่งไป API
      const Productpayload = {
        common_setting: {
          i_package: i_package,
          product_plan_id: product_plan_id,
          title: watch("commonSetting.title") || null,
          description: watch("commonSetting.description") || null,
          content_url: watch("commonSetting.content_url") || null,
          beneficiary_content_url:
            watch("commonSetting.beneficiary_content_url") || null,
          is_check_fatca: watch("commonSetting.is_check_fatca") || false,
          is_fatca: watch("commonSetting.is_fatca") || false,
          is_sale_fatca: watch("commonSetting.is_sale_fatca") || false,
          is_crs: watch("commonSetting.is_crs") || false,
          is_sale_crs: watch("commonSetting.is_sale_crs") || false,
          is_health: watch("commonSetting.is_health") || false,
          is_refund: watch("commonSetting.is_refund") || false,
          is_recurring: watch("commonSetting.is_recurring") || false,
          is_tex: watch("commonSetting.is_tex") || false,
          is_factor: watch("commonSetting.is_factor") || false,
          ordinary_class: watch("commonSetting.ordinary_class.id") || null,
          cal_temp_code: watch("is_CalculateFromCoverageToPremium")
            ? "01"
            : "02",
          is_send_sms: watch("commonSetting.is_send_sms") || false,
          is_send_mail: watch("commonSetting.is_send_mail") || false,
          document_id: watch("document.document_id") || watch("_document?.id"),
          quo_document_id:
            watch("document.quo_document_id") || watch("_document?.id"),
          remark_marketing_name:
            watch("commonSetting.remark_marketing_name") || "",
          item_name: watch("commonSetting.item_name") || "",
          is_download: watch("commonSetting.is_download") || false,
          c_package: watch("commonSetting.c_package") || "",
          is_active: watch("commonSetting.is_active") || true,
          create_by: watch("commonSetting.create_by") || "admin",
          create_date: watch("commonSetting.create_date") || new Date(),
          update_by: watch("commonSetting.update_by") || "admin",
          update_date: watch("commonSetting.update_date") || new Date(),
        },
      };

      const Documentpayload = {
        document:
          watch("document")?.map((item) => ({
            detail_id: item.detail_id,
            document_id: item.document_id,
            quo_document_id: item.quo_document_id,
            product_plan_id: product_plan_id,
            title: item.title,
            create_by: item.create_by,
            create_date: item.create_date,
            update_by: item.update_by,
            update_date: item.update_date,
            is_active: item.is_active,
            description: item.description,
            seq: item.seq,
            detail_type: item.detail_type,
          })) || [],
      };

      console.log("Productpayload", Productpayload.common_setting);
      console.log("Documentpayload", Documentpayload.document);

      // ส่งข้อมูลไป API
      const response = await fetch(
        "/api/products?action=AddOrUpdateProductOnShelf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Productpayload.common_setting),
        }
      );

      const responseDocument = await fetch(
        "/api/products?action=addOrUpdateProductDocument",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Documentpayload.document),
        }
      );

      if (!response.ok || !responseDocument.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const resultDocument = await responseDocument.json();
      handleNotiification("บันทึกข้อมูลสำเร็จ", () => {
        setTimeout(() => {
          // อาจจะเพิ่มการ redirect หรือ refresh ข้อมูลที่นี่
        }, 400);
      });

      return result;
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`,
        severity: "error",
      });
      return null;
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

        let dataDocumentAppDetail;
        if (dataProduct[0].document_id && dataProduct[0].quo_document_id) {
          let dataBodyDoc = JSON.stringify({
            detail_id: dataProduct[0].document_id,
            quo_document_id: dataProduct[0].quo_document_id,
            title: "",
          });
          console.log("databodyDoc", dataBodyDoc);
          let responseDocumentAppDetail = await fetch(
            `/api/products?action=getDocumentAppDetailById`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: dataBodyDoc,
            }
          );

          dataDocumentAppDetail = await responseDocumentAppDetail.json();
        }

        reset({
          IPlan: dataInsurancePlan || [],
          ICapital: dataInsuranceCapital || [],
          commonSetting: dataProduct[0],
          document: dataDocumentAppDetail,
          _document: null,
          is_CalculateFromCoverageToPremium: false,
          is_CalculateFromPremiumToCoverage: false,
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
      <form>
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
                    onClick={onSubmit}
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
