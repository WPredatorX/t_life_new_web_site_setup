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
        let disabledView = false; // TODO: เช็คตามสิทธิ์
        let disabledEdit = false; // TODO: เช็คตามสิทธิ์
        let disabledDelete = false; // TODO: เช็คตามสิทธิ์
        let disabledApprove = false;
        const viewFunction = disabledView ? null : () => handleView(index);
        const editFunction = disabledEdit ? null : () => handleEdit(index);
        const deleteFunction = disabledDelete
          ? null
          : () => handleDelete(index);
        const ApproveFunction = disabledApprove
          ? null
          : () => handleApprove(index);
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
  const handleView = (index) => {
    handleNotification("จัดการโปรโมชั่น", "view", index, () => {
      setTimeout(() => {}, 400);
    });
  };
  const handleAdd = () => {
    handleNotification("จัดการโปรโมชั่น", () => {
      setTimeout(() => {}, 400);
    });
  };
  const handleApprove = (index) => {
    handleNotification("จัดการโปรโมชั่น", "Approve", index, () => {
      setTimeout(() => {}, 400);
    });
  };
  const handleEdit = (index) => {
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
      console.log("submit", { data });
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
      console.log("body", body);
      const response = await fetch(
        `/api/direct/promotion?action=getPromotion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      console.log("data", data);
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

  const handleUploadImage = async (field, index) => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result.split(",")[1];
            setValue(`promotion.${index}.${field}`, base64String);
            handleSnackAlert({
              open: true,
              message: "อัพโหลดสำเร็จ",
              severity: "success",
            });
          };
          reader.onerror = () => {
            handleSnackAlert({
              open: true,
              message: "เกิดข้อผิดพลาดในการแปลงไฟล์",
              severity: "error",
            });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "เกิดข้อผิดพลาดในการอัพโหลด",
        severity: "error",
      });
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
                            <TextField
                              required
                              fullWidth
                              label="รหัสโปรโมชั่น"
                              margin="dense"
                              disabled={
                                mode === "view" || mode === "Approve"
                                  ? true
                                  : false
                              }
                              size="small"
                              value={watch(`promotion.${index}.promotion_code`)}
                              id={`promotion.${index}.promotion_code`}
                            />
                            <FormHelperText error={errors?.name}>
                              {errors?.name?.message}
                            </FormHelperText>
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
                        </Grid>
                      </Grid>
                      <Grid item xs={11}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              required
                              fullWidth
                              type="number"
                              label="ส่วนลด(%)"
                              margin="dense"
                              disabled={
                                mode === "view" || mode === "Approve"
                                  ? true
                                  : false
                              }
                              size="small"
                              value={watch(
                                `promotion.${index}.discount_percent`
                              )}
                              id={`promotion.${index}.discount_percent`}
                              error={Boolean(errors?.name)}
                              inputProps={{ maxLength: 100 }}
                            />
                            <FormHelperText error={errors?.name}>
                              {errors?.name?.message}
                            </FormHelperText>
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
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
                              value={watch(
                                `promotion.${index}.discount_amount`
                              )}
                              id={`promotion.${index}.discount_amount`}
                              error={Boolean(errors?.name)}
                              inputProps={{ maxLength: 100 }}
                            />
                            <FormHelperText error={errors?.name}>
                              {errors?.name?.message}
                            </FormHelperText>
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
                                <TextField
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
                                  value={watch(
                                    `promotion.${index}.min_premium_amount`
                                  )}
                                  id={`promotion.${index}.min_premium_amount`}
                                  error={Boolean(errors?.name)}
                                  inputProps={{ maxLength: 100 }}
                                />
                                <FormHelperText error={errors?.name}>
                                  {errors?.name?.message}
                                </FormHelperText>
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
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
                                  value={watch(
                                    `promotion.${index}.max_premium_amount`
                                  )}
                                  id={`promotion.${index}.max_premium_amount`}
                                  error={Boolean(errors?.name)}
                                  inputProps={{ maxLength: 100 }}
                                />
                                <FormHelperText error={errors?.name}>
                                  {errors?.name?.message}
                                </FormHelperText>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <TextField
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
                                  id={`promotion.${index}.min_coverage_amount`}
                                  value={watch(
                                    `promotion.${index}.min_coverage_amount`
                                  )}
                                  error={Boolean(errors?.name)}
                                  inputProps={{ maxLength: 100 }}
                                />
                                <FormHelperText error={errors?.name}>
                                  {errors?.name?.message}
                                </FormHelperText>
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
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
                                  value={watch(
                                    `promotion.${index}.max_coverage_amount`
                                  )}
                                  id={`promotion.${index}.max_coverage_amount`}
                                  error={Boolean(errors?.name)}
                                  inputProps={{ maxLength: 100 }}
                                />
                                <FormHelperText error={errors?.name}>
                                  {errors?.name?.message}
                                </FormHelperText>
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
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label="ข้อความ (แสดงมุมบนซ้ายของการ์ด)"
                                    margin="dense"
                                    disabled={
                                      mode === "view" || mode === "Approve"
                                        ? true
                                        : false
                                    }
                                    size="small"
                                    value={watch(
                                      `promotion.${index}.c_campaign_short`
                                    )}
                                    id={`promotion.${index}.c_campaign_short`}
                                    error={Boolean(errors?.name)}
                                    inputProps={{ maxLength: 100 }}
                                  />
                                  <FormHelperText error={errors?.name}>
                                    {errors?.name?.message}
                                  </FormHelperText>
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label="ข้อความ (แสดงด้านล่างโปรโมชั่นหน้าคำนวณ)"
                                    margin="dense"
                                    disabled={
                                      mode === "view" || mode === "Approve"
                                        ? true
                                        : false
                                    }
                                    size="small"
                                    value={watch(
                                      `promotion.${index}.c_campaign`
                                    )}
                                    id={`promotion.${index}.c_campaign`}
                                    error={Boolean(errors?.name)}
                                    inputProps={{ maxLength: 100 }}
                                  />
                                  <FormHelperText error={errors?.name}>
                                    {errors?.name?.message}
                                  </FormHelperText>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid container>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                disabled={
                                  mode === "view" || mode === "Approve"
                                    ? true
                                    : false
                                }
                                margin="dense"
                                size="small"
                                label="รูปภาพแบนเนอร์ (1600 x 2000 px)"
                                value={watch(`promotion.${index}.content_url`)}
                                //id={`banner`}
                                //error={Boolean(errors?.name)}
                                inputProps={{ maxLength: 100 }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <Button
                                        sx={{ color: "GrayText" }}
                                        onclick={() =>
                                          handleUploadImage(
                                            "content_url",
                                            index
                                          )
                                        }
                                      >
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
                                value={watch(
                                  `promotion.${index}.condition_content`
                                )}
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
                    {mode === "Approve" && (
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
                          ขออนุมัติ
                        </Button>
                      </Grid>
                    )}

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
                    {mode === "edit" && (
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
                              })
                            );
                          }}
                        >
                          บันทึก
                        </Button>
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
