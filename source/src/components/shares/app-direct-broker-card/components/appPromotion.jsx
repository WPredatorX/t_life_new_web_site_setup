import { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
  FormHelperText,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  InputAdornment,
} from "@mui/material";
import {
  AppCard,
  AppDataGrid,
  AppStatus,
  AppAutocomplete,
  AppDatePicker,
  AppCollapseCard,
  AppWyswig,
} from "@/components";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Transform, Yup } from "@utilities";
import {
  useAppSnackbar,
  useAppRouter,
  useAppForm,
  useAppDispatch,
  useAppSelector,
} from "@hooks";
import { APPLICATION_DEFAULT } from "@constants";
import { format, addYears, addDays, parseISO } from "date-fns";
import {
  RemoveRedEye,
  Edit,
  Search,
  RestartAlt,
  ExpandMore,
  Delete,
  Check,
} from "@mui/icons-material";
import { setDialog, closeDialog } from "@stores/slices";
import { GridActionsCellItem } from "@mui/x-data-grid";
import Image from "next/image";
import { hi } from "date-fns/locale";
const AppPromotion = () => {
  const { handleSnackAlert } = useAppSnackbar();
  const theme = useTheme();
  const promotionOption = [
    {
      id: "1",
      label: "ส่วนลดเบี้ยเป็นเปอร์เซ็น",
    },
    {
      id: "2",
      label: "ส่วนลดเบี้ยเป็นจำนวน",
    },
    {
      id: "3",
      label: "ของขวัญของกำนัล",
    },
  ];
  const [pageNumber, setPageNumber] = useState(
    APPLICATION_DEFAULT.dataGrid.pageNumber
  );
  const [pageSize, setPageSize] = useState(
    APPLICATION_DEFAULT.dataGrid.pageSize
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
  });
  const [picture1600x200, setPicture1600x2000] = useState("");
  const dispatch = useAppDispatch();
  const { dialog } = useAppSelector((state) => state.global);
  const validationSchema = Yup.object().shape({
    id: Yup.string().nullable(),
    type: Yup.mixed().nullable(),
    statusList: Yup.array().of(Yup.mixed()).nullable(),
    status: Yup.mixed().nullable(),
    name: Yup.string().nullable(),
    fromCreateDate: Yup.date().nullable(),
    toCreateDate: Yup.date().nullable(),
    fromUpdateDate: Yup.date().nullable(),
    toUpdateDate: Yup.date().nullable(),
    fromInsuredSum: Yup.number().nullable(),
    ToInsuredSum: Yup.number().nullable(),
    promotion: Yup.array()
      .of(
        Yup.object().shape({
          promotion_id: Yup.string().nullable(),
          i_campaign: Yup.mixed().nullable(),
          i_campaign_mkt: Yup.string().nullable(),
          promotion_code: Yup.string().nullable(),
          c_campaign: Yup.string().nullable(),
          c_campaign_short: Yup.string().nullable(),
          d_begin: Yup.date().nullable(),
          d_end: Yup.date().nullable(),
          discount_percent: Yup.number().nullable(),
          discount_amount: Yup.number().nullable(),
          discount_type: Yup.string().nullable(),
          content_url: Yup.string().nullable(),
          minimum_purchase: Yup.number().nullable(),
          is_first_time_discount: Yup.boolean().nullable(),
          promotion_status: Yup.number().nullable(),
          promotion_status_message: Yup.string().nullable(),
          min_premium_amount: Yup.number().nullable(),
          max_premium_amount: Yup.number().nullable(),
          min_coverage_amount: Yup.number().nullable(),
          max_coverage_amount: Yup.number().nullable(),
          condition_content: Yup.string().nullable(),
          tag_promotion: Yup.string().nullable(),
          remark_promotion_name: Yup.string().nullable(),
          is_active: Yup.boolean().nullable(),
          create_date: Yup.date().nullable(),
          create_by: Yup.string().nullable(),
          update_date: Yup.date().nullable(),
          update_by: Yup.string().nullable(),
          total_records: Yup.number().nullable(),
          total_pages: Yup.number().nullable(),
        })
      )
      .nullable(),
    promotiontype: Yup.object().shape({
      id: Yup.string().nullable(),
      label: Yup.string().nullable(),
    }),
    promotionPayload: Yup.object().shape({
      promotion_id: Yup.string().nullable(),
      i_campaign: Yup.mixed().nullable(),
      i_campaign_mkt: Yup.string().nullable(),
      promotion_code: Yup.string().nullable(),
      c_campaign: Yup.string().nullable(),
      c_campaign_short: Yup.string().nullable(),
      d_begin: Yup.date().nullable(),
      d_end: Yup.date().nullable(),
      discount_percent: Yup.number().nullable(),
      discount_amount: Yup.number().nullable(),
      discount_type: Yup.string().nullable(),
      content_url: Yup.string().nullable(),
      file_content_item: Yup.mixed().nullable(),
      minimum_purchase: Yup.number().nullable(),
      is_first_time_discount: Yup.boolean().nullable(),
      promotion_status: Yup.number().nullable(),
      promotion_status_message: Yup.string().nullable(),
      min_premium_amount: Yup.number().nullable(),
      max_premium_amount: Yup.number().nullable(),
      min_coverage_amount: Yup.number().nullable(),
      max_coverage_amount: Yup.number().nullable(),
      condition_content: Yup.string().nullable(),
      tag_promotion: Yup.string().nullable(),
      remark_promotion_name: Yup.string().nullable(),
      is_active: Yup.boolean().nullable(),
      create_date: Yup.date().nullable(),
      create_by: Yup.string().nullable(),
      update_date: Yup.date().nullable(),
      update_by: Yup.string().nullable(),
    }),
  });
  const {
    reset,
    watch,
    setValue,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: "",
      type: null,
      status: null,
      name: "",
      fromCreateDate: null,
      toCreateDate: null,
      fromUpdateDate: null,
      toUpdateDate: null,
      promotiontype: {},
      promotion: [
        {
          id: "CAMPMKT01",
          promotion_id: "",
          i_campaign: null,
          i_campaign_mkt: "CAMPMKT01",
          promotion_code: "",
          c_campaign: "",
          c_campaign_short: "",
          d_begin: new Date(),
          d_end: new Date(),
          discount_percent: 0,
          discount_amount: 0,
          discount_type: "",
          content_url: "",
          minimum_purchase: 0,
          is_first_time_discount: false,
          promotion_status: 1,
          promotion_status_message: "",
          min_premium_amount: 0,
          max_premium_amount: 0,
          min_coverage_amount: 0,
          max_coverage_amount: 0,
          condition_content: "",
          tag_promotion: "",
          remark_promotion_name: "",
          is_active: true,
          create_date: new Date(),
          create_by: "admin",
          update_date: new Date(),
          update_by: "admin",
          total_records: 2,
          total_pages: 1,
        },
      ],
      promotionPayload: {
        id: "CAMPMKT01",
        promotion_id: "",
        i_campaign: null,
        i_campaign_mkt: "CAMPMKT01",
        promotion_code: "",
        c_campaign: "",
        c_campaign_short: "",
        d_begin: new Date(),
        d_end: new Date(),
        discount_percent: 0,
        discount_amount: 0,
        discount_type: "",
        content_url: "",
        file_content_item: null,
        minimum_purchase: 0,
        is_first_time_discount: false,
        promotion_status: 1,
        promotion_status_message: "",
        min_premium_amount: 0,
        max_premium_amount: 0,
        min_coverage_amount: 0,
        max_coverage_amount: 0,
        condition_content: "",
        tag_promotion: "",
        remark_promotion_name: "",
        is_active: true,
        create_date: new Date(),
        create_by: "admin",
        update_date: new Date(),
        update_by: "admin",
      },
    },
  });
  const hiddenColumn = {
    id: false,
  };
  const columns = [
    {
      field: "id",
    },
    {
      flex: 1,
      field: "promotion_code",
      type: "string",
      headerAlign: "center",
      headerName: "รหัส Promotion",
      headerClassName: "header-main",
      align: "left",
      minWidth: 200,
    },

    {
      flex: 1,
      field: "promotion_status",
      type: "string",
      headerAlign: "center",
      headerName: "สถานะ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 200,
      renderCell: (params) => (
        <AppStatus
          status={params.value}
          statusText={params.row.promotion_status_message}
        />
      ),
    },
    {
      flex: 1,
      field: "discount_percent",
      type: "string",
      headerAlign: "center",
      headerName: "ส่วนลด(%)",
      headerClassName: "header-main",
      align: "right",
      minWidth: 200,
      renderCell: (params) => Transform.formatNumber(params.value),
    },
    {
      flex: 1,
      field: "discount_amount",
      type: "string",
      headerAlign: "center",
      headerName: "ส่วนลด(บาท)",
      headerClassName: "header-main",
      align: "right",
      minWidth: 200,
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
          let date;
          date = typeof value === "string" ? parseISO(value) : new Date(value);
          if (isNaN(date.getTime())) return value;
          let formattedValue = format(addYears(date, 543), "dd/MM/yyyy");
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
          let date;
          date = typeof value === "string" ? parseISO(value) : new Date(value);
          if (isNaN(date.getTime())) return value;
          let formattedValue = format(addYears(date, 543), "dd/MM/yyyy");
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
        const id = params?.row?.id;
        const index = Array.from(watch(`promotion`)).findIndex(
          (item) => item.id === id
        );
        const discountType = params.row.discount_type;
        let disabledView = false; // TODO: เช็คตามสิทธิ์
        let disabledEdit = false; // TODO: เช็คตามสิทธิ์
        let disabledDelete = false; // TODO: เช็คตามสิทธิ์
        let disabledApprove = false;

        const viewFunction = disabledView
          ? null
          : () => handleView(index, discountType, params?.row);
        const editFunction = disabledEdit
          ? null
          : () => handleEdit(index, discountType, params?.row);
        const deleteFunction = disabledDelete
          ? null
          : () => handleDelete(index);
        const ApproveFunction = disabledApprove
          ? null
          : () => handleApprove(index, discountType, params?.row);
        const defaultProps = {
          showInMenu: true,
          sx: {
            "&.Mui-disabled": {
              pointerEvents: "all",
            },
          },
        };

        return [
          <GridActionsCellItem
            key={`view_${id}`}
            icon={<RemoveRedEye />}
            {...defaultProps}
            label="ดูรายละเอียด"
            disabled={disabledView}
            onClick={viewFunction}
          />,
          <GridActionsCellItem
            key={`Approve_${id}`}
            icon={<Check />}
            {...defaultProps}
            label="พิจารณาอนุมัติ"
            disabled={disabledView}
            onClick={ApproveFunction}
          />,
          <GridActionsCellItem
            key={`edit_${id}`}
            icon={<Edit />}
            {...defaultProps}
            label="แก้ไข"
            disabled={disabledEdit}
            onClick={editFunction}
          />,
          <GridActionsCellItem
            key={`delete_${id}`}
            icon={<Delete />}
            {...defaultProps}
            label="ลบ"
            disabled={disabledDelete}
            onClick={deleteFunction}
          />,
        ];
      },
    },
  ];
  const handleView = (index, discountType, params) => {
    setValue("promotionPayload", params);
    handlePromotionType(discountType);
    handleNotification("จัดการโปรโมชั่น", "view", index, () => {
      setTimeout(() => {}, 400);
    });
  };
  const handleAdd = () => {
    handleNotification("จัดการโปรโมชั่น", () => {
      setTimeout(() => {}, 400);
    });
  };
  const handleApprove = (index, discountType, params) => {
    setValue("promotionPayload", params);
    handlePromotionType(discountType);
    handleNotification("จัดการโปรโมชั่น", "Approve", index, () => {
      setTimeout(() => {}, 400);
    });
  };
  const handleEdit = (index, discountType, params) => {
    setValue("promotionPayload", params);
    handlePromotionType(discountType);
    handleNotification("จัดการโปรโมชั่น", "edit", index, () => {
      setTimeout(() => {}, 400);
    });
  };
  useEffect(() => {
    handleFetchProduct();
  }, [pageNumber, pageSize]);
  const onSubmit = async (data) => {
    setLoading(true);

    try {
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    reset();
  };
  const handlePageModelChange = (model, detail) => {
    setPageNumber(model.page);
    setPageSize(model.pageSize);
  };

  const handleFetchProduct = async () => {
    setLoading(true);
    try {
      const body = {
        promotion_id: null,
        promotion_code: "",
        create_date_start: watch("fromCreateDate"),
        create_date_end: watch("toCreateDate"),
        update_date_start: watch("fromUpdateDate"),
        update_date_end: watch("toUpdateDate"),
        field: "CreateDate",
        direction: "desc",
        page_number: pageNumber,
        page_size: pageSize,
        promotion_status: watch("status")?.id,
      };

      const response = await fetch(
        `/api/direct/promotion?action=getPromotion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      const resultData = Array.from(data).map((item) => {
        return {
          ...item,
          id: item.i_campaign_mkt,
        };
      });

      const resetData = watch();
      reset({ ...resetData, promotion: [...resultData] });
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด" + error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePromotionType = (id) => {
    const dataSelect = Array.from(promotionOption).find(
      (item) => item.id === id
    );
    const _form = watch();

    reset({ ..._form, promotiontype: dataSelect });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // ตรวจสอบขนาดไฟล์ (max 10MB)
      if (file.size > 10 * 1600 * 2000) {
        handleSnackAlert({
          open: true,
          message: "ไฟล์มีขนาดใหญ่เกินไป กรุณาอัพโหลดไฟล์ขนาดไม่เกิน 10MB",
          severity: "error",
        });
        return;
      }

      // ตรวจสอบประเภทไฟล์
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        handleSnackAlert({
          open: true,
          message: "กรุณาอัพโหลดไฟล์ PDF หรือรูปภาพเท่านั้น",
          severity: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        setValue("promotionPayload.file_content_item", base64String);
        alert("อัพโหลดไฟล์สำเร็จ");
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async (mode) => {
    setLoading(true);
    try {
      let statusText = "";
      if (mode === 1) {
        statusText = "แบบร่าง";
      } else if (mode === 2) {
        statusText = "รออนุมัติ";
      } else if (mode === 3) {
        statusText = "เปิดใช้งาน";
      } else if (mode === 4) {
        statusText = "ยกเลิกการใช้งาน";
      }
      let payload = {
        is_active: true,
        create_by: watch("promotionPayload.create_by"),
        update_by: "admin",
        promotion_id: watch("promotionPayload.promotion_id"),
        promotion_code: watch("promotionPayload.promotion_code"),
        discount_percent: watch("promotionPayload.discount_percent"),
        discount_amount: watch("promotionPayload.discount_amount"),
        discount_type: watch("promotiontype.id"),
        content_url: watch("promotionPayload.content_url") ?? "",
        is_first_time_discount: watch(
          "promotionPayload.is_first_time_discount"
        ),
        minimum_purchase: watch("promotionPayload.minimum_purchase"),
        promotion_status: mode,
        promotion_status_message: "แบบร่าง",
        min_premium_amount: watch("promotionPayload.min_premium_amount"),
        max_premium_amount: watch("promotionPayload.max_premium_amount"),
        min_coverage_amount: watch("promotionPayload.min_coverage_amount"),
        max_coverage_amount: watch("promotionPayload.max_coverage_amount"),
        //ถ้า Upload file blob ต้องมี file_content_item = blob
        file_content_item: watch("promotionPayload.file_content_item"),
        condition_content: watch("promotionPayload.condition_content"),
        remark_promotion_name: watch("promotionPayload.remark_promotion_name"),
      };
      console.log("payload", payload);

      const response = await fetch(
        "/api/direct/promotion?action=AddOrUpdatePromotion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด" + error,
      });
    } finally {
      setLoading(false);
    }
  };

  //#region dialog
  const handleNotification = (message, mode, index, callback) => {
    dispatch(
      setDialog({
        ...dialog,
        open: true,
        title: message,
        width: 60,
        useDefaultBehavior: false,
        renderAction: () => {
          return (
            <Grid container>
              <Grid container justifyContent={"center"}>
                <Grid item xs={11}>
                  <Card sx={{ border: "1px solid", borderColor: "#e7e7e7" }}>
                    <Grid container justifyContent={"center"}>
                      <Grid item xs={11}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Controller
                              name="promotionPayload.promotion_code"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <TextField
                                    {...field}
                                    value={field.value ?? ""}
                                    required
                                    fullWidth
                                    label="รหัสโปรโมชั่น"
                                    margin="dense"
                                    disabled={
                                      mode === "view" || mode === "Approve"
                                    }
                                    size="small"
                                  />
                                  <FormHelperText error={errors?.name}>
                                    {errors?.name?.message}
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Controller
                              name={`promotiontype`}
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
                                      required
                                      label="ประเภทส่วนลด"
                                      options={promotionOption}
                                      onChange={(event, value) => {
                                        onChange(value);
                                        setValue("promotiontype", value);
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
                        </Grid>
                      </Grid>
                      <Grid item xs={11}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Controller
                              name="promotionPayload.discount_percent"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <TextField
                                    {...field}
                                    value={field.value ?? 0}
                                    required
                                    fullWidth
                                    type="number"
                                    label="ส่วนลด(%)"
                                    margin="dense"
                                    disabled={
                                      mode === "view" || mode === "Approve"
                                    }
                                    size="small"
                                    inputProps={{ maxLength: 100 }}
                                  />
                                  <FormHelperText error={errors?.name}>
                                    {errors?.name?.message}
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Controller
                              name="promotionPayload.discount_amount"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <TextField
                                    {...field}
                                    value={field.value ?? 0}
                                    required
                                    fullWidth
                                    type="number"
                                    label="ส่วนลดบาท"
                                    margin="dense"
                                    disabled={
                                      mode === "view" || mode === "Approve"
                                        ? true
                                        : false
                                    }
                                    size="small"
                                    error={Boolean(errors?.name)}
                                    inputProps={{ maxLength: 100 }}
                                  />
                                  <FormHelperText error={errors?.name}>
                                    {errors?.name?.message}
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={11}>
                        <AppCard
                          title={`เงื่อนไขการใช้งาน`}
                          cardstyle={{
                            border: "1px solid",
                            borderColor: "#e7e7e7",
                          }}
                        >
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Controller
                                  name="promotionPayload.min_premium_amount"
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      <TextField
                                        {...field}
                                        value={field.value ?? 0}
                                        required
                                        fullWidth
                                        type="number"
                                        label="เบี้ยต่ำสุด (บาท)"
                                        margin="dense"
                                        disabled={
                                          mode === "view" || mode === "Approve"
                                            ? true
                                            : false
                                        }
                                        size="small"
                                        error={Boolean(errors?.name)}
                                        inputProps={{ maxLength: 100 }}
                                      />
                                      <FormHelperText error={errors?.name}>
                                        {errors?.name?.message}
                                      </FormHelperText>
                                    </>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Controller
                                  name="promotionPayload.max_premium_amount"
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      <TextField
                                        {...field}
                                        value={field.value ?? 0}
                                        required
                                        fullWidth
                                        type="number"
                                        label="เบี้ยสูงสุด (บาท)"
                                        margin="dense"
                                        disabled={
                                          mode === "view" || mode === "Approve"
                                            ? true
                                            : false
                                        }
                                        size="small"
                                        error={Boolean(errors?.name)}
                                        inputProps={{ maxLength: 100 }}
                                      />
                                      <FormHelperText error={errors?.name}>
                                        {errors?.name?.message}
                                      </FormHelperText>
                                    </>
                                  )}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Controller
                                  name="promotionPayload.max_premium_amount"
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      <TextField
                                        {...field}
                                        value={field.value ?? 0}
                                        required
                                        fullWidth
                                        type="number"
                                        label="ทุนต่ำสุด (บาท)"
                                        margin="dense"
                                        disabled={
                                          mode === "view" || mode === "Approve"
                                            ? true
                                            : false
                                        }
                                        size="small"
                                        error={Boolean(errors?.name)}
                                        inputProps={{ maxLength: 100 }}
                                      />
                                      <FormHelperText error={errors?.name}>
                                        {errors?.name?.message}
                                      </FormHelperText>
                                    </>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Controller
                                  name="promotionPayload.max_coverage_amount"
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      <TextField
                                        {...field}
                                        value={field.value ?? 0}
                                        required
                                        fullWidth
                                        type="number"
                                        label="ทุนสูงสด (บาท)"
                                        margin="dense"
                                        disabled={
                                          mode === "view" || mode === "Approve"
                                            ? true
                                            : false
                                        }
                                        size="small"
                                        error={Boolean(errors?.name)}
                                        inputProps={{ maxLength: 100 }}
                                      />
                                      <FormHelperText error={errors?.name}>
                                        {errors?.name?.message}
                                      </FormHelperText>
                                    </>
                                  )}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </AppCard>
                        <AppCard
                          title={`การแสดงผล`}
                          cardstyle={{
                            border: "1px solid",
                            borderColor: "#e7e7e7",
                            marginTop: 2,
                            marginBottom: 4,
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Grid container>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    disabled
                                    margin="dense"
                                    size="small"
                                    label="รูปภาพแท็ก (แสดงมุมมล่างขวาของแบนเนอร์) 600x200"
                                    //id={`banner`}
                                    //error={Boolean(errors?.name)}
                                    inputProps={{ maxLength: 100 }}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <Button sx={{ color: "GrayText" }}>
                                            อัพโหลด
                                          </Button>
                                        </InputAdornment>
                                      ),
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Image
                                    alt="banner"
                                    src={"/images/600x200.png"}
                                    width={600}
                                    height={200}
                                    style={{
                                      aspectRatio: 600 / 200,
                                      border: "2px dashed #e7e7e7",
                                      objectFit: "contain",
                                    }}
                                  ></Image>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Controller
                                    name="promotionPayload.c_campaign_short"
                                    control={control}
                                    render={({ field }) => (
                                      <>
                                        <TextField
                                          {...field}
                                          value={field.value ?? ""}
                                          fullWidth
                                          label="ข้อความ (แสดงมุมบนซ้ายของการ์ด)"
                                          margin="dense"
                                          disabled={
                                            mode === "view" ||
                                            mode === "Approve"
                                              ? true
                                              : false
                                          }
                                          size="small"
                                          error={Boolean(errors?.name)}
                                          inputProps={{ maxLength: 100 }}
                                        />
                                        <FormHelperText error={errors?.name}>
                                          {errors?.name?.message}
                                        </FormHelperText>
                                      </>
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <Controller
                                    name="promotionPayload.c_campaign"
                                    control={control}
                                    render={({ field }) => (
                                      <>
                                        <TextField
                                          {...field}
                                          value={field.value ?? ""}
                                          fullWidth
                                          label="ข้อความ (แสดงด้านล่างโปรโมชั่นหน้าคำนวณ)"
                                          margin="dense"
                                          disabled={
                                            mode === "view" ||
                                            mode === "Approve"
                                              ? true
                                              : false
                                          }
                                          size="small"
                                          error={Boolean(errors?.name)}
                                          inputProps={{ maxLength: 100 }}
                                        />
                                        <FormHelperText error={errors?.name}>
                                          {errors?.name?.message}
                                        </FormHelperText>
                                      </>
                                    )}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid container>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                disabled
                                value={
                                  watch("promotionPayload.content_url") ?? ""
                                }
                                margin="dense"
                                size="small"
                                label="รูปภาพแบนเนอร์ (1600 x 2000 px)"
                                //id={`banner`}
                                //error={Boolean(errors?.name)}
                                inputProps={{ maxLength: 100 }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.gif"
                                        style={{ display: "none" }}
                                        id="file-upload"
                                        onChange={handleFileUpload}
                                      />
                                      <label htmlFor="file-upload">
                                        <Button
                                          component="span"
                                          sx={{ color: "GrayText" }}
                                        >
                                          อัพโหลด
                                        </Button>
                                      </label>
                                    </InputAdornment>
                                  ),
                                }}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Image
                                alt="banner"
                                src={"/images/1600x2000.png"}
                                width={1600}
                                height={2000}
                                style={{
                                  aspectRatio: 1600 / 2000,
                                  border: "2px dashed #e7e7e7",
                                  objectFit: "contain",
                                }}
                              ></Image>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography mt={2}>คำอธิบาย</Typography>

                              <AppWyswig
                                value={
                                  watch(`promotionPayload.condition_content`) ??
                                  ""
                                }
                              />
                            </Grid>
                          </Grid>
                        </AppCard>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
              <Grid container justifyContent={"space-around"} mt={2}>
                <Grid item xs={11}>
                  <Grid container justifyContent={"end"} spacing={2}>
                    <Grid item xs={12} md="auto">
                      <Button
                        variant="contained"
                        sx={{
                          fontSize: "1.8rem",
                          fontWeight: 700,
                          color: theme.palette.common.white,
                        }}
                        onClick={() => {
                          dispatch(
                            setDialog({
                              ...dialog,
                              open: false,
                              title: message,
                            })
                          );
                        }}
                      >
                        ดูตัวอย่าง
                      </Button>
                    </Grid>
                    {mode === "Approve" && (
                      <Grid container justifyContent={"end"} spacing={2} mt={1}>
                        <Grid item xs={12} md="auto">
                          <Button
                            variant="outlined"
                            sx={{
                              fontSize: "1.8rem",
                              fontWeight: 700,
                            }}
                            onClick={() => {
                              dispatch(closeDialog());
                            }}
                          >
                            ยกเลิก
                          </Button>
                        </Grid>
                        <Grid item xs={12} md="auto">
                          <Button
                            variant="contained"
                            sx={{
                              fontSize: "1.8rem",
                              fontWeight: 700,
                              backgroundColor: theme.palette.success.main,
                            }}
                            onClick={() => {
                              handleSave(3);
                              dispatch(
                                setDialog({
                                  ...dialog,
                                  open: false,
                                  title: message,
                                })
                              );
                            }}
                          >
                            อนุมัติ
                          </Button>
                        </Grid>
                        <Grid item xs={12} md="auto">
                          <Button
                            variant="contained"
                            sx={{
                              fontSize: "1.8rem",
                              fontWeight: 700,
                              backgroundColor: theme.palette.error.main,
                            }}
                            onClick={() => {
                              handleSave(1);
                              dispatch(
                                setDialog({
                                  ...dialog,
                                  open: false,
                                })
                              );
                            }}
                          >
                            ไม่อนุมัติ
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                    {mode === "edit" && (
                      <Grid container justifyContent={"end"} spacing={2} mt={1}>
                        <Grid item xs={12} md="auto">
                          <Button
                            variant="outlined"
                            sx={{
                              fontSize: "1.8rem",
                              fontWeight: 700,
                            }}
                            onClick={() => {
                              dispatch(closeDialog());
                            }}
                          >
                            ยกเลิก
                          </Button>
                        </Grid>
                        <Grid item xs={12} md="auto">
                          <Button
                            variant="contained"
                            sx={{
                              fontSize: "1.8rem",
                              fontWeight: 700,
                              color: theme.palette.common.white,
                            }}
                            onClick={() => {
                              handleSave(2);
                              dispatch(
                                setDialog({
                                  ...dialog,
                                  open: false,
                                  title: message,
                                })
                              );
                            }}
                          >
                            ขออนุมัติ
                          </Button>
                        </Grid>
                        <Grid item xs={12} md="auto">
                          <Button
                            variant="contained"
                            sx={{
                              fontSize: "1.8rem",
                              fontWeight: 700,
                              color: theme.palette.common.white,
                            }}
                            onClick={() => {
                              handleSave(1);
                              dispatch(
                                setDialog({
                                  ...dialog,
                                  open: false,
                                })
                              );
                            }}
                          >
                            บันทึก
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      })
    );
  };
  //#endregion

  return (
    <Grid container justifyContent={"center"} my={2}>
      <Grid item xs={11.6}>
        <AppCard
          title={`ผลิตภัณฑ์ที่ขายทั้งหมดของ`}
          cardstyle={{ border: "1px solid grey" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {
              //#region first label
            }
            <Grid container spacing={2}>
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
                          label="สถานะ"
                          options={[
                            {
                              id: null,
                              label: "ทั้งหมด",
                            },

                            {
                              id: "1",
                              label: "แบบร่าง",
                            },
                            {
                              id: "2",
                              label: "รอการอนุมัติ",
                            },
                            {
                              id: "3",
                              label: "เปิดใช้งาน",
                            },
                            {
                              id: "4",
                              label: "ยกเลิกการใช้งาน",
                            },
                          ]}
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
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="รหัสโปรโมชั่น"
                  margin="dense"
                  size="small"
                  id={`id`}
                  {...register(`id`)}
                  error={Boolean(errors?.name)}
                  inputProps={{ maxLength: 100 }}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
            </Grid>
            {
              //#endregion
            }
            {
              //#region Date
            }
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`fromCreateDate`}
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
                            onChange(date);
                          }}
                          error={Boolean(errors?.fromCreateDate)}
                          {...otherProps}
                        />
                        <FormHelperText error={errors?.fromCreateDate}>
                          {errors?.fromCreateDate?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`toCreateDate`}
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
                          onChange={(date) => {
                            onChange(date);
                          }}
                          error={Boolean(errors?.toCreateDate)}
                          {...otherProps}
                        />
                        <FormHelperText error={errors?.toCreateDate}>
                          {errors?.toCreateDate?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`fromUpdateDate`}
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
                            onChange(date);
                          }}
                          error={Boolean(errors?.fromUpdateDate)}
                          {...otherProps}
                        />
                        <FormHelperText error={errors?.fromUpdateDate}>
                          {errors?.fromUpdateDate?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`toUpdateDate`}
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
                          onChange={(date) => {
                            onChange(date);
                          }}
                          error={Boolean(errors?.toUpdateDate)}
                          {...otherProps}
                        />
                        <FormHelperText error={errors?.toUpdateDate}>
                          {errors?.toUpdateDate?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
            </Grid>
            {
              //#endregion
            }
            {
              //#region from button
            }
            <Grid container spacing={2} justifyContent={"end"}>
              <Grid item xs={12} md={"auto"} order={{ xs: 2, md: 1 }}>
                <Button
                  variant="outlined"
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
                  disabled={loading}
                  endIcon={
                    loading ? <CircularProgress size={15} /> : <Search />
                  }
                >
                  ค้นหา
                </Button>
              </Grid>
            </Grid>
            {
              //#endregion
            }
          </form>
          <Grid item xs={12} sx={{ height: "25rem" }}>
            <AppDataGrid
              rows={watch("promotion")}
              rowCount={watch("promotion.0.total_records")}
              columns={columns}
              loading={loading}
              hiddenColumn={hiddenColumn}
              pageNumber={pageNumber}
              pageSize={pageSize}
              onPaginationModelChange={handlePageModelChange}
            />
          </Grid>
        </AppCard>
      </Grid>
    </Grid>
  );
};

export default AppPromotion;
