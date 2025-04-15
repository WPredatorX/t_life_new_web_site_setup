import { AppCard, AppCardDataGrid, AppNumericFormat } from "@/components";

import {
  FormControlLabel,
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

const PageCommonDataProductSale = ({ productId, type, saleChannelId }) => {
  const router = useAppRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { dialog } = useAppSelector((state) => state.global);
  const [ConditionData, setConditionData] = useState({});
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

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(ValidationSchema),
    defaultValues: {
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
        ]
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
            TemplateName: "",
            status: 1,
            statusText: "รายการใหม่",
            minimumCoverage: 200,
            maximumCoverage: 2000,
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
            TemplateName: "",
            status: 1,
            statusText: "รายการใหม่",
            minimumCoverage: 200,
            maximumCoverage: 2000,
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
          }
        ],

      },
      template: {},
    },
  });

  useEffect(() => {
    handleFetchProductCondition();
  }, []);
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
    setConditionData(data);
    setLoading(false);
  };


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
                value={ConditionData ? ConditionData.min_age_years : ""}
                fullWidth
                size="small"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">ปี</InputAdornment>
                  ),
                }}
              ></TextField>
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={ConditionData ? ConditionData.min_age_months : ""}
                fullWidth
                size="small"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">เดือน</InputAdornment>
                  ),
                }}
              ></TextField>
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={ConditionData ? ConditionData.min_age_days : ""}
                fullWidth
                size="small"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">วัน</InputAdornment>
                  ),
                }}
              ></TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={2}>
              <Typography sx={{ fontWeight: "600" }}>อายุสูงสุด</Typography>
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={ConditionData ? ConditionData.max_age_years : ""}
                fullWidth
                size="small"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">ปี</InputAdornment>
                  ),
                }}
              ></TextField>
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={ConditionData ? ConditionData.max_age_months : ""}
                fullWidth
                size="small"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">เดือน</InputAdornment>
                  ),
                }}
              ></TextField>
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={ConditionData ? ConditionData.max_age_days : ""}
                fullWidth
                size="small"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">วัน</InputAdornment>
                  ),
                }}
              ></TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={2}>
              <Typography sx={{ fontWeight: "600" }}>คุ้มครองต่ำสุด</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={ConditionData ? ConditionData.min_coverage_amount : ""}
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
              ></TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={2}>
              <Typography sx={{ fontWeight: "600" }}>คุ้มครองสูงสุด</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={ConditionData ? ConditionData.max_coverage_amount : ""}
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
              ></TextField>
            </Grid>
          </Grid>
        </AppCard>
      </Grid>
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={1}
          formMethods={{ ...formMethods }}
          productId={productId}
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={2}
          formMethods={{ ...formMethods }}
          productId={productId}
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={3}
          formMethods={{ ...formMethods }}
          productId={productId}
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={4}
          formMethods={{ ...formMethods }}
          productId={productId}
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <AppCardDataGrid
          mode={5}
          formMethods={{ ...formMethods }}
          productId={productId}
        />
      </Grid>
      {type === "1" && (
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
    </Grid>
  );
};
export default PageCommonDataProductSale;
