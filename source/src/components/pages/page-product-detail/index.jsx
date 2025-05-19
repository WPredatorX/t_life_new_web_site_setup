"use client";

import { useState, useEffect } from "react";
import {
  Tab,
  Tabs,
  Grid,
  Card,
  Button,
  Divider,
  useTheme,
  CardContent,
} from "@mui/material";
import { Yup } from "@utilities";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppLoadData } from "@components";
import { setDialog } from "@stores/slices";
import {
  useAppForm,
  useAppDialog,
  useAppRouter,
  useAppSelector,
  useAppSnackbar,
  useAppDispatch,
  useAppFeatureCheck,
} from "@hooks";
import { PageCommonData, PageCommonSetting } from "./components";

const PageProductsDetail = ({
  mode,
  type,
  i_package,
  productId,
  product_plan_id,
}) => {
  const requireFeature = [
    "product.general.read",
    "product.setting.read",
    "product.general.write",
    "product.setting.write",
  ];
  const router = useAppRouter();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { handleSnackAlert } = useAppSnackbar();
  const { handleNotification } = useAppDialog();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const { dialog, activator } = useAppSelector((state) => state.global);
  const { validFeature } = useAppFeatureCheck(requireFeature);

  const validationSchema = Yup.object().shape({
    type: Yup.string(),
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
      product_plan_id: Yup.string().required(),
      i_package: Yup.string().required(),
      title: Yup.string().required().preventSpace("ต้องไม่เป็นค่าว่าง"),
      description: Yup.string().nullable(),
      content_url: Yup.string().nullable(),
      beneficiary_content_url: Yup.string().nullable(),
      is_fatca: Yup.boolean().default(true),
      is_crs: Yup.boolean().default(true),
      is_refund: Yup.boolean().default(true),
      is_tax: Yup.boolean().default(true),
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
      remark_marketing_name: Yup.string()
        .nullable()
        .preventSpace("ต้องไม่เป็นค่าว่าง"),
      item_name: Yup.string()
        .nullable()
        .when("type", {
          is: "0",
          then: (schema) => schema.required(),
        })
        .preventSpace("ต้องไม่เป็นค่าว่าง"),
      is_download: Yup.boolean().default(true).nullable(),
      c_package: Yup.string().nullable(),
      quo_document_id: Yup.string().nullable(),
      document_id: Yup.string().nullable(),
      is_active: Yup.boolean().default(true),
      create_date: Yup.date().nullable(),
      create_by: Yup.string().nullable(),
      update_date: Yup.date().nullable(),
      update_by: Yup.string().nullable(),
      cal_temp_code: Yup.string().default("01").nullable(),
    }),
    is_CalculateFromCoverageToPremium: Yup.bool().default(true),
    is_CalculateFromPremiumToCoverage: Yup.bool().default(false),
    selectDoc: Yup.object().nullable(),
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
    document_1: Yup.array().of(
      Yup.object().shape({
        detail_id: Yup.string().nullable(),
        quo_document_id: Yup.string().nullable(),
        title: Yup.string().nullable(),
        description: Yup.string()
          .nullable()
          .when("is_active", {
            is: true,
            then: (schema) => schema.required(),
          }),
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
    document_2: Yup.array().of(
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
      type: type,
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
      selectDoc: null,
      document: [
        {
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
      ],
      beneficiary_document: {
        policy_document_type: "",
        policy_document_file: "",
        policy_document_file_blob: null,
        policy_document_name: "",
      },
    },
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isDirty },
  } = formMethods;

  // จำนวนบรรทัดที่สามารถเพิ่มได้
  const remainingLine =
    (watch("selectDoc")?.document_detail_size ?? 0) -
    watch("document_1")?.filter((item) => item.is_active).length;

  const handleResetForm = () => {
    if (isDirty) {
      handleNotification(
        "คุณต้องการล้างค่าการเปลี่ยนแปลงหรือไม่ ?",
        () => reset(),
        null,
        "question"
      );
    }
  };

  const handleBack = () => {
    handleNotification(
      "คุณต้องการยกเลิกการเปลี่ยนแปลงหรือไม่ ?",
      () => router.push("/products"),
      null,
      "question"
    );
  };

  const handleFetchTemplate = async () => {
    try {
      const response = await fetch(`/api/products?action=getProductDocument`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const dataDocument = await response.json();

      return dataDocument;
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ขออภัย เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้อง ${error}`,
      });
    }
  };

  const handleFetchProduct = async () => {
    setLoading(true);

    try {
      // #region โหลดข้อมูลของแบบแพคเกจ
      let dataInsurancePlan = [];
      let dataInsuranceCapital = [];
      if (i_package.toUpperCase() !== "NP-00") {
        let response = await fetch(
          `/api/products?action=getInsurancePlan&IPackage=${i_package}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        dataInsurancePlan = await response.json();

        let responseCapital = await fetch(
          `/api/products?action=getAllInsuredCapital&IPackage=${i_package}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        dataInsuranceCapital = await responseCapital.json();
      }
      // #endregion

      // #region โหลดข้อมูลผลิตภัณฑ์
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
      // #endregion

      // #region โหลดเอกสารสิทธิตามกรมธรรม
      let requestPolicyHolder = {
        product_plan_id: dataProduct[0].product_plan_id,
        policy_document_type: "1",
      };
      let responsePolicyHolder = await fetch(
        `/api/products?action=เetPolicyholderDocumentsById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPolicyHolder),
        }
      );
      let _selectOdct = null;
      let policyHolderData = null;
      const _policyHolderData = await responsePolicyHolder.json();
      if (_policyHolderData) {
        policyHolderData = _policyHolderData[0] ?? null;
      }
      // #endregion

      // #region โหลดข้อมูลเทมเพลตให้คำขอของผลิตภัณฑ์
      const templateList = await handleFetchTemplate();
      _selectOdct = Array.from(templateList).find(
        (item) =>
          item.document_code?.toLowerCase() ===
          dataProduct[0]?.document_code?.toLowerCase()
      );
      // #endregion

      // #region โหลดข้อมูลข้อความหมายเหตุ
      let dataDocumentAppDetail = [];
      if (dataProduct[0].document_id && dataProduct[0].quo_document_id) {
        let dataBodyDoc = JSON.stringify({
          detail_id: null,
          quo_document_id: dataProduct[0].quo_document_id,
          title: "",
        });
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
      const mappedDataDocument = (dataDocumentAppDetail || []).map((item) => {
        return {
          ...item,
          isNew: false,
        };
      });
      // #endregion

      // #region ทำค่า default เพื่อแสดงผลหน้าจอ
      const cal_temp_code = dataProduct[0]?.cal_temp_code ?? "";
      const doc1 = mappedDataDocument.filter((item) => item.detail_type === 1);
      const doc2 = mappedDataDocument.filter((item) => item.detail_type === 2);
      const prepareReset = {
        IPlan: dataInsurancePlan || [],
        ICapital: dataInsuranceCapital || [],
        commonSetting: dataProduct[0],
        document: mappedDataDocument || [],
        document_1: doc1,
        document_2: doc2,
        is_CalculateFromCoverageToPremium:
          cal_temp_code === "01" || cal_temp_code === "03",
        is_CalculateFromPremiumToCoverage:
          cal_temp_code === "02" || cal_temp_code === "03",
        title: dataDocumentAppDetail?.[0]?.title || "",
        beneficiary_document: {
          policy_document_type: 0, // azure sas link
          policy_document_file: policyHolderData?.policy_document_file_path,
          policy_document_name: policyHolderData?.policy_document_name,
          policy_document_file_blob: null,
        },
        occupation_document: {
          policy_document_type: "",
          policy_document_file: "",
          policy_document_name: "",
        },
        selectDoc: _selectOdct,
      };
      reset({ ...prepareReset });
      // #endregion
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ขออภัย เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้อง ${error}`,
      });
    } finally {
      setLoading(false);
    }
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onSubmit = async (data, event) => {
    setLoading(true);

    try {
      let _cal_temp_code = null;

      if (
        data?.is_CalculateFromPremiumToCoverage ||
        data?.is_CalculateFromCoverageToPremium
      ) {
        _cal_temp_code =
          data?.is_CalculateFromPremiumToCoverage &&
          data?.is_CalculateFromCoverageToPremium
            ? "03"
            : data?.is_CalculateFromCoverageToPremium
            ? "01"
            : "02";
      }

      debugger;
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
          is_tax: watch("commonSetting.is_tax") || false,
          is_factor: watch("commonSetting.is_factor") || false,
          ordinary_class: watch("commonSetting.ordinary_class.id") || null,
          cal_temp_code: _cal_temp_code,
          is_send_sms: watch("commonSetting.is_send_sms") || false,
          is_send_mail: watch("commonSetting.is_send_mail") || false,
          document_id: watch("selectDoc.id"),
          quo_document_id: watch("document.0.quo_document_id") || null,
          remark_marketing_name:
            watch("commonSetting.remark_marketing_name") || "",
          item_name: watch("commonSetting.item_name") || "",
          is_download: watch("commonSetting.is_download") || false,
          c_package: watch("commonSetting.c_package") || "",
          is_active: watch("commonSetting.is_active") || true,
          create_by: activator,
          create_date: watch("commonSetting.create_date") || new Date(),
          update_by: activator,
          update_date: watch("commonSetting.update_date") || new Date(),
        },
      };
      const document_id = watch("selectDoc.id");
      const doc1 = (watch("document_1") || []).filter(
        (item) => (item.isNew && item.is_active) || !item.isNew
      );
      const doc2 = (watch("document_2") || []).filter(
        (item) => (item.isNew && item.is_active) || !item.isNew
      );
      let docs =
        [...doc1, ...doc2].map((item, index) => ({
          detail_id: null,
          document_id: document_id,
          quo_document_id: null,
          product_plan_id: product_plan_id,
          title: item.title,
          create_by: activator,
          create_date: item.create_date,
          update_by: activator,
          update_date: item.update_date,
          is_active: item.is_active,
          description: item.description,
          seq: index + 1,
          detail_type: item.detail_type,
        })) || [];

      if (docs.length === 0) {
        docs = [
          {
            product_plan_id: data?.commonSetting.product_plan_id,
            document_id: data?.selectDoc?.document_id,
          },
        ];
      }
      const Documentpayload = {
        document: docs,
      };

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

      debugger;
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
      let dataPolicyholderDocument = null;
      let policy_fileType = watch("beneficiary_document.policy_document_type");
      let policy_document = watch("beneficiary_document.policy_document_file");
      debugger;
      if (policy_document && policy_fileType === 1) {
        const resultDocument = await responseDocument.json();
        dataPolicyholderDocument = {
          policy_document_id: null,
          product_plan_id: product_plan_id,
          is_active: true,
          create_date: new Date(),
          create_by: activator,
          update_date: new Date(),
          update_by: activator,
          policy_document_type: "1",
          policy_document_name: watch(
            "beneficiary_document.policy_document_name"
          ),
          policy_document_file: watch(
            "beneficiary_document.policy_document_file"
          ),
        };

        const policyholderBeneficiaryDocument = await fetch(
          "/api/products?action=AddOrUpdatePolicyholderDocuments",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataPolicyholderDocument),
          }
        );
        debugger;
      }

      if (type === "0") {
        let policy_document_occupation = watch(
          "occupation_document.policy_document_file"
        );
        if (policy_document_occupation) {
          dataPolicyholderDocument = {
            policy_document_id: null,
            product_plan_id: product_plan_id,
            policy_document_name: null,
            policy_document_file_path: null,
            is_active: true,
            create_date: new Date(),
            create_by: activator,
            update_date: new Date(),
            update_by: activator,
            policy_document_type: "2",
            policy_document_name: watch(
              "occupation_document.policy_document_name"
            ),
            policy_document_file: watch(
              "occupation_document.policy_document_file"
            ),
          };
          const policyholderOccupationDocument = await fetch(
            "/api/products?action=AddOrUpdatePolicyholderDocuments",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dataPolicyholderDocument),
            }
          );
        }
      }

      handleNotiification("บันทึกข้อมูลสำเร็จ", () => {
        router.push(`/products/`);
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

  const onError = async (error, event) => {
    if (
      error?.commonSetting?.title ||
      error?.commonSetting?.remark_marketing_name
    ) {
      setValue(0);
    } else if (error) {
      setValue(1);
    }
  };

  useEffect(() => {
    handleFetchProduct();
  }, []);

  if (!validFeature) {
    return <AppLoadData loadingState={3} />;
  }

  if (loading) {
    return <AppLoadData loadingState={0} />;
  }

  return (
    <Grid>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Card>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label={"ข้อมูลทั่วไป"} value={0} />
            <Tab label={"ตั้งค่าทั่วไป"} value={1} />
          </Tabs>
          <Divider />
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                {value === 0 && (
                  <PageCommonData
                    type={type}
                    i_package={i_package}
                    productId={productId}
                    formMethods={{ ...formMethods }}
                  />
                )}
                {value === 1 && (
                  <PageCommonSetting
                    mode={mode}
                    type={type}
                    formMethods={{ ...formMethods }}
                    handleFetchTemplate={handleFetchTemplate}
                  />
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Grid container mt={2}>
          <Grid item xs>
            <Card>
              <Grid container spacing={2} justifyContent={"end"} pr={4}>
                <Grid item xs="auto" my={3}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleBack}
                  >
                    ยกเลิก / ออก
                  </Button>
                </Grid>
                {mode !== "VIEW" && (
                  <>
                    <Grid item xs="auto" my={3}>
                      <Button
                        disabled={!isDirty}
                        variant="outlined"
                        color="primary"
                        onClick={handleResetForm}
                      >
                        ล้างข้อมูล
                      </Button>
                    </Grid>
                    <Grid item xs="auto" my={3}>
                      {/* disabled เมื่อ form ไม่ dirty และ จำนวนบรรทัดที่สามารถเพิ่มได้ติดลบ */}
                      <Button
                        disabled={!isDirty || remainingLine < 0}
                        variant="contained"
                        type="submit"
                        color="primary"
                      >
                        บันทึก
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default PageProductsDetail;
