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
  FormControlLabel,
  Switch,
  InputAdornment,
} from "@mui/material";
import {
  AppCard,
  AppDataGrid,
  AppAutocomplete,
  AppDatePicker,
  AppCollapseCard,
  AppStatusBool,
} from "@/components";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yup } from "@utilities";
import {
  useAppSnackbar,
  useAppRouter,
  useAppForm,
  useAppDispatch,
  useAppSelector,
  useAppFieldArray,
} from "@hooks";
import { APPLICATION_DEFAULT } from "@constants";
import { format, addYears, addDays, parseISO } from "date-fns";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
  RemoveRedEye,
  Edit,
  Search,
  RestartAlt,
  ExpandMore,
  Add,
  Delete,
} from "@mui/icons-material";
import { setDialog } from "@stores/slices";
const AppProductSalePaidType = ({ formMethods, productId }) => {
  const { handleSnackAlert } = useAppSnackbar();
  const theme = useTheme();

  const dispatch = useAppDispatch();
  const { dialog } = useAppSelector((state) => state.global);
  const validationSchema = Yup.object().shape({
    statusList: Yup.array().of(Yup.mixed()).nullable(),
    status: Yup.mixed().nullable(),
    name: Yup.string().nullable(),
    fromCreateDate: Yup.date().nullable(),
    toCreateDate: Yup.date().nullable(),
    fromUpdateDate: Yup.date().nullable(),
    toUpdateDate: Yup.date().nullable(),
    fromInsuredSum: Yup.number().nullable(),
    ToInsuredSum: Yup.number().nullable(),
  });
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
  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = formMethods;
  const baseName = "salePaidType";
  const baseErrors = errors?.[baseName];
  const baseObject = `${baseName}.rows`;
  const { fields, insert, remove, update } = useAppFieldArray({
    control,
    name: baseObject,
  });

  const AddField = () => {
    const paymentModeValue = watch("paymentMode");

    setValue(`${baseName}.baseRows.id`, crypto.randomUUID());
    setValue(`${baseName}.baseRows.paidType`, paymentModeValue?.label || "");
    setValue(
      `${baseName}.baseRows.payment_mode_id`,
      paymentModeValue?.id || ""
    );
    setValue(`${baseName}.baseRows.status`, 1);
    setValue(`${baseName}.baseRows.statusText`, "รายการใหม่");
    setValue(`${baseName}.baseRows.createBy`, "admin");
    setValue(`${baseName}.baseRows.createDate`, new Date());
    setValue(`${baseName}.baseRows.updateBy`, "admin");
    setValue(`${baseName}.baseRows.updateDate`, new Date());

    let re = watch(`${baseName}.baseRows`);
    insert(fields.length, re);
  };
  const DeleteField = (index) => {
    remove(index);
  };
  const UpdateField = (index) => {
    let oldValue = watch(`${baseName}.rows.${index}`);
    setValue(`${baseName}.baseRows.id`, oldValue.id);
    setValue(`${baseName}.baseRows.status`, oldValue.status);
    setValue(`${baseName}.baseRows.statusText`, oldValue.statusText);

    const paymentModeValue = watch("paymentMode");
    setValue(`${baseName}.baseRows.paidType`, paymentModeValue?.label || "");
    setValue(
      `${baseName}.baseRows.payment_mode_id`,
      paymentModeValue?.id || ""
    );
    setValue(`${baseName}.baseRows.updateBy`, "admin");
    setValue(`${baseName}.baseRows.updateDate`, new Date());

    let re = watch(`${baseName}.baseRows`);
    update(index, re);
  };

  const router = useAppRouter();
  const [paymentModeState, setPaymentMode] = useState([]);
  const hiddenColumn = {
    id: false,
  };
  useEffect(() => {
    handleFetchProduct();
    handleFetchPaymentList();
  }, [pageNumber, pageSize]);
  const columns = [
    {
      field: "id",
    },

    {
      flex: 1,
      field: "paidType",
      type: "string",
      headerAlign: "center",
      headerName: "รูปแบบการชำระเงิน",
      headerClassName: "header-main",
      align: "center",
      minWidth: 200,
    },

    {
      flex: 1,
      field: "status",
      type: "string",
      headerAlign: "center",
      headerName: "สถานะ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 200,
      renderCell: (params) => (
        <AppStatusBool
          status={params.value}
          statusText={params.row.statusText}
        />
      ),
    },

    {
      flex: 1,
      field: "createBy",
      type: "string",
      headerAlign: "center",
      headerName: "สร้างโดย",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
    },
    {
      flex: 1,
      field: "createDate",
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
      field: "updateBy",
      type: "string",
      headerAlign: "center",
      headerName: "แก้ไขโดย",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
    },
    {
      flex: 1,
      field: "updateDate",
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
        let disabledView = false; // TODO: เช็คตามสิทธิ์
        let disabledEdit = false; // TODO: เช็คตามสิทธิ์
        let disabledDelete = false; // TODO: เช็คตามสิทธิ์
        const index = Array.from(watch(`${baseName}.rows`)).findIndex(
          (item) => item.id === id
        );
        const viewFunction = disabledView
          ? null
          : () => handleView(params?.row?.payment_mode_id, index);
        const editFunction = disabledEdit
          ? null
          : () => handleEdit(params?.row?.payment_mode_id, index);
        const deleteFunction = disabledDelete
          ? null
          : () => handleDelete(index);

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

  const handleAdd = () => {
    handleFetchPaymentList();
    handleNotiification("เพิ่มรูปแบบชำระเงิน", "add", () => {
      setTimeout(() => {}, 400);
    });
  };

  const handleEdit = (params, index) => {
    handleFetchPaymentList(params);
    handleNotiification("แก้ไขรูปแบบชำระเงิน", "edit", index, () => {
      setTimeout(() => {}, 400);
    });
  };
  const handleView = (params, index) => {
    handleFetchPaymentList(params);
    handleNotiification("รูปแบบชำระเงิน", "view", index, () => {
      setTimeout(() => {}, 400);
    });
  };

  const handleDelete = (index) => {
    DeleteField(index);
  };

  const handleNotiification = (message, mode, index, callback) => {
    dispatch(
      setDialog({
        ...dialog,
        open: true,
        title: message,
        useDefaultBehavior: false,
        renderAction: () => {
          return (
            <Grid container>
              <Grid container justifyContent={"center"}>
                <Grid item xs={11}>
                  <Card sx={{ border: "1px solid", borderColor: "#e7e7e7" }}>
                    <Grid container justifyContent={"center"}>
                      <Grid item xs={11} mb={2}>
                        <Controller
                          name={`paymentMode`}
                          control={control}
                          defaultValue={null}
                          render={({ field }) => {
                            const { name, onChange, value, ...otherProps } =
                              field;

                            return (
                              <>
                                <AppAutocomplete
                                  id={name}
                                  name={name}
                                  disablePortal
                                  fullWidth
                                  disabled={mode === "view" ? true : false}
                                  label="select an option"
                                  options={paymentModeState}
                                  value={value}
                                  onChange={(event, newValue) => {
                                    onChange(newValue);
                                    setValue("paymentMode", newValue);
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
                  </Card>
                </Grid>
              </Grid>
              <Grid container justifyContent={"space-around"} mt={2}>
                <Grid item xs={11}>
                  <Grid container justifyContent={"center"}>
                    {mode === "add" && (
                      <Grid item xs={12} md="auto" pr={2}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            AddField();
                            dispatch(
                              setDialog({
                                ...dialog,
                                open: false,
                                title: message,
                              })
                            );
                          }}
                        >
                          ยืนยัน
                        </Button>
                      </Grid>
                    )}

                    {mode === "edit" && (
                      <Grid item xs={12} md="auto" pr={2}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            UpdateField(index);
                            dispatch(
                              setDialog({
                                ...dialog,
                                open: false,
                                title: message,
                              })
                            );
                          }}
                        >
                          ยืนยัน
                        </Button>
                      </Grid>
                    )}

                    <Grid xs={12} md="auto">
                      <Button
                        variant="contained"
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
                        ยกเลิก
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      })
    );
  };
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

  const handleFetchPaymentList = async (paymentId) => {
    setLoading(true);
    try {
      const resPaymentMode = await fetch(
        `/api/direct?action=getPaymentModeById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const paymentModeData = await resPaymentMode.json();
      const dataSelect = Array.from(paymentModeData).find(
        (item) => item.id === paymentId
      );
      setPaymentMode(paymentModeData);
      const _form = watch();

      reset({
        ..._form,
        paymentMode: dataSelect,
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

  const handleFetchProduct = async () => {
    setLoading(true);
    try {
      const start = pageNumber;
      const limit = pageSize;
      const body = {
        field: "CreateDate",
        direction: "asc",
        page_number: start,
        page_size: limit,
        product_sale_channel_id: productId,
      };
      const response = await fetch(
        `/api/direct?action=getProductPaymentModeById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      let resultData = [];
      if (data.status !== 204) {
        if (data) {
          resultData = Array.from(data).map((value) => {
            return {
              ...value,
              id: value.product_payment_mode_id,
              paidType: value.payment_mode_description,
              StartDate: value.start_date,
              EndDate: value.end_date,
              createDate: value.create_date,
              updateDate: value.update_date,
              status: value.is_active,
              statusText: value.name_status,
              createBy: value.create_by,
              updateBy: value.update_by,
            };
          });
        }
      }

      const resetData = watch();
      reset({ ...resetData, salePaidType: { rows: [...resultData] } });
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด " + error,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Grid container justifyContent={"center"} my={2}>
      <Grid item xs={12}>
        <AppCard
          title={`รูปแบบการชำระเงิน (มีข้อมูลตั้งต้นจากระบบ Online เก่าแต่ Sync ไม่ได้เพราะไม่ได้เก็บบน Core)`}
          cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
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
                              id: "1",
                              label: "เปิดใช้งาน",
                            },
                            {
                              id: "2",
                              label: "ยกเลิกการใช้งาน",
                            },
                            {
                              id: "3",
                              label: "รายการใหม่",
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
                  label="ชื่อ"
                  margin="dense"
                  size="small"
                  id={`name`}
                  {...register(`name`)}
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
              <Grid item xs={12} md={"auto"} order={{ xs: 1, md: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    color: theme.palette.common.white,
                  }}
                  fullWidth
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={15} /> : <Add />}
                  onClick={handleAdd}
                >
                  เพิ่ม
                </Button>
              </Grid>
            </Grid>
            {
              //#endregion
            }
          </form>

          <Grid item xs={12} sx={{ height: "25rem" }} mt={1}>
            <AppDataGrid
              rows={watch(`${baseName}.rows`)}
              rowCount={watch(`${baseName}.pagination.totalRows`)}
              columns={columns}
              hiddenColumn={hiddenColumn}
              pageNumber={APPLICATION_DEFAULT.dataGrid.pageNumber}
              pageSize={APPLICATION_DEFAULT.dataGrid.pageSize}
              onPaginationModelChange={handlePageModelChange}
            />
          </Grid>
        </AppCard>
      </Grid>
    </Grid>
  );
};
export default AppProductSalePaidType;
