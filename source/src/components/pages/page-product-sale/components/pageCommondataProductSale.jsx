"use client";

import { useState } from "react";
import { AppCard, AppLoadData, AppCardDataGrid } from "@components";
import {
  Grid,
  Card,
  Button,
  useTheme,
  TextField,
  Typography,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import {
  useAppForm,
  useAppRouter,
  useAppDialog,
  useAppScroll,
  useAppSelector,
  useAppFeatureCheck,
  useAppSnackbar,
} from "@hooks";
import { PageRejectComponent } from ".";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { addHours } from "date-fns";
import { Yup } from "@utilities";

const PageCommonDataProductSale = ({
  mode,
  type,
  channel,
  productId,
  saleChannelId,
  productCondition,
}) => {
  const theme = useTheme();
  const router = useAppRouter();
  const { handleScrollTo } = useAppScroll();
  const { handleNotification } = useAppDialog();
  const { handleSnackAlert } = useAppSnackbar();
  const [loading, setLoading] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const { brokerId, activator } = useAppSelector((state) => state.global);
  const { validFeature: grantEdit } = useAppFeatureCheck([
    "direct.product.general.write",
    "broker.product.general.write",
  ]);
  const { validFeature: grantRequest } = useAppFeatureCheck([
    "direct.product.general.request",
    "broker.product.general.request",
  ]);
  const { validFeature: grantApprove } = useAppFeatureCheck([
    "direct.product.general.approve",
    "broker.product.general.approve",
  ]);

  const drop = mode === "DROP";
  const preventInput =
    mode === "VIEW" || mode === "DROP" || mode === "GENERAL_APPROVE";
  const productReject = productCondition?.product_status === "5";
  const productEnable = productCondition?.product_status === "3";
  const displayEnable = productCondition?.marketting_status === "3";
  const showProductApprove = productCondition?.product_status === "2";
  const showPreview = false; //ปิดไม่ให้แสดงเลย  //productEnable && displayEnable ;

  const validationSchema = Yup.object().shape({
    conditionData: Yup.object().shape({
      min_age_years: Yup.number()
        .nullable()
        .typeError("จำเป็นต้องระบุข้อมูลนี้")
        .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
        .max(150, "ต้องมีค่าไม่เกิน 150"),
      min_age_months: Yup.number()
        .nullable()
        .typeError("จำเป็นต้องระบุข้อมูลนี้")
        .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
        .max(12, "ต้องมีค่าไม่เกิน 12"),
      min_age_days: Yup.number()
        .nullable()
        .typeError("จำเป็นต้องระบุข้อมูลนี้")
        .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
        .max(31, "ต้องมีค่าไม่เกิน 31"),
      max_age_years: Yup.number()
        .nullable()
        .typeError("จำเป็นต้องระบุข้อมูลนี้")
        .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
        .max(150, "ต้องมีค่าไม่เกิน 150"),
      max_age_months: Yup.number()
        .nullable()
        .typeError("จำเป็นต้องระบุข้อมูลนี้")
        .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
        .max(12, "ต้องมีค่าไม่เกิน 12"),
      max_age_days: Yup.number()
        .nullable()
        .typeError("จำเป็นต้องระบุข้อมูลนี้")
        .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
        .max(31, "ต้องมีค่าไม่เกิน 31"),
      min_coverage_amount: Yup.number()
        .nullable()
        .typeError("จำเป็นต้องระบุข้อมูลนี้")
        .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
        .test(
          "min-less-than-max",
          "คุ้มครองต่ำสุดต้องไม่เกินคุ้มครองสูงสุด",
          function (value) {
            const { max_coverage_amount } = this.parent;
            if (value === undefined || max_coverage_amount === undefined) {
              return true;
            }
            return value <= max_coverage_amount;
          }
        ),
      max_coverage_amount: Yup.number()
        .nullable()
        .typeError("จำเป็นต้องระบุข้อมูลนี้")
        .min(0, "ต้องมีค่าไม่น้อยกว่า 0")
        .test(
          "max-greater-than-min",
          "คุ้มครองสูงสุดต้องมากกว่าหรือเท่ากับคุ้มครองต่ำสุด",
          function (value) {
            const { min_coverage_amount } = this.parent;
            if (value === undefined || min_coverage_amount === undefined) {
              return true;
            }
            return value >= min_coverage_amount;
          }
        ),
    }),
    saleRange: Yup.array().of(Yup.mixed()),
    saleRangeTemp: Yup.array().of(Yup.mixed()),
    salePaidType: Yup.array().of(Yup.mixed()),
    salePaidTypeTemp: Yup.array().of(Yup.mixed()),
    salePaidCategory: Yup.array().of(Yup.mixed()),
    salePaidCategoryTemp: Yup.array().of(Yup.mixed()),
    salePrepayment: Yup.array().of(Yup.mixed()),
    salePrepaymentTemp: Yup.array().of(Yup.mixed()),
    saleTemplate: Yup.array().of(Yup.mixed()),
    saleTemplateTemp: Yup.array().of(Yup.mixed()),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      conditionData: { ...productCondition },
      saleRange: [],
      saleRangeTemp: [],
      salePaidType: [],
      salePaidTypeTemp: [],
      salePaidCategory: [],
      salePaidCategoryTemp: [],
      salePrepayment: [],
      salePrepaymentTemp: [],
      saleTemplate: [],
      saleTemplateTemp: [],
    },
  });

  const {
    watch,
    reset,
    control,
    formState: { errors, isDirty },
  } = formMethods;

  const handleResetForm = () => {
    handleNotification(
      "คุณต้องการล้างค่าการเปลี่ยนแปลงหรือไม่ ?",
      () => {
        reset();
      },
      null,
      "question"
    );
  };

  const handleSave = async (silent = false) => {
    setLoading(true);

    try {
      const currentValue = watch();

      // #region เงื่อนไขการขาย
      let conditionPayload = {
        is_active: true,
        product_status: silent ? "2" : "1",
        update_date: new Date(),
        update_by: activator,
        product_plan_id: productId,
        channel_id: null,
        broker_id: brokerId,
        product_sale_channel_id: saleChannelId,
        min_coverage_amount: watch("conditionData.min_coverage_amount"),
        max_coverage_amount: watch("conditionData.max_coverage_amount"),
        min_age_years: watch("conditionData.min_age_years"),
        min_age_months: watch("conditionData.min_age_months"),
        min_age_days: watch("conditionData.min_age_days"),
        max_age_years: watch("conditionData.max_age_years"),
        max_age_months: watch("conditionData.max_age_months"),
        max_age_days: watch("conditionData.max_age_days"),
        product_sale_group_type: type,
      };
      await fetch(`/api/direct?action=AddOrUpdateProductPlanByChannel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conditionPayload),
      });
      // #endregion

      // #region ระยะเวลาในการขาย
      const runSalePeriods = async () => {
        const promises = currentValue?.saleRangeTemp.map(async (item) => {
          const payload = {
            ...item,
            product_sale_channel_id: saleChannelId,
            sale_period_id: item?.is_new ? null : item?.sale_period_id,
            is_active: item?.active_status === 3 ? false : null,
            sale_start_date: addHours(item?.sale_start_date, 7),
            sale_end_date: addHours(item?.sale_end_date, 7),
          };

          await fetch(`/api/direct?action=AddOrUpdateProductSalePeriod`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        });
        await Promise.all(promises);
      };
      runSalePeriods();
      // #endregion

      // #region รูปแบบการชำระเงิน
      const runSalePaidType = async () => {
        const promises = currentValue?.salePaidTypeTemp.map(async (item) => {
          const payload = {
            ...item,
            product_sale_channel_id: saleChannelId,
            product_payment_mode_id: item?.is_new
              ? null
              : item?.product_payment_mode_id,
            is_active: item?.active_status === 3 ? false : null,
          };
          await fetch(`/api/direct?action=AddOrUpdateProductPaymentMode`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        });
        await Promise.all(promises);
      };
      runSalePaidType();
      // #endregion

      // #region ประเภทการชำระเงิน
      const runSalePaymentCategory = async () => {
        const promises = currentValue?.salePaidCategoryTemp.map(
          async (item) => {
            const payload = {
              ...item,
              product_sale_channel_id: saleChannelId,
              product_payment_id: item?.is_new
                ? null
                : item?.product_payment_id,
              is_active: item?.active_status === 3 ? false : null,
            };
            await fetch(`/api/direct?action=AddOrUpdateProductPaymentMethods`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          }
        );
        await Promise.all(promises);
      };
      runSalePaymentCategory();
      // #endregion

      // #region รูปแบบการชำระล่วงหน้า
      const runSalePrepayment = async () => {
        const promises = currentValue?.salePrepaymentTemp.map(async (item) => {
          const payload = {
            ...item,
            product_sale_channel_id: saleChannelId,
            installment_id: item?.is_new ? null : item?.installment_id,
            is_active: item?.active_status === 3 ? false : null,
          };

          await fetch(`/api/direct?action=AddOrUpdateInstallmentType`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        });
        await Promise.all(promises);
      };
      runSalePrepayment();
      // #endregion

      // #region เทมเพลตใบคำขอ
      const runSaleTemplate = async () => {
        const promises = currentValue?.saleTemplateTemp.map(async (item) => {
          const payload = {
            ...item,
            product_sale_channel_id: saleChannelId,
            product_app_temp_id: item?.is_new
              ? null
              : item?.product_app_temp_id,
            is_active: item?.active_status === 3 ? false : null,
          };
          await fetch(
            `/api/direct?action=AddOrUpdateProductApplicationTemplate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
        });
        await Promise.all(promises);
      };
      runSaleTemplate();
      // #endregion

      if (!silent) {
        handleNotification(
          "บันทึกข้อมูลสำเร็จ",
          () => {
            window.location.reload();
            setTimeout(() => {
              handleScrollTo();
            }, 1000);
          },
          null,
          "info",
          "ตกลง"
        );
      } else {
        return true;
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด " + error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    let pageUrl = channel === "606" ? "direct" : `brokers/${channel}`;
    router.push(`/${pageUrl}`);
    setTimeout(() => {
      handleScrollTo();
    }, 1000);
  };

  const handleRequestApprove = async () => {
    setLoading(true);

    try {
      // อัพเดตข้อมูลพร้อมสถานะให้เป็นรออนุมัติ
      const silentSave = await handleSave(true);
      if (!silentSave) {
        throw new Error();
      }

      // ยิงเพื่อแจ้งขออนุมัติประเถทข้อมูลทั้วไป
      const payload = {
        type: 1,
        product_sale_channel_id: saleChannelId,
        product_plan_id: productId,
        mode: "GENERAL_APPROVE",
        template_code: "01",
        channel: channel,
        broker_id: brokerId,
      };
      const requestForApproveResponse = await fetch(
        `/api/direct?action=ProductRecordApprove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (requestForApproveResponse.status !== 200) {
        throw new Error();
      }

      handleNotification(
        "ทำการบันทึกและขออนุมัติสำเร็จ",
        () => handleBack(),
        null,
        "info",
        "ตกลง"
      );
    } catch (error) {
      console.error(error);
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาดบางประการ",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);

    try {
      const currentValue = watch();

      // #region อัพเดตสถานะ
      let conditionPayload = {
        is_active: true,
        product_status: "3",
        update_date: new Date(),
        update_by: activator,
        broker_id: brokerId,
        product_plan_id: productId,
        product_sale_channel_id: saleChannelId,
        product_sale_group_type: type,
      };
      const responseApprove = await fetch(
        `/api/direct?action=AddOrUpdateProductPlanByChannel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(conditionPayload),
        }
      );
      if (responseApprove.status !== 200) {
        throw new Error();
      }
      // #endregion

      // #region ระยะเวลาในการขาย
      const runSalePeriods = async () => {
        const promises = currentValue?.saleRange.map(async (item) => {
          const payload = {
            ...item,
            is_active: item?.active_status === "1" ? true : item?.is_active,
          };

          await fetch(`/api/direct?action=AddOrUpdateProductSalePeriod`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        });
        await Promise.all(promises);
      };
      runSalePeriods();
      // #endregion

      // #region รูปแบบการชำระเงิน
      const runSalePaidType = async () => {
        const promises = currentValue?.salePaidType.map(async (item) => {
          const payload = {
            ...item,
            is_active: item?.active_status === "1" ? true : item?.is_active,
          };
          await fetch(`/api/direct?action=AddOrUpdateProductPaymentMode`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        });
        await Promise.all(promises);
      };
      runSalePaidType();
      // #endregion

      // #region ประเภทการชำระเงิน
      const runSalePaymentCategory = async () => {
        const promises = currentValue?.salePaidCategory.map(async (item) => {
          const payload = {
            ...item,
            is_active: item?.active_status === "1" ? true : item?.is_active,
          };
          await fetch(`/api/direct?action=AddOrUpdateProductPaymentMethods`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        });
        await Promise.all(promises);
      };
      runSalePaymentCategory();
      // #endregion

      // #region รูปแบบการชำระล่วงหน้า
      const runSalePrepayment = async () => {
        const promises = currentValue?.salePrepayment.map(async (item) => {
          const payload = {
            ...item,
            is_active: item?.active_status === "1" ? true : item?.is_active,
          };

          await fetch(`/api/direct?action=AddOrUpdateInstallmentType`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        });
        await Promise.all(promises);
      };
      runSalePrepayment();
      // #endregion

      // #region เทมเพลตใบคำขอ
      const runSaleTemplate = async () => {
        const promises = currentValue?.saleTemplate.map(async (item) => {
          const payload = {
            ...item,
            is_active: item?.active_status === "1" ? true : item?.is_active,
          };
          await fetch(
            `/api/direct?action=AddOrUpdateProductApplicationTemplate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
        });
        await Promise.all(promises);
      };
      runSaleTemplate();
      // #endregion

      // #region ส่งอีเมลอนุมัติ
      const payloadEmail = {
        type: 1,
        request_to: productCondition.update_by,
        product_sale_channel_id: saleChannelId,
        product_plan_id: productId,
        mode: "GENERAL_APPROVE",
        template_code: "02",
        channel: channel,
        broker_id: brokerId,
      };
      const responseEmail = await fetch(
        `/api/direct?action=ProductRecordApprove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadEmail),
        }
      );
      if (responseEmail.status !== 200) {
        throw new Error();
      }
      // #endregion

      handleNotification(
        "ทำการบันทึกและขออนุมัติสำเร็จ",
        () => handleBack(),
        null,
        "info",
        "ตกลง"
      );
    } catch (error) {
      console.error(error);
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาดบางประการ",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (reason) => {
    setLoading(true);

    try {
      // #region อัพเดตสถานะ
      let conditionPayload = {
        is_active: true,
        product_status: "5",
        update_date: new Date(),
        update_by: activator,
        broker_id: brokerId,
        product_plan_id: productId,
        product_sale_channel_id: saleChannelId,
        product_sale_group_type: type,
        product_status_message: reason,
      };
      const responseApprove = await fetch(
        `/api/direct?action=AddOrUpdateProductPlanByChannel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(conditionPayload),
        }
      );
      if (responseApprove.status !== 200) {
        throw new Error();
      }
      // #endregion

      // #region ส่งอีเมลอนุมัติ
      const payloadEmail = {
        type: 1,
        request_to: productCondition.update_by,
        product_sale_channel_id: saleChannelId,
        product_plan_id: productId,
        mode: "GENERAL_APPROVE",
        template_code: "03",
        channel: channel,
        broker_id: brokerId,
      };
      const responseEmail = await fetch(
        `/api/direct?action=ProductRecordApprove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadEmail),
        }
      );
      if (responseEmail.status !== 200) {
        throw new Error();
      }
      // #endregion

      handleNotification(
        "ทำการบันทึกสำเร็จ",
        () => handleBack(),
        null,
        "info",
        "ตกลง"
      );
    } catch (error) {
      console.error(error);
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาดบางประการ",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDropProduct = async (reason) => {
    setLoading(true);

    try {
      // #region อัพเดตสถานะ
      let conditionPayload = {
        is_active: false,
        product_status: "4",
        update_date: new Date(),
        update_by: activator,
        broker_id: brokerId,
        product_plan_id: productId,
        product_sale_channel_id: saleChannelId,
        product_sale_group_type: type,
      };
      const responseApprove = await fetch(
        `/api/direct?action=AddOrUpdateProductPlanByChannel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(conditionPayload),
        }
      );
      if (responseApprove.status !== 200) {
        throw new Error();
      }
      // #endregion

      // #region ส่งอีเมลอนุมัติ
      const payloadEmail = {
        type: 1,
        request_to: productCondition.update_by,
        product_sale_channel_id: saleChannelId,
        product_plan_id: productId,
        mode: "GENERAL_APPROVE",
        template_code: "04",
        channel: channel,
        broker_id: brokerId,
      };
      const responseEmail = await fetch(
        `/api/direct?action=ProductRecordApprove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadEmail),
        }
      );
      if (responseEmail.status !== 200) {
        throw new Error();
      }
      // #endregion

      handleNotification(
        "ทำการยกเลิกใช้งานสำเร็จ",
        () => handleBack(),
        null,
        "info",
        "ตกลง"
      );
    } catch (error) {
      console.error(error);
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาดบางประการ",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AppLoadData loadingState={0} />;
  }

  return (
    <Grid container>
      {productReject && (
        <Grid item xs={12}>
          <AppCard
            cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
            title={"เหตุผลการปฏิเสธคำขออนุมัติ"}
          >
            <TextField
              type="number"
              size="small"
              fullWidth
              multiline
              rows={5}
              disabled
              inputProps={{ min: 0 }}
              InputProps={{
                readOnly: true,
              }}
              value={watch("conditionData.product_status_message")}
            />
          </AppCard>
        </Grid>
      )}
      {/* เงื่อนไขการขาย */}
      <Grid item xs={12} mt={2}>
        <AppCard
          cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          title={"เงื่อนไขการขาย (default ค่าจาก core แต่จะไม่ได้ Sync)"}
        >
          <Grid container spacing={2}>
            <Grid
              item
              xs={2}
              sx={{
                border: "0px solid red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: "600" }}>อายุต่ำสุด</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                border: "0px solid red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="conditionData.min_age_years"
                    rules={{ min: 0 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        fullWidth
                        disabled={preventInput}
                        inputProps={{ min: 0 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">ปี</InputAdornment>
                          ),
                        }}
                        error={Boolean(errors?.conditionData?.min_age_years)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormHelperText
                    error={Boolean(errors?.conditionData?.min_age_years)}
                  >
                    {errors?.conditionData?.min_age_years?.message}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                border: "0px solid red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="conditionData.min_age_months"
                    rules={{ min: 0 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        fullWidth
                        disabled={preventInput}
                        inputProps={{ min: 0 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              เดือน
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(errors?.conditionData?.min_age_months)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormHelperText
                    error={Boolean(errors?.conditionData?.min_age_months)}
                  >
                    {errors?.conditionData?.min_age_months?.message}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                border: "0px solid red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="conditionData.min_age_days"
                    rules={{ min: 0 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        fullWidth
                        disabled={preventInput}
                        inputProps={{ min: 0 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">วัน</InputAdornment>
                          ),
                        }}
                        error={Boolean(errors?.conditionData?.min_age_days)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormHelperText
                    error={Boolean(errors?.conditionData?.min_age_days)}
                  >
                    {errors?.conditionData?.min_age_days?.message}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container mt={2} spacing={2}>
            <Grid
              item
              xs={2}
              sx={{
                border: "0px solid red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: "600" }}>อายุสูงสุด</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                border: "0px solid red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="conditionData.max_age_years"
                    rules={{ min: 0 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        fullWidth
                        disabled={preventInput}
                        inputProps={{ min: 0 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">ปี</InputAdornment>
                          ),
                        }}
                        error={Boolean(errors?.conditionData?.max_age_years)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormHelperText
                    error={Boolean(errors?.conditionData?.max_age_years)}
                  >
                    {errors?.conditionData?.max_age_years?.message}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                border: "0px solid red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="conditionData.max_age_months"
                    rules={{ min: 0 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        fullWidth
                        disabled={preventInput}
                        inputProps={{ min: 0 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              เดือน
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(errors?.conditionData?.max_age_months)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormHelperText
                    error={Boolean(errors?.conditionData?.max_age_months)}
                  >
                    {errors?.conditionData?.max_age_months?.message}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                border: "0px solid red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="conditionData.max_age_days"
                    rules={{ min: 0 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        fullWidth
                        disabled={preventInput}
                        inputProps={{ min: 0 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">วัน</InputAdornment>
                          ),
                        }}
                        error={Boolean(errors?.conditionData?.max_age_days)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormHelperText
                    error={Boolean(errors?.conditionData?.max_age_days)}
                  >
                    {errors?.conditionData?.max_age_days?.message}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Grid
              item
              xs={2}
              sx={{
                border: "0px solid red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: "600" }}>คุ้มครองต่ำสุด</Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                border: "0px solid red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="conditionData.min_coverage_amount"
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                    }) => (
                      <NumericFormat
                        value={value ?? ""}
                        onValueChange={(values) => {
                          onChange(values.floatValue ?? null);
                        }}
                        thousandSeparator
                        customInput={TextField}
                        fullWidth
                        margin="dense"
                        size="small"
                        name={name}
                        inputRef={ref}
                        onBlur={onBlur}
                        disabled={preventInput}
                        error={errors?.conditionData?.min_coverage_amount}
                        InputLabelProps={value ? { shrink: true } : undefined}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">บาท</InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormHelperText
                    error={errors?.conditionData?.min_coverage_amount}
                  >
                    {errors?.conditionData?.min_coverage_amount?.message}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Grid
              item
              xs={2}
              sx={{
                border: "0px solid red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: "600" }}>คุ้มครองสูงสุด</Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                border: "0px solid red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="conditionData.max_coverage_amount"
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                    }) => (
                      <NumericFormat
                        value={value ?? ""}
                        onValueChange={(values) => {
                          onChange(values.floatValue ?? null);
                        }}
                        thousandSeparator
                        customInput={TextField}
                        fullWidth
                        margin="dense"
                        size="small"
                        name={name}
                        inputRef={ref}
                        onBlur={onBlur}
                        disabled={preventInput}
                        error={errors?.conditionData?.max_coverage_amount}
                        InputLabelProps={value ? { shrink: true } : undefined}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">บาท</InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormHelperText
                    error={errors?.conditionData?.max_coverage_amount}
                  >
                    {errors?.conditionData?.max_coverage_amount?.message}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AppCard>
      </Grid>

      {/* ระยะเวลาในการขาย */}
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={1}
          preventInput={preventInput}
          productId={saleChannelId}
          formMethods={{ ...formMethods }}
        />
      </Grid>

      {/* รูปแบบการชำระเงิน */}
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={2}
          preventInput={preventInput}
          productId={saleChannelId}
          formMethods={{ ...formMethods }}
        />
      </Grid>

      {/* ประเภทการชำระเงิน */}
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={3}
          preventInput={preventInput}
          productId={saleChannelId}
          formMethods={{ ...formMethods }}
        />
      </Grid>

      {/* รูปแบบการชำระล่วงหน้า */}
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={4}
          preventInput={preventInput}
          productId={saleChannelId}
          formMethods={{ ...formMethods }}
        />
      </Grid>

      {/* เทมเพลตใบคำขอ */}
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={5}
          preventInput={preventInput}
          productId={saleChannelId}
          formMethods={{ ...formMethods }}
        />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <PageRejectComponent
            open={openRejectModal}
            setOpen={setOpenRejectModal}
            handleReject={handleReject}
          />
          <Grid container spacing={2} justifyContent={"end"}>
            <Grid item xs={11.3}>
              <Grid container justifyContent={"end"} spacing={2}>
                <Grid item xs={12} md="auto">
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      handleNotification(
                        "คุณต้องการยกเลิกการเปลี่ยนแปลงหรือไม่ ?",
                        () => handleBack(),
                        null,
                        "question"
                      );
                    }}
                  >
                    ยกเลิก / ออก
                  </Button>
                </Grid>
                {drop && (
                  <Grid item xs={12} md="auto">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        handleNotification(
                          "คุณต้องการยกเลิกการใช้งานหรือไม่ ?",
                          () => handleDropProduct(),
                          null,
                          "question"
                        );
                      }}
                    >
                      ยกเลิกการใช้งาน
                    </Button>
                  </Grid>
                )}
                {grantRequest &&
                  !showProductApprove &&
                  !productEnable &&
                  !drop && (
                    <Grid item xs={12} md="auto">
                      <Button
                        color="info"
                        variant="contained"
                        sx={{
                          color: theme.palette.common.white,
                        }}
                        onClick={() =>
                          handleNotification(
                            "ท่านต้องการบันทึกข้อมูลและส่งคำร้องขออนุมัติหรือไม่ ?",
                            () => handleRequestApprove(),
                            null,
                            "question"
                          )
                        }
                      >
                        ขออนุมัติ
                      </Button>
                    </Grid>
                  )}
                {grantApprove && showProductApprove && (
                  <>
                    <Grid item xs={12} md="auto">
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                          handleNotification(
                            "ท่านต้องการยืนยันการไม่อนุมัติข้อมูลผลิตภัณฑ์นี้หรือไม่ ?",
                            () => setOpenRejectModal(true),
                            null,
                            "question"
                          );
                        }}
                      >
                        ไม่อนุมัติ
                      </Button>
                    </Grid>
                    <Grid item xs={12} md="auto">
                      <Button
                        color="success"
                        variant="contained"
                        onClick={() => {
                          handleNotification(
                            "ท่านต้องการยืนยันการอนุมัติข้อมูลผลิตภัณฑ์นี้หรือไม่ ?",
                            () => handleApprove(),
                            null,
                            "question"
                          );
                        }}
                      >
                        อนุมัติ
                      </Button>
                    </Grid>
                  </>
                )}
                {grantEdit && !showProductApprove && !preventInput && (
                  <>
                    <Grid item xs={12} md="auto">
                      <Button
                        disabled={!isDirty}
                        variant="outlined"
                        onClick={handleResetForm}
                      >
                        ล้างค่า
                      </Button>
                    </Grid>
                    <Grid item xs={12} md="auto">
                      <Button
                        disabled={!isDirty}
                        color="primary"
                        variant="contained"
                        onClick={() => handleSave(false)}
                      >
                        บันทึกแบบร่าง
                      </Button>
                    </Grid>
                  </>
                )}
                {showPreview && (
                  <Grid item xs={12} md="auto">
                    <Button color="primary" variant="contained">
                      ดูตัวอย่าง
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};
export default PageCommonDataProductSale;
