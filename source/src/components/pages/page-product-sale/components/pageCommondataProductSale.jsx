import { AppCard, AppCardDataGrid, AppNumericFormat } from "@/components";

import {
  Button,
  Card,
  CircularProgress,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@hooks";
import { useState, useEffect } from "react";
import { useAppSnackbar, useAppRouter, useAppForm } from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";
import { setDialog } from "@stores/slices";
import { Yup } from "@utilities";
import { APPLICATION_DEFAULT } from "@constants";
import { format, addYears, addDays, parseISO } from "date-fns";

const PageCommonDataProductSale = ({
  productId,
  type,
  saleChannelId,
  productCondition,
}) => {
  const router = useAppRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { dialog } = useAppSelector((state) => state.global);
  const [ConditionData, setConditionData] = useState({});
  const brokerId = useAppSelector((state) => state.global.brokerId);
  const ValidationSchema = Yup.object().shape({
    saleRange: Yup.object().shape({
      searchParams: Yup.object().shape({}),
      rows: Yup.array()
        .of(
          Yup.object().shape({
            id: Yup.mixed().nullable(),
            status: Yup.mixed().nullable(),
            statusText: Yup.string().nullable(),
            StartDate: Yup.date().required("กรุณาระบุวันที่เริ่มต้น"),
            EndDate: Yup.date()
              .nullable()
              .transform((value) => {
                if (
                  !value ||
                  value === "undefined" ||
                  value === undefined ||
                  value === ""
                )
                  return null;
                try {
                  return new Date(value);
                } catch (error) {
                  return null;
                }
              })
              .when("StartDate", (StartDate, schema) => {
                if (
                  !StartDate ||
                  StartDate === "undefined" ||
                  StartDate === undefined
                )
                  return schema;
                try {
                  const startDate = new Date(StartDate);
                  if (isNaN(startDate.getTime())) return schema;
                  return schema.min(
                    startDate,
                    "วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น"
                  );
                } catch (error) {
                  return schema;
                }
              }),
            createBy: Yup.string().nullable(),
            createDate: Yup.string().nullable(),
            updateBy: Yup.string().nullable(),
            updateDate: Yup.string().nullable(),
          })
        )
        .atLeastOneObject("ต้องระบุอย่างน้อย 1 รายการ"),
      baseRows: Yup.object().shape({
        id: Yup.mixed().nullable(),
        status: Yup.mixed().nullable(),
        statusText: Yup.string().nullable(),
        StartDate: Yup.date().required("กรุณาระบุวันที่เริ่มต้น"),
        EndDate: Yup.date()
          .nullable()
          .transform((value) => {
            if (
              !value ||
              value === "undefined" ||
              value === undefined ||
              value === ""
            )
              return null;
            try {
              return new Date(value);
            } catch (error) {
              return null;
            }
          })
          .when("StartDate", (StartDate, schema) => {
            if (
              !StartDate ||
              StartDate === "undefined" ||
              StartDate === undefined
            )
              return schema;
            try {
              const startDate = new Date(StartDate);
              if (isNaN(startDate.getTime())) return schema;
              return schema.min(
                startDate,
                "วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น"
              );
            } catch (error) {
              return schema;
            }
          }),
        createBy: Yup.string().nullable(),
        createDate: Yup.string().nullable(),
        updateBy: Yup.string().nullable(),
        updateDate: Yup.string().nullable(),
      }),
    }),
    salePaidType: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.mixed().nullable(),
          paidType: Yup.string().nullable(),
          paymentMode: Yup.string().nullable(),
          status: Yup.mixed().nullable(),
          statusText: Yup.string().nullable(),
          StartDate: Yup.date().nullable(),
          EndDate: Yup.date().nullable(),
          createBy: Yup.string().nullable(),
          createDate: Yup.string().nullable(),
          updateBy: Yup.string().nullable(),
          updateDate: Yup.string().nullable(),
        })
      )
      .atLeastOneObject("ต้องระบุอย่างน้อย 1 รายการ"),
    salePaidCategory: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.mixed().nullable(),
          paidCategory: Yup.string().nullable(),
          status: Yup.mixed().nullable(),
          statusText: Yup.string().nullable(),
          min_coverage_amount: Yup.mixed().nullable(),
          max_coverage_amount: Yup.mixed().nullable(),
          min_age_years: Yup.number().nullable().min(0),
          min_age_months: Yup.number().nullable().min(0).max(11),
          min_age_days: Yup.number().nullable().min(0).max(31),
          max_age_years: Yup.number().nullable().min(0),
          max_age_months: Yup.number().nullable().min(0).max(11),
          max_age_days: Yup.number().nullable().min(0).max(31),
          StartDate: Yup.date().nullable(),
          EndDate: Yup.date().nullable(),
          createBy: Yup.string().nullable(),
          createDate: Yup.string().nullable(),
          updateBy: Yup.string().nullable(),
          updateDate: Yup.string().nullable(),
        })
      )
      .atLeastOneObject("ต้องระบุอย่างน้อย 1 รายการ"),
    salePrepayment: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.mixed().nullable(),
          PrepaymentForm: Yup.string().nullable(),
          NumberOfInstallments: Yup.mixed().nullable(),
          status: Yup.mixed().nullable(),
          statusText: Yup.string().nullable(),
          StartDate: Yup.date().nullable(),
          EndDate: Yup.date().nullable(),
          createBy: Yup.string().nullable(),
          createDate: Yup.string().nullable(),
          updateBy: Yup.string().nullable(),
          updateDate: Yup.string().nullable(),
        })
      )
      .atLeastOneObject("ต้องระบุอย่างน้อย 1 รายการ"),
    saleTemplate: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.mixed().nullable(),
          TemplateName: Yup.string().nullable(),
          status: Yup.mixed().nullable(),
          statusText: Yup.string().nullable(),
          minimumCoverage: Yup.mixed().nullable,
          maximumCoverage: Yup.mixed().nullable(),
          StartDate: Yup.date().nullable(),
          EndDate: Yup.date().nullable(),
          createBy: Yup.string().nullable(),
          createDate: Yup.string().nullable(),
          updateBy: Yup.string().nullable(),
          updateDate: Yup.string().nullable(),
        })
      )
      .atLeastOneObject("ต้องระบุอย่างน้อย 1 รายการ"),
  });
  const Groupmock = [
    {
      name: "Super Saving (Package) 5 ปี",
      Insure: [
        { Insure: 1, isSale: false, Insure: 500000 },
        { Insure: 2, isSale: false, Insure: 1000000 },
        { Insure: 3, isSale: false, Insure: 1500000 },
        { Insure: 4, isSale: false, Insure: 2000000 },
      ],
    },
    {
      name: "Super Saving (Package) 10 ปี",
      Insure: [
        { Insure: 1, isSale: false, Insure: 500000 },
        { Insure: 2, isSale: false, Insure: 1000000 },
        { Insure: 3, isSale: false, Insure: 1500000 },
        { Insure: 4, isSale: false, Insure: 2000000 },
      ],
    },
  ];

  const handleMinCoverage = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`ConditionData.min_coverage_amount`, value, {
      shouldValidate: true,
    });
  };

  const handleMaxCoverage = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`ConditionData.max_coverage_amount`, value, {
      shouldValidate: true,
    });
  };

  const handleMinYear = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`ConditionData.min_age_years`, value, {
      shouldValidate: true,
    });
  };

  const handleMinMonth = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`ConditionData.min_age_months`, value, {
      shouldValidate: true,
    });
  };

  const handleMinDay = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`ConditionData.min_age_days`, value, {
      shouldValidate: true,
    });
  };

  const handleMaxYear = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`ConditionData.max_age_years`, value, {
      shouldValidate: true,
    });
  };

  const handleMaxMonth = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`ConditionData.max_age_months`, value, {
      shouldValidate: true,
    });
  };

  const handleMaxDay = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`ConditionData.max_age_days`, value, {
      shouldValidate: true,
    });
  };

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(ValidationSchema),
    defaultValues: {
      ConditionData: {
        i_plan: "20-01-02",
        title: "SMART SAVING 10/2",
        promotion: null,
        min_age_years: 0,
        min_age_months: 0,
        min_age_days: 0,
        max_age_years: 0,
        max_age_months: 0,
        max_age_days: 0,
        min_coverage_amount: 0,
        max_coverage_amount: 0,
      },
      saleRange: {
        searchParams: {
          status: null,
          name: "",
          fromStartDate: new Date(),
          toStartDate: new Date(),
          fromEndDate: new Date(),
          toEndDate: new Date(),
          fromCreateDate: new Date(),
          toCreateDate: new Date(),
          fromUpdateDate: new Date(),
          toUpdateDate: new Date(),
        },
        pagination: {
          totalRows: 100,
          pageNo: APPLICATION_DEFAULT.dataGrid.pageNumber,
          pageSize: APPLICATION_DEFAULT.dataGrid.pageSize,
        },
        rows: [
          {
            id: 1,
            status: null,
            statusText: null,
            sale_start_date: format(new Date(), "yyyy-MM-dd"),
            sale_end_date: format(new Date(), "yyyy-MM-dd"),
            create_by: null,
            create_date: format(new Date(), "yyyy-MM-dd"),
            update_by: null,
            update_date: format(new Date(), "yyyy-MM-dd"),
          },
        ],
        baseRows: {
          id: crypto.randomUUID(),
          status: 2,
          statusText: "รายการใหม่",
          sale_start_date: format(new Date(), "yyyy-MM-dd"),
          sale_end_date: format(new Date(), "yyyy-MM-dd"),
          create_by: "admin",
          create_date: format(new Date(), "yyyy-MM-dd"),
          update_by: "admin",
          update_date: format(new Date(), "yyyy-MM-dd"),
        },
      },
      salePaidType: {
        searchParams: {
          status: null,
          name: "",
          fromCreateDate: format(new Date(), "yyyy-MM-dd"),
          toCreateDate: format(new Date(), "yyyy-MM-dd"),
          fromUpdateDate: format(new Date(), "yyyy-MM-dd"),
          toUpdateDate: format(new Date(), "yyyy-MM-dd"),
        },
        pagination: {
          totalRows: 100,
          pageNo: APPLICATION_DEFAULT.dataGrid.pageNumber,
          pageSize: APPLICATION_DEFAULT.dataGrid.pageSize,
        },
        rows: [
          {
            id: 1,
            paidType: null,
            status: null,
            statusText: null,
            StartDate: format(new Date(), "yyyy-MM-dd"),
            EndDate: format(new Date(), "yyyy-MM-dd"),
            createBy: null,
            createDate: format(new Date(), "yyyy-MM-dd"),
            updateBy: null,
            updateDate: format(new Date(), "yyyy-MM-dd"),
          },
        ],
        baseRows: {
          id: crypto.randomUUID(),
          paidType: null,
          payment_mode_id: null,
          status: 2,
          statusText: "รายการใหม่",
          StartDate: format(new Date(), "yyyy-MM-dd"),
          EndDate: format(new Date(), "yyyy-MM-dd"),
          createBy: "admin",
          createDate: format(new Date(), "yyyy-MM-dd"),
          updateBy: "admin",
          updateDate: format(new Date(), "yyyy-MM-dd"),
        },
      },
      paymentMode: {},

      salePaidCategory: {
        searchParams: {
          status: null,
          name: "",
          minimumCoverage: null,
          MaximumCoverage: null,
          fromCreateDate: format(new Date(), "yyyy-MM-dd"),
          toCreateDate: format(new Date(), "yyyy-MM-dd"),
          fromUpdateDate: format(new Date(), "yyyy-MM-dd"),
          toUpdateDate: format(new Date(), "yyyy-MM-dd"),
        },
        pagination: {
          totalRows: 100,
          pageNo: APPLICATION_DEFAULT.dataGrid.pageNumber,
          pageSize: APPLICATION_DEFAULT.dataGrid.pageSize,
        },
        rows: [
          {
            id: 1,
            payment_id: null,
            payment_code: null,
            payment_name: null,
            status: null,
            statusText: null,
            min_coverage_amount: null,
            max_coverage_amount: null,
            min_age_years: null,
            min_age_months: null,
            min_age_days: null,
            max_age_years: null,
            max_age_months: null,
            max_age_days: null,
            StartDate: format(new Date(), "yyyy-MM-dd"),
            EndDate: format(new Date(), "yyyy-MM-dd"),
            createBy: null,
            createDate: format(new Date(), "yyyy-MM-dd"),
            updateBy: null,
            updateDate: format(new Date(), "yyyy-MM-dd"),
          },
        ],
        baseRows: [
          {
            id: 1,
            payment_id: null,
            payment_code: null,
            payment_name: null,
            status: null,
            statusText: null,
            min_coverage_amount: null,
            max_coverage_amount: null,
            min_age_years: null,
            min_age_months: null,
            min_age_days: null,
            max_age_years: null,
            max_age_months: null,
            max_age_days: null,
            StartDate: format(new Date(), "yyyy-MM-dd"),
            maximumAgeMonth: null,
            maximumAgeDay: null,
            StartDate: format(new Date(), "yyyy-MM-dd"),
            EndDate: format(new Date(), "yyyy-MM-dd"),
            createBy: null,
            createDate: format(new Date(), "yyyy-MM-dd"),
            updateBy: null,
            updateDate: format(new Date(), "yyyy-MM-dd"),
          },
        ],
      },
      paymentChannel: {},
      salePrepayment: {
        searchParams: {
          status: null,
          name: "",
          fromCreateDate: format(new Date(), "yyyy-MM-dd"),
          toCreateDate: format(new Date(), "yyyy-MM-dd"),
          fromUpdateDate: format(new Date(), "yyyy-MM-dd"),
          toUpdateDate: format(new Date(), "yyyy-MM-dd"),
        },
        pagination: {
          totalRows: 100,
          pageNo: APPLICATION_DEFAULT.dataGrid.pageNumber,
          pageSize: APPLICATION_DEFAULT.dataGrid.pageSize,
        },
        rows: [
          {
            id: 1,
            PrepaymentForm: "",
            NumberOfInstallments: "",
            status: null,
            statusText: null,
            StartDate: format(new Date(), "yyyy-MM-dd"),
            EndDate: format(new Date(), "yyyy-MM-dd"),
            createBy: null,
            createDate: format(new Date(), "yyyy-MM-dd"),
            updateBy: null,
            updateDate: format(new Date(), "yyyy-MM-dd"),
          },
        ],
        baseRows: [
          {
            id: crypto.randomUUID(),
            PrepaymentForm: "",
            NumberOfInstallments: "",
            status: 2,
            statusText: "รายการใหม่",
            StartDate: format(new Date(), "yyyy-MM-dd"),
            EndDate: format(new Date(), "yyyy-MM-dd"),
            createBy: "admin",
            createDate: format(new Date(), "yyyy-MM-dd"),
            updateBy: "admin",
          },
        ],
      },
      saleTemplate: {
        searchParams: {
          minimumCoverage: null,
          MaximumCoverage: null,
          fromCreateDate: format(new Date(), "yyyy-MM-dd"),
          toCreateDate: format(new Date(), "yyyy-MM-dd"),
          fromUpdateDate: format(new Date(), "yyyy-MM-dd"),
          toUpdateDate: format(new Date(), "yyyy-MM-dd"),
        },
        pagination: {
          totalRows: 100,
          pageNo: 0,
          pageSize: 10,
        },
        rows: [
          {
            id: 1,
            app_temp_id: "",
            TemplateName: "",
            status: 1,
            statusText: "รายการใหม่",
            min_coverage_amount: 200,
            max_coverage_amount: 2000,
            StartDate: format(new Date(), "yyyy-MM-dd"),
            EndDate: format(new Date(), "yyyy-MM-dd"),
            createBy: "admin",
            createDate: format(new Date(), "yyyy-MM-dd"),
            updateBy: "admin",
            updateDate: format(new Date(), "yyyy-MM-dd"),
          },
        ],
        baseRows: [
          {
            id: crypto.randomUUID(),
            app_temp_id: "",
            TemplateName: "",
            status: 1,
            statusText: "รายการใหม่",
            min_coverage_amount: 200,
            max_coverage_amount: 2000,
            StartDate: format(new Date(), "yyyy-MM-dd"),
            EndDate: format(new Date(), "yyyy-MM-dd"),
            min_age_years: null,
            min_age_months: null,
            min_age_days: null,
            max_age_years: null,
            max_age_months: null,
            max_age_days: null,
            createBy: "admin",
            createDate: format(new Date(), "yyyy-MM-dd"),
            updateBy: "admin",
            updateDate: format(new Date(), "yyyy-MM-dd"),
          },
        ],
      },
      template: {},
    },
  });

  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = formMethods;

  const handleResetForm = () => {
    reset();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let ConditionPayload = {
        is_active: true,
        product_status: "1",
        update_date: new Date(),
        update_by: "admin",
        product_sale_channel_id: saleChannelId,
        product_plan_id: productId,
        channel_id: null,
        broker_id: brokerId,
        min_coverage_amount: watch("ConditionData.min_coverage_amount"),
        max_coverage_amount: watch("ConditionData.max_coverage_amount"),
        min_age_years: watch("ConditionData.min_age_years"),
        min_age_months: watch("ConditionData.min_age_months"),
        min_age_days: watch("ConditionData.min_age_days"),
        max_age_years: watch("ConditionData.max_age_years"),
        max_age_months: watch("ConditionData.max_age_months"),
        max_age_days: watch("ConditionData.max_age_days"),
        product_sale_group_type: type,
      };
      console.log(ConditionPayload);
      const responseCondition = await fetch(
        `/api/direct?action=AddOrUpdateProductPlanByChannel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ConditionPayload),
        }
      );

      let SalePeriodArray = watch("saleRange.rows");

      SalePeriodArray.forEach(async (element) => {
        let SalePeriodPayload = JSON.stringify({
          is_active: true,
          create_by: element.create_by,
          update_by: element.update_by, //to do User authorize
          sale_period_id: element.id,
          product_sale_channel_id: saleChannelId,
          sale_start_date: element.sale_start_date,
          sale_end_date: element.sale_end_date,
        });

        const responseSalePeriod = await fetch(
          `/api/direct?action=AddOrUpdateProductSalePeriod`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: SalePeriodPayload,
          }
        );
        if (!responseSalePeriod.ok) {
          throw new Error(`HTTP error! status: ${responseSalePeriod.status}`);
        }
      });

      let PaymentModeArray = watch("salePaidType.rows");

      PaymentModeArray.forEach(async (element) => {
        let PaymentModePayload = {
          is_active: true,
          update_by: element.updateBy,
          product_payment_mode_id: element.id,
          product_sale_channel_id: saleChannelId,
          payment_mode_id: element.payment_mode_id,
        };

        const responsePaymentMode = await fetch(
          `/api/direct?action=AddOrUpdateProductPaymentMode`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(PaymentModePayload),
          }
        );
        if (!responsePaymentMode.ok) {
          throw new Error(`HTTP error! status: ${responsePaymentMode.status}`);
        }
      });

      let PaymentMethodsArray = watch("salePaidCategory.rows");
      PaymentMethodsArray.forEach(async (element) => {
        let PaymentMethodsPayload = {
          is_active: true,
          update_by: element.updateBy,
          product_payment_id: element.id,
          product_sale_channel_id: saleChannelId,
          payment_id: element.payment_id,
          min_coverage_amount: element.min_coverage_amount,
          max_coverage_amount: element.max_coverage_amount,
          min_age_years: element.min_age_years,
          min_age_months: element.min_age_months,
          min_age_days: element.min_age_days,
          max_age_years: element.max_age_years,
          max_age_months: element.max_age_months,
          max_age_days: element.max_age_days,
        };

        const responsePaymentMethods = await fetch(
          `/api/direct?action=AddOrUpdateProductPaymentMethods`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(PaymentMethodsPayload),
          }
        );
        if (!responsePaymentMethods.ok) {
          throw new Error(
            `HTTP error! status: ${responsePaymentMethods.status}`
          );
        }
      });

      let InstallmentTypeArray = watch("salePrepayment.rows");
      InstallmentTypeArray.forEach(async (element) => {
        let InstallmentTypePayload = {
          installment_id: element.id,
          is_active: true,
          create_by: element.createBy,
          update_by: element.updateBy,
          product_sale_channel_id: saleChannelId,
          installment_description: element.PrepaymentForm,
          num_installments: element.NumberOfInstallments,
        };

        const responseInstallmentType = await fetch(
          `/api/direct?action=AddOrUpdateInstallmentType`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(InstallmentTypePayload),
          }
        );
        if (!responseInstallmentType.ok) {
          throw new Error(
            `HTTP error! status: ${responseInstallmentType.status}`
          );
        }
      });
      let ApplicationTemplateArray = watch("saleTemplate.rows");
      ApplicationTemplateArray.forEach(async (element) => {
        let ApplicationTemplatePayload = {
          is_active: true,
          create_by: element.createBy,
          update_by: element.updateBy,
          product_app_temp_id: element.id,
          product_sale_channel_id: saleChannelId,
          app_temp_id: element.app_temp_id,
          app_temp_name: element.TemplateName,
          min_coverage_amount: element.min_coverage_amount,
          max_coverage_amount: element.max_coverage_amount,
          min_age_years: element.min_age_years,
          min_age_months: element.min_age_months,
          min_age_days: element.min_age_days,
          max_age_years: element.max_age_years,
          max_age_months: element.max_age_months,
          max_age_days: element.max_age_days,
        };
        const responseInstallmentType = await fetch(
          `/api/direct?action=AddOrUpdateProductApplicationTemplate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ApplicationTemplatePayload),
          }
        );
        if (!responseInstallmentType.ok) {
          throw new Error(
            `HTTP error! status: ${responseInstallmentType.status}`
          );
        }
      });
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด " + error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchProductCondition();
  }, []);
  const handleFetchProductCondition = async () => {
    setLoading(true);
    try {
      const resetData = watch();
      reset({ ...resetData, ConditionData: { ...productCondition } });
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด " + error,
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <CircularProgress />;
  }
  return (
    <Grid container>
      <Grid item xs={12} mt={2}>
        <AppCard
          cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          title={"เงื่อนไขการขาย (default ค่าจาก core แต่จะไม่ได้ Sync)"}
        >
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Typography sx={{ fontWeight: "600" }}>อายุต่ำสุด</Typography>
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={watch("ConditionData.min_age_years")}
                fullWidth
                size="small"
                type="number"
                onChange={handleMinYear}
                error={Boolean(errors?.name)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">ปี</InputAdornment>
                  ),
                }}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={watch("ConditionData.min_age_months")}
                fullWidth
                size="small"
                type="number"
                onChange={handleMinMonth}
                error={Boolean(errors?.name)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">เดือน</InputAdornment>
                  ),
                }}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={watch("ConditionData.min_age_days")}
                fullWidth
                size="small"
                type="number"
                onChange={handleMinDay}
                error={Boolean(errors?.name)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">วัน</InputAdornment>
                  ),
                }}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={2}>
              <Typography sx={{ fontWeight: "600" }}>อายุสูงสุด</Typography>
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={watch("ConditionData.max_age_years")}
                fullWidth
                size="small"
                type="number"
                onChange={handleMaxYear}
                error={Boolean(errors?.name)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">ปี</InputAdornment>
                  ),
                }}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={watch("ConditionData.max_age_months")}
                fullWidth
                size="small"
                type="number"
                onChange={handleMaxMonth}
                error={Boolean(errors?.name)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">เดือน</InputAdornment>
                  ),
                }}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={watch("ConditionData.max_age_days")}
                fullWidth
                size="small"
                type="number"
                onChange={handleMaxDay}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">วัน</InputAdornment>
                  ),
                }}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={2}>
              <Typography sx={{ fontWeight: "600" }}>คุ้มครองต่ำสุด</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={watch("ConditionData.min_coverage_amount")}
                fullWidth
                size="small"
                inputProps={{
                  allowNegative: false,
                  fixedDecimalScale: true,
                }}
                InputProps={{
                  inputComponent: AppNumericFormat,
                  endAdornment: (
                    <InputAdornment position="end">บาท</InputAdornment>
                  ),
                }}
                onChange={handleMinCoverage}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={2}>
              <Typography sx={{ fontWeight: "600" }}>คุ้มครองสูงสุด</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={watch("ConditionData.max_coverage_amount")}
                fullWidth
                size="small"
                inputProps={{
                  allowNegative: false,
                  fixedDecimalScale: true,
                }}
                InputProps={{
                  inputComponent: AppNumericFormat,
                  endAdornment: (
                    <InputAdornment position="end">บาท</InputAdornment>
                  ),
                }}
                onChange={handleMaxCoverage}
              />
              <FormHelperText error={errors?.name}>
                {errors?.name?.message}
              </FormHelperText>
            </Grid>
          </Grid>
        </AppCard>
      </Grid>
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={1}
          formMethods={{ ...formMethods }}
          productId={saleChannelId}
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={2}
          formMethods={{ ...formMethods }}
          productId={saleChannelId}
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={3}
          formMethods={{ ...formMethods }}
          productId={saleChannelId}
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={4}
          formMethods={{ ...formMethods }}
          productId={saleChannelId}
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={5}
          formMethods={{ ...formMethods }}
          productId={saleChannelId}
        />
      </Grid>
      {type === "2" && (
        <Grid item xs={12} mt={2}>
          <AppCard
            title={`การตั้งค่ารายผลิตภัณฑ์`}
            cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
          >
            {Groupmock.map((value, index, array) => (
              <AppCard
                title={`${value.name}`}
                cardstyle={{
                  border: "1px solid",
                  borderColor: "#e7e7e7",
                  marginBottom: index !== array.length - 1 ? 2 : 0,
                }}
                key={index}
              >
                <AppCard
                  title={`ทุนประกันที่ขาย`}
                  cardstyle={{
                    border: "1px solid",
                    borderColor: "#e7e7e7",
                  }}
                >
                  {value.Insure.map((Ins, InsIndex, arr) => (
                    <Grid
                      container
                      key={InsIndex}
                      mt={InsIndex !== arr.length ? 2 : 0}
                    >
                      <Grid item xs={2}>
                        <FormControlLabel
                          control={<Switch checked={Ins.isSale} />}
                          label="เปิดขาย"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          value={Ins.Insure}
                          fullWidth
                          size="small"
                          inputProps={{
                            allowNegative: false,
                            fixedDecimalScale: true,
                          }}
                          InputProps={{
                            inputComponent: AppNumericFormat,
                            endAdornment: (
                              <InputAdornment position="end">
                                บาท
                              </InputAdornment>
                            ),
                          }}
                        ></TextField>
                      </Grid>
                    </Grid>
                  ))}
                </AppCard>
              </AppCard>
            ))}
          </AppCard>
        </Grid>
      )}
      <Grid item xs={12}>
        <Card>
          <Grid container spacing={2} justifyContent={"end"}>
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
                    ขออนุมัติ
                  </Button>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button variant="outlined">ยกเลิก</Button>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button variant="outlined" onClick={handleResetForm}>
                    ล้างค่า
                  </Button>
                </Grid>

                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    sx={{
                      color: theme.palette.common.white,
                      backgroundColor: theme.palette.primary.main,
                    }}
                    onClick={handleSave}
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
        </Card>
      </Grid>
    </Grid>
  );
};
export default PageCommonDataProductSale;
