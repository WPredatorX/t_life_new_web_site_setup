import { useState, useEffect } from "react";
import {
  Tab,
  Tabs,
  Grid,
  Card,
  Badge,
  Switch,
  Button,
  Divider,
  useTheme,
  TextField,
  CardContent,
  InputAdornment,
  FormHelperText,
  FormControlLabel,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  AppCard,
  AppStatus,
  AppLoadData,
  AppDataGrid,
  AppDatePicker,
  AppAutocomplete,
} from "@components";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yup, Transform } from "@utilities";
import {
  useAppForm,
  useAppRouter,
  useAppSnackbar,
  useAppSelector,
  useAppFeatureCheck,
} from "@hooks";
import {
  APPLICATION_DEFAULT,
  APPLICATION_RECORD_PRODUCT_CHANNEL_STATUS,
  APPLICATION_RECORD_PRODUCT_DISPLAY_CHANNEL_STATUS,
} from "@constants";
import { format, addYears, parseISO, addHours } from "date-fns";
import {
  Edit,
  Check,
  Search,
  Delete,
  RestartAlt,
  RemoveRedEye,
} from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";

const AppProductList = ({ mode, channel, brokerData }) => {
  const theme = useTheme();
  const router = useAppRouter();
  const channelName =
    mode === "direct"
      ? "DIRECT"
      : brokerData?.generalInfo[0]?.c_subbusiness_line;
  const brokerId = brokerData?.generalInfo?.[0].broker_id;
  const { handleSnackAlert } = useAppSnackbar();
  const { activator } = useAppSelector((state) => state.global);
  const [value, setValue] = useState(0);
  const [pageNumber, setPageNumber] = useState(
    APPLICATION_DEFAULT.dataGrid.pageNumber
  );
  const [pageSize, setPageSize] = useState(
    APPLICATION_DEFAULT.dataGrid.pageSize
  );
  const defaultSortField = "create_date";
  const defaultSortDirection = "desc";
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
  });
  const { validFeature: grantProduct } = useAppFeatureCheck([
    "direct.product.general.read",
    "direct.product.general.write",
    "direct.product.general.approve",
    "direct.product.drop",
    "broker.product.general.read",
    "broker.product.general.write",
    "broker.product.general.approve",
    "broker.product.drop",
  ]);
  const { validFeature: grantProductRead } = useAppFeatureCheck([
    "direct.product.general.read",
    "broker.product.general.read",
  ]);
  const { validFeature: grantProductWrite } = useAppFeatureCheck([
    "direct.product.general.write",
    "broker.product.general.write",
  ]);
  const { validFeature: grantProductDrop } = useAppFeatureCheck([
    "direct.product.drop",
    "broker.product.drop",
  ]);
  const { validFeature: grantProductGeneralApprove } = useAppFeatureCheck([
    "direct.product.general.approve",
    "broker.product.general.approve",
  ]);
  const { validFeature: grantProductDisplay } = useAppFeatureCheck([
    "direct.product.display.read",
    "direct.product.display.write",
    "direct.product.display.approve",
    "broker.product.display.read",
    "broker.product.display.write",
    "broker.product.display.approve",
  ]);
  const { validFeature: grantProductDisplayApprove } = useAppFeatureCheck([
    "direct.product.display.approve",
    "broker.product.display.approve",
  ]);
  const { validFeature: grantProductDisplayRead } = useAppFeatureCheck([
    "direct.product.display.read",
    "broker.product.display.read",
  ]);
  const { validFeature: grantProductDisplayWrite } = useAppFeatureCheck([
    "direct.product.display.write",
    "broker.product.display.write",
  ]);

  const validationSchema = Yup.object().shape({
    field: Yup.string(),
    direction: Yup.string(),
    page_number: Yup.number(),
    page_size: Yup.number(),
    status: Yup.object().nullable(),
    status_mkt: Yup.object().nullable(),
    name: Yup.string().nullable(),
    min_coverage_amount_start: Yup.number()
      .nullable()
      .min(0, "ต้องไม่เป็นค่าติดลบ"),
    min_coverage_amount_end: Yup.number()
      .nullable()
      .min(0, "ต้องไม่เป็นค่าติดลบ")
      .when("min_coverage_amount_start", {
        is: (value) => {
          return value !== null && value !== "";
        },
        then: (schema) => schema.required(),
      }),
    max_coverage_amount_start: Yup.number()
      .nullable()
      .min(0, "ต้องไม่เป็นค่าติดลบ"),
    max_coverage_amount_end: Yup.number()
      .nullable()
      .min(0, "ต้องไม่เป็นค่าติดลบ")
      .when("max_coverage_amount_start", {
        is: (value) => {
          return value !== null && value !== "";
        },
        then: (schema) => schema.required(),
      }),
    create_date_start: Yup.date().nullable(),
    create_date_end: Yup.date()
      .nullable()
      .when("create_date_start", {
        is: (value) => {
          return Boolean(value);
        },
        then: (schema) => schema.required(),
      }),
    update_date_start: Yup.date().nullable(),
    update_date_end: Yup.date()
      .nullable()
      .when("update_date_start", {
        is: (value) => {
          return Boolean(value);
        },
        then: (schema) => schema.required(),
      }),
    newVersionWaitingForApprove: Yup.bool().nullable(),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      field: "create_date",
      direction: "desc",
      page_number: APPLICATION_DEFAULT.dataGrid.pageNumber,
      page_size: APPLICATION_DEFAULT.dataGrid.pageSize,
      status: null,
      status_mkt: null,
      name: null,
      create_date_start: null,
      create_date_end: null,
      update_date_start: null,
      update_date_end: null,
      min_coverage_amount_start: null,
      min_coverage_amount_end: null,
      max_coverage_amount_start: null,
      max_coverage_amount_end: null,
      newVersionWaitingForApprove: false,
    },
  });

  const {
    watch,
    reset,
    control,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const hiddenColumn = {
    id: false,
    product_status: grantProductRead,
    marketting_status: grantProductDisplayRead,
  };

  const mainColumn = [
    {
      field: "id",
    },
    {
      flex: 1,
      field: "product_name",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อผลิตภัณฑ์",
      headerClassName: "header-main",
      align: "left",
      minWidth: 150,
    },
    {
      flex: 1,
      field: "product_status",
      type: "string",
      headerAlign: "center",
      headerName: "สถานะ (โพรดักส์)",
      headerClassName: "header-main",
      align: "center",
      minWidth: 150,
      renderCell: (params) => {
        return (
          <AppStatus
            status={params.row.product_status}
            statusText={params.row.product_status_name}
          />
        );
      },
    },
    {
      flex: 1,
      field: "marketting_status",
      type: "string",
      headerAlign: "center",
      headerName: "สถานะ (การตลาด)",
      headerClassName: "header-main",
      align: "center",
      minWidth: 150,
      renderCell: (params) => {
        const newVersionStatus = params?.row?.sale_card_status;
        const newVersionStatusText = params?.row?.sale_card_status_name;
        const showBadge = newVersionStatus === "2" || newVersionStatus === "5";
        const color = newVersionStatus === "2" ? "primary" : "error";

        const renderStatus = () => (
          <AppStatus
            status={params.row.marketting_status}
            statusText={params.row.marketting_status_name}
          />
        );

        if (showBadge) {
          return (
            <Badge
              color={color}
              variant="standard"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              badgeContent={newVersionStatusText}
              sx={{
                "& .MuiBadge-badge": {
                  position: "absolute",
                  left: "50%",
                  transform: "translate(0%, -50%)",
                  pointerEvents: "none",
                },
              }}
            >
              {renderStatus()}
            </Badge>
          );
        } else {
          return renderStatus();
        }
      },
    },
    {
      flex: 1,
      field: "min_coverage_amount",
      type: "string",
      headerAlign: "center",
      headerName: "ทุนประกันต่ำสุด",
      headerClassName: "header-main",
      align: "right",
      minWidth: 150,
      renderCell: (params) => Transform.formatNumber(params.value),
    },
    {
      flex: 1,
      field: "max_coverage_amount",
      type: "string",
      headerAlign: "center",
      headerName: "ทุนประกันสูงสุด",
      headerClassName: "header-main",
      align: "right",
      minWidth: 150,
      renderCell: (params) => Transform.formatNumber(params.value),
    },
    {
      flex: 1,
      field: "create_by",
      type: "string",
      headerAlign: "center",
      headerName: "สร้างโดย",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
    },
    {
      flex: 1,
      field: "create_date",
      type: "string",
      headerAlign: "center",
      headerName: "สร้างเมื่อ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
      valueGetter: (value) => {
        if (!value) return "";
        try {
          let formattedValue = format(
            addYears(parseISO(value), 543),
            "dd/MM/yyyy HH:mm:ss"
          );
          return formattedValue;
        } catch (error) {
          return value;
        }
      },
    },
    {
      flex: 1,
      field: "update_by",
      type: "string",
      headerAlign: "center",
      headerName: "แก้ไขโดย",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
    },
    {
      flex: 1,
      field: "update_date",
      type: "string",
      headerAlign: "center",
      headerName: "แก้ไขเมื่อ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
      valueGetter: (value) => {
        if (!value) return "";
        try {
          let formattedValue = format(
            addYears(parseISO(value), 543),
            "dd/MM/yyyy  HH:mm:ss"
          );
          return formattedValue;
        } catch (error) {
          return value;
        }
      },
    },
    {
      flex: 1,
      field: "actions",
      type: "actions",
      headerAlign: "center",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
      getActions: (params) => {
        let actions = [];
        const id = params?.id;
        const productStatus = params?.row?.product_status;
        const marketingStatus = params?.row?.marketting_status;
        const saleChannelId = params?.row?.product_sale_channel_id;
        const productNotCreated =
          saleChannelId === "" ||
          saleChannelId === null ||
          saleChannelId?.toUpperCase() ===
            "00000000-0000-0000-0000-000000000000";
        const productCreated = !productNotCreated;
        const productDropped = productStatus === "4";
        const additionalUrl = `&type=1&saleChannelId=${saleChannelId}&channel=${channel}&brokerId=${brokerId}`;
        let disabledView = false;
        let disabledEditProduct = false;
        let disabledEditDisplay = false;
        let disableDrop = false;
        let disableGeneralApprove = false;
        let disableDisplayApprove = false;
        let waitForProductGeneralApprove = productStatus === "2";
        let waitForProductDisplayApprove = marketingStatus === "2";
        let isProductEffetive = productStatus === "3";
        let isMarketingEffective = marketingStatus === "3";

        let viewFunction = () =>
          router.push(`/productsale/${id}?mode=VIEW${additionalUrl}`);

        let editProductFunction = () =>
          router.push(`/productsale/${id}?mode=EDIT_GENERAL${additionalUrl}`);

        let editDisplayFunction = () =>
          router.push(`/productsale/${id}?mode=EDIT_DISPLAY${additionalUrl}`);

        let generaApproveFunction = () =>
          router.push(
            `/productsale/${id}?mode=GENERAL_APPROVE${additionalUrl}`
          );

        let displayApproveFunction = () =>
          router.push(
            `/productsale/${id}?mode=DISPLAY_APPROVE${additionalUrl}`
          );

        let dropFunction = () =>
          router.push(`/productsale/${id}?mode=DROP${additionalUrl}`);

        // ถ้าไม่มี saleChannelId
        // 1. disable ปุ่ม ดูรายละเอียด / ยกเลิกการใช้งาน
        // 2. เซ็ท viewFunction / dropFunction ให้เป็น null ป้องกันการ trigger
        // 3. ตอนกด edit ให้รัน handleAddOrUpdateProduct
        if (productNotCreated) {
          disabledView = true;
          viewFunction = null;
          editProductFunction = () =>
            handleAddOrUpdateProduct(params.row, additionalUrl);
          editDisplayFunction = () =>
            handleAddOrUpdateProduct(params.row, additionalUrl);
        }

        // ถ้าอยู่ระหว่างการขออนุมัติข้อมูลทั่วไป
        // 1. disable ปุ่ม แก้ไข / ยกเลิก
        // 2. เซ็ท editProductFunction / dropFunction ให้เป็น null ป้องกันการ trigger
        if (waitForProductGeneralApprove) {
          disabledEditProduct = true;
          disableDrop = true;
          editProductFunction = null;
          dropFunction = null;
        }

        // ถ้าอยู่ระหว่างการขออนุมัติข้อมูลการแสดงผล
        // 1. disable ปุ่ม แก้ไข
        // 2. เซ็ท editDisplayFunction ให้เป็น null ป้องกันการ trigger
        if (waitForProductDisplayApprove) {
          disabledEditDisplay = true;
          editDisplayFunction = null;
        }

        const defaultProps = {
          showInMenu: true,
          sx: {
            "&.Mui-disabled": {
              pointerEvents: "all",
            },
          },
        };

        // #region ปุ่มดูรายละเอียด
        // แสดงปุ่มเมื่อมีสิทธิ์
        if (grantProductRead || grantProductDisplayRead) {
          actions.push(
            <GridActionsCellItem
              key={`view_${id}`}
              icon={<RemoveRedEye />}
              {...defaultProps}
              label={`ดูรายละเอียด`}
              disabled={disabledView}
              onClick={viewFunction}
            />
          );
        }
        // #endregion

        // #region ปุ่มแก้ไข
        // แสดงปุ่มเมื่อมีสิทธิ์
        // บังคับให้แสดงปุ่ม แก้ไข แค่ 1 ปุ่มพอเพราะไปด้วยลิ้งค์เดียวกัน
        // เช็คสิทธิ์ แก้ไข ข้อมูลทั่วไป และ การแสดงผลที่หน้าจอ สินค้าที่ขาย
        // ถ้ากำลัง รออนุมัติผลิตภัณฑ์ จะไม่แสดงปุ่ม
        // ถ้าเป็นสถานะเปิดใช้งานต้องยกเลิกผลิตภัณฑ์ก่อน
        let editAdded = false;
        if (
          grantProductWrite &&
          !isProductEffetive &&
          !editAdded &&
          !waitForProductGeneralApprove
        ) {
          editAdded = true;
          actions.push(
            <GridActionsCellItem
              title="แก้ไข (ส่วนผลิตภัณฑ์)"
              key={`edit_prodct_${id}`}
              icon={<Edit />}
              {...defaultProps}
              label="แก้ไขรายละเอียด"
              disabled={disabledEditProduct}
              onClick={editProductFunction}
            />
          );
        }

        // แสดงปุ่มเมื่อมีสิทธิ์
        // บังคับให้แสดงปุ่ม แก้ไข แค่ 1 ปุ่มพอเพราะไปด้วยลิ้งค์เดียวกัน
        // เช็คสิทธิ์ แก้ไข ข้อมูลทั่วไป และ การแสดงผลที่หน้าจอ สินค้าที่ขาย.
        // ถ้ากำลัง รออนุมัติการแสดงผล จะไม่แสดงปุ่ม
        // ถ้าเป็นสถานะเปิดใช้งานต้องยกเลิกผลิตภัณฑ์ก่อน
        if (
          grantProductDisplayWrite &&
          !isMarketingEffective &&
          !editAdded &&
          !waitForProductDisplayApprove
        ) {
          actions.push(
            <GridActionsCellItem
              title="แก้ไข (ส่วนแสดงผล)"
              key={`edit_display_${id}`}
              icon={<Edit />}
              {...defaultProps}
              label="แก้ไขรายละเอียด"
              disabled={disabledEditDisplay}
              onClick={editDisplayFunction}
            />
          );
        }
        // #endregion

        // #region ปุ่มอนุมัติข้อมูลผลิตภัณฑ์
        // แสดงปุ่มเมื่อมีสิทธิ์ , มีการแก้ไขรายการ (เกิด product_sale_channel_id ) และมีการขออนุมัติข้อมูลทั่วไป
        if (
          productCreated &&
          grantProductGeneralApprove &&
          waitForProductGeneralApprove
        ) {
          actions.push(
            <GridActionsCellItem
              key={`generalApprove_${id}`}
              icon={<Check />}
              disabled={disableGeneralApprove}
              {...defaultProps}
              label="พิจารณาอนุมัติข้อมูลทั่วไป"
              onClick={generaApproveFunction}
            />
          );
        }
        // #endregion

        // #region ปุ่มอนุมัติข้อมูลการแสดงผล
        // แสดงปุ่มเมื่อมีสิทธิ์ , มีการแก้ไขรายการ (เกิด product_sale_channel_id ) และมีการขออนุมัติข้อมูลการแสดงผล
        if (
          productCreated &&
          grantProductDisplayApprove &&
          waitForProductDisplayApprove
        ) {
          actions.push(
            <GridActionsCellItem
              key={`displayApprove_${id}`}
              icon={<Check />}
              disabled={disableDisplayApprove}
              {...defaultProps}
              label="พิจารณาอนุมัติการแเสดงผล"
              onClick={displayApproveFunction}
            />
          );
        }
        // #endregion

        // #region ปุ่มยกเลิกการใช้งาน
        // แสดงปุ่มเมื่อมีสิทธิ์ และ มีการแก้ไขรายการ (เกิด product_sale_channel_id ) แล้ว และ ต้องไม่เป็นสถานะยกเลิก
        if (productCreated && !productDropped && grantProductDrop) {
          actions.push(
            <GridActionsCellItem
              key={`approvePreview_${id}`}
              icon={<Delete />}
              disabled={disableDrop}
              {...defaultProps}
              label="ยกเลิกการใช้งาน"
              onClick={dropFunction}
            />
          );
        }
        // #endregion

        return actions;
      },
    },
  ];

  const handleResetForm = async () => {
    reset();
    await handleFetchProduct();
  };

  const handlePageModelChange = (model, detail) => {
    setPageNumber(model.page);
    setPageSize(model.pageSize);
  };

  const handleSortModelChange = (model, detail) => {
    let _sortField = defaultSortField;
    let _sortDirection = defaultSortDirection;

    if (Array.from(model).length > 0) {
      _sortField = model[0].field;
      _sortDirection = model[0].sort;
    }

    setSortField(_sortField);
    setSortDirection(_sortDirection);
  };

  const handleFetchProduct = async () => {
    setLoading(true);

    try {
      const body = {
        field: Transform.snakeToPascalCase(sortField),
        direction: sortDirection,
        page_number: pageNumber,
        page_size: pageSize,
        is_active: true,
        i_subbusiness_line: channel,
        product_status:
          grantProductDisplay && !grantProduct
            ? "3"
            : watch("status")
            ? watch("status").id === "0"
              ? null
              : watch("status").id
            : null,
        marketting_status: watch("status_mkt")
          ? watch("status_mkt").id === "0"
            ? null
            : watch("status_mkt").id
          : null,
        product_name: watch(`name`) ? watch(`name`) : null,
        min_coverage_amount_start: watch(`min_coverage_amount_start`),
        min_coverage_amount_end: watch(`min_coverage_amount_end`),
        max_coverage_amount_start: watch(`max_coverage_amount_start`),
        max_coverage_amount_end: watch(`max_coverage_amount_end`),
        create_date_start: addHours(watch(`create_date_start`), 7),
        create_date_end: addHours(watch(`create_date_end`), 7),
        update_date_start: addHours(watch(`update_date_start`), 7),
        update_date_end: addHours(watch(`update_date_end`), 7),
        sale_card_status: watch("newVersionWaitingForApprove") ? "2" : null,
      };
      const response = await fetch(
        `/api/direct?action=getAllProductSaleDirect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (response.status === 204) {
        setData({
          rows: [],
          totalRows: 0,
        });
      } else {
        const data = await response.json();
        setData({
          rows: data,
          totalRows: data?.[0]?.total_records ?? 0,
        });
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ล้มเหลวเกิดข้อผิดพลาด ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateProduct = async (params) => {
    setLoading(true);

    try {
      const body = {
        is_active: true,
        product_status: "1",
        create_by: activator,
        update_by: activator,
        product_sale_channel_id: params.product_sale_channel_id,
        product_plan_id: params.product_plan_id,
        broker_id: brokerId,
        product_sale_group_type: "1",
      };

      const response = await fetch(
        `/api/direct?action=AddOrUpdateProductPlanByChannel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      const additionalUrl = `&type=1&saleChannelId=${data}&channel=${channel}&brokerId=${brokerId}`;
      router.push(
        `/productsale/${params.product_plan_id}?mode=EDIT${additionalUrl}`
      );
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด " + error,
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    handleFetchProduct();
    try {
    } catch (error) {
      handleSnackAlert({ open: true, message: ล้มเหลวเกิดข้อผิดพลาด });
    } finally {
      setLoading(false);
    }
  };

  const onError = (error, event) => console.error({ error, event });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    handleFetchProduct();
  }, [pageNumber, pageSize, sortField, sortDirection]);

  if (
    brokerId === "" ||
    brokerId === null ||
    brokerId.toUpperCase() === "00000000-0000-0000-0000-000000000000"
  ) {
    return (
      <AppLoadData
        loadingState={4}
        message={`ข้อมูลช่องทาง ${mode} ยังไม่ถูกตั้งค่า`}
      />
    );
  }

  return (
    <Grid container justifyContent={"center"} my={2}>
      <Grid item> {}</Grid>
      <Grid item xs={11.6}>
        <AppCard
          title={`ผลิตภัณฑ์ที่ขายทั้งหมดของช่องทาง ${channelName}`}
          cardstyle={{ border: "1px solid grey" }}
        >
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Grid container spacing={2}>
              {grantProduct && (
                <Grid item xs={12} md={3}>
                  <Controller
                    name={`status`}
                    control={control}
                    render={({ field }) => {
                      const { name, onChange, ...otherProps } = field;

                      return (
                        <>
                          <AppAutocomplete
                            id={name}
                            name={name}
                            disablePortal
                            fullWidth
                            label="สถานะ (โพรดักส์)"
                            options={APPLICATION_RECORD_PRODUCT_CHANNEL_STATUS}
                            onChange={(event, value) => {
                              onChange(value);
                            }}
                            {...otherProps}
                            error={Boolean(errors?.status)}
                          />
                          <FormHelperText error={errors?.status}>
                            {errors?.status?.message}
                          </FormHelperText>
                        </>
                      );
                    }}
                  />
                </Grid>
              )}
              {grantProductDisplay && (
                <Grid item xs={12} md={3}>
                  <Controller
                    name={`status_mkt`}
                    control={control}
                    render={({ field }) => {
                      const { name, onChange, ...otherProps } = field;

                      return (
                        <>
                          <AppAutocomplete
                            id={name}
                            name={name}
                            disablePortal
                            fullWidth
                            label="สถานะ (การตลาด)"
                            options={
                              APPLICATION_RECORD_PRODUCT_DISPLAY_CHANNEL_STATUS
                            }
                            onChange={(event, value) => {
                              onChange(value);
                            }}
                            {...otherProps}
                            error={Boolean(errors?.status)}
                          />
                          <FormHelperText error={errors?.status}>
                            {errors?.status?.message}
                          </FormHelperText>
                        </>
                      );
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  margin="dense"
                  size="small"
                  id={`name`}
                  {...register(`name`)}
                  error={Boolean(errors?.name)}
                  inputProps={{ maxLength: 100 }}
                  InputLabelProps={{ shrink: !!watch("name") }}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
              {grantProductDisplay && (
                <Grid
                  item
                  xs={12}
                  md={6}
                  mt={0.5}
                  sx={{ border: "0px solid red" }}
                >
                  <Controller
                    name={`newVersionWaitingForApprove`}
                    control={control}
                    render={({ field }) => {
                      const { name, onChange, value, ...otherProps } = field;
                      return (
                        <FormControlLabel
                          id={name}
                          name={name}
                          control={
                            <Switch
                              checked={value ?? false}
                              onChange={onChange}
                              {...otherProps}
                            />
                          }
                          label={
                            <Typography>
                              คำแจ้งเตือนเวอร์ชั่นใหม่ ( รออนุมัติ / ไม่อนุมัติ
                              )
                            </Typography>
                          }
                        />
                      );
                    }}
                  />
                </Grid>
              )}
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Controller
                  control={control}
                  name="min_coverage_amount_start"
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
                      label="จากทุนประกันต่ำสุด"
                      fullWidth
                      margin="dense"
                      size="small"
                      name={name}
                      inputRef={ref}
                      onBlur={onBlur}
                      InputLabelProps={value ? { shrink: true } : undefined}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">บาท</InputAdornment>
                        ),
                      }}
                      error={errors?.min_coverage_amount_start}
                    />
                  )}
                />
                <FormHelperText error={errors?.min_coverage_amount_start}>
                  {errors?.min_coverage_amount_start?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  control={control}
                  name="min_coverage_amount_end"
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                  }) => (
                    <NumericFormat
                      value={value ?? ""}
                      onValueChange={(values) => {
                        onChange(values.floatValue ?? null);
                      }}
                      disabled={
                        watch("min_coverage_amount_start") == null ||
                        watch("min_coverage_amount_start") === ""
                      }
                      readOnly={
                        watch("min_coverage_amount_start") == null ||
                        watch("min_coverage_amount_start") === ""
                      }
                      thousandSeparator
                      customInput={TextField}
                      label="ถึงทุนประกันต่ำสุด"
                      fullWidth
                      margin="dense"
                      size="small"
                      name={name}
                      inputRef={ref}
                      onBlur={onBlur}
                      InputLabelProps={value ? { shrink: true } : undefined}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">บาท</InputAdornment>
                        ),
                      }}
                      error={errors?.min_coverage_amount_end}
                    />
                  )}
                />
                <FormHelperText error={errors?.min_coverage_amount_end}>
                  {errors?.min_coverage_amount_end?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  control={control}
                  name="max_coverage_amount_start"
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
                      label="จากทุนประกันสูงสุด"
                      fullWidth
                      margin="dense"
                      size="small"
                      name={name}
                      inputRef={ref}
                      onBlur={onBlur}
                      InputLabelProps={value ? { shrink: true } : undefined}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">บาท</InputAdornment>
                        ),
                      }}
                      error={errors?.max_coverage_amount_start}
                    />
                  )}
                />
                <FormHelperText error={errors?.max_coverage_amount_start}>
                  {errors?.max_coverage_amount_start?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  control={control}
                  name="max_coverage_amount_end"
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                  }) => (
                    <NumericFormat
                      value={value ?? ""}
                      onValueChange={(values) => {
                        onChange(values.floatValue ?? null);
                      }}
                      disabled={
                        watch("max_coverage_amount_start") == null ||
                        watch("max_coverage_amount_start") === ""
                      }
                      readOnly={
                        watch("max_coverage_amount_start") == null ||
                        watch("max_coverage_amount_start") === ""
                      }
                      thousandSeparator
                      customInput={TextField}
                      label="ถึงทุนประกันสูงสุด"
                      fullWidth
                      margin="dense"
                      size="small"
                      name={name}
                      inputRef={ref}
                      onBlur={onBlur}
                      InputLabelProps={value ? { shrink: true } : undefined}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">บาท</InputAdornment>
                        ),
                      }}
                      error={errors?.max_coverage_amount_end}
                    />
                  )}
                />
                <FormHelperText error={errors?.max_coverage_amount_end}>
                  {errors?.max_coverage_amount_end?.message}
                </FormHelperText>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`create_date_start`}
                  control={control}
                  render={({ field }) => {
                    const { name, onChange, ...otherProps } = field;

                    return (
                      <>
                        <AppDatePicker
                          id={name}
                          name={name}
                          label="จากวันที่สร้าง"
                          fullWidth
                          margin="dense"
                          size="small"
                          disableFuture
                          onChange={(date) => {
                            clearErrors([
                              "create_date_start",
                              "create_date_end",
                            ]);
                            onChange(date);
                          }}
                          error={Boolean(errors?.create_date_start)}
                          {...otherProps}
                        />
                        <FormHelperText error={errors?.create_date_start}>
                          {errors?.create_date_start?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`create_date_end`}
                  control={control}
                  render={({ field }) => {
                    const { name, onChange, ...otherProps } = field;

                    return (
                      <>
                        <AppDatePicker
                          id={name}
                          name={name}
                          label="ถึงวันที่สร้าง"
                          fullWidth
                          margin="dense"
                          size="small"
                          disableFuture
                          minDate={new Date(watch("create_date_start"))}
                          disabled={!watch("create_date_start")}
                          readOnly={!watch("create_date_start")}
                          onChange={(date) => {
                            const a = watch("create_date_start");
                            console.log({ a, date });
                            onChange(date);
                          }}
                          error={Boolean(errors?.create_date_end)}
                          {...otherProps}
                        />
                        <FormHelperText error={errors?.create_date_end}>
                          {errors?.create_date_end?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`update_date_start`}
                  control={control}
                  render={({ field }) => {
                    const { name, onChange, ...otherProps } = field;

                    return (
                      <>
                        <AppDatePicker
                          id={name}
                          name={name}
                          label="จากวันที่แก้ไข"
                          fullWidth
                          margin="dense"
                          size="small"
                          disableFuture
                          onChange={(date) => {
                            clearErrors([
                              "update_date_start",
                              "update_date_end",
                            ]);
                            onChange(date);
                          }}
                          error={Boolean(errors?.update_date_start)}
                          {...otherProps}
                        />
                        <FormHelperText error={errors?.update_date_start}>
                          {errors?.update_date_start?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`update_date_end`}
                  control={control}
                  render={({ field }) => {
                    const { name, onChange, ...otherProps } = field;

                    return (
                      <>
                        <AppDatePicker
                          id={name}
                          name={name}
                          label="ถึงวันที่แก้ไข"
                          fullWidth
                          margin="dense"
                          size="small"
                          disableFuture
                          minDate={new Date(watch("update_date_start"))}
                          disabled={!watch("update_date_start")}
                          readOnly={!watch("update_date_start")}
                          onChange={(date) => {
                            onChange(date);
                          }}
                          error={Boolean(errors?.update_date_end)}
                          {...otherProps}
                        />
                        <FormHelperText error={errors?.update_date_end}>
                          {errors?.update_date_end?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent={"end"}>
              <Grid item xs={12} md={"auto"} order={{ xs: 2, md: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  disabled={loading}
                  endIcon={<RestartAlt />}
                  onClick={handleResetForm}
                >
                  ล้างค่า
                </Button>
              </Grid>
              <Grid item xs={12} md={"auto"} order={{ xs: 1, md: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  endIcon={
                    loading ? <CircularProgress size={15} /> : <Search />
                  }
                >
                  ค้นหา
                </Button>
              </Grid>
            </Grid>
          </form>
          <Grid container mt={2}>
            <Grid item xs={12}>
              <Card>
                <Tabs value={value} onChange={handleChange}>
                  <Tab value={0} label={"สัญญาหลัก"} />
                </Tabs>
                <Divider />
                <CardContent>
                  <Grid container>
                    <Grid item xs={12}>
                      {value === 0 && (
                        <Grid item xs={12} sx={{ height: "25rem" }}>
                          <AppDataGrid
                            getRowId={(row) => row?.product_plan_id}
                            rows={data.rows}
                            rowCount={data.totalRows}
                            columns={mainColumn}
                            hiddenColumn={hiddenColumn}
                            pageNumber={pageNumber}
                            pageSize={pageSize}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onPaginationModelChange={handlePageModelChange}
                            onSortModelChange={handleSortModelChange}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </AppCard>
      </Grid>
    </Grid>
  );
};
export default AppProductList;
