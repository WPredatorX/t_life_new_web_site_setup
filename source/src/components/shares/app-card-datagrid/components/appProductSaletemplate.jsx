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
  AppNumericFormat,
} from "@/components";
import { Controller } from "react-hook-form";

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
import { Transform } from "@utilities";
const AppProductSaleTemplate = ({ formMethods, productId }) => {
  const { handleSnackAlert } = useAppSnackbar();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { dialog } = useAppSelector((state) => state.global);

  const [pageNumber, setPageNumber] = useState(
    APPLICATION_DEFAULT.dataGrid.pageNumber
  );
  const [pageSize, setPageSize] = useState(
    APPLICATION_DEFAULT.dataGrid.pageSize
  );
  const [loading, setLoading] = useState(false);

  const [TemplateList, setTemplateList] = useState([]);
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    watch,
  } = formMethods;

  const baseName = "saleTemplate";
  const baseErrors = errors?.[baseName];
  const baseObject = `${baseName}.rows`;
  const { fields, insert, remove, update } = useAppFieldArray({
    control,
    name: baseObject,
  });

  const router = useAppRouter();
  const AddField = () => {
    const template = watch("template");
    setValue(`${baseName}.baseRows.id`, crypto.randomUUID());
    setValue(`${baseName}.baseRows.app_temp_id`, template?.id || "");
    setValue(`${baseName}.baseRows.status`, 1);
    setValue(`${baseName}.baseRows.statusText`, "รายการใหม่");
    setValue(`${baseName}.baseRows.createBy`, "admin");
    setValue(`${baseName}.baseRows.createDate`, new Date());
    setValue(`${baseName}.baseRows.updateBy`, "admin");
    setValue(`${baseName}.baseRows.updateDate`, new Date());
    let re = watch(`${baseName}.baseRows`);
    insert(fields.length, re);
  };
  const UpdateField = (index) => {
    let oldValue = watch(`${baseName}.rows.${index}`);
    debugger;
    setValue(`${baseName}.baseRows.id`, oldValue.id);
    setValue(`${baseName}.baseRows.status`, oldValue.status);
    setValue(`${baseName}.baseRows.statusText`, oldValue.statusText);
    setValue(`${baseName}.baseRows.updateBy`, "admin");
    setValue(`${baseName}.baseRows.updateDate`, new Date());
    const template = watch("template");
    setValue(`${baseName}.baseRows.app_temp_id`, template?.id || "");
    let re = watch(`${baseName}.baseRows`);
    update(index, re);
  };

  const handleAdd = () => {
    handleNotiification("จัดการเทมเพลตใบคำขอ", "add", () => {
      setTimeout(() => {}, 400);
    });
  };
  const handleEdit = (params, index) => {
    handleFetchListTemplate(params);
    handleNotiification("จัดการเทมเพลตใบคำขอ", "edit", index, () => {
      setTimeout(() => {}, 400);
    });
  };
  const handleView = (params, index) => {
    handleFetchListTemplate(params);
    handleNotiification("จัดการเทมเพลตใบคำขอ", "view", index, () => {
      setTimeout(() => {}, 400);
    });
  };
  const handleDelete = (index) => {
    remove(index);
  };

  const handleMinCoverage = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`${baseName}.baseRows.min_coverage_amount`, value, {
      shouldValidate: true,
    });
  };

  const handleMaxCoverage = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`${baseName}.baseRows.max_coverage_amount`, value, {
      shouldValidate: true,
    });
  };

  const handleMinYear = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`${baseName}.baseRows.min_age_years`, value, {
      shouldValidate: true,
    });
  };

  const handleMinMonth = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`${baseName}.baseRows.min_age_months`, value, {
      shouldValidate: true,
    });
  };

  const handleMinDay = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`${baseName}.baseRows.min_age_days`, value, {
      shouldValidate: true,
    });
  };

  const handleMaxYear = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`${baseName}.baseRows.max_age_years`, value, {
      shouldValidate: true,
    });
  };

  const handleMaxMonth = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`${baseName}.baseRows.max_age_months`, value, {
      shouldValidate: true,
    });
  };

  const handleMaxDay = (e) => {
    let value = parseInt(e.target.value) || 0;
    setValue(`${baseName}.baseRows.max_age_days`, value, {
      shouldValidate: true,
    });
  };

  const handleNotiification = (message, mode, index, callback) => {
    dispatch(
      setDialog({
        ...dialog,
        open: true,
        title: message,
        useDefaultBehavior: false,
        width: 60,
        renderAction: () => {
          return (
            <Grid container>
              <Grid container justifyContent={"center"}>
                <Grid item xs={11}>
                  <Card sx={{ border: "1px solid", borderColor: "#e7e7e7" }}>
                    <Grid container justifyContent={"center"} spacing={2}>
                      <Grid item xs={11}>
                        <Controller
                          name={`template`}
                          disabled={mode === "view" ? true : false}
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
                                  label="เทมเพลตมาสเตอร์"
                                  options={TemplateList}
                                  onChange={(event, value) => {
                                    onChange(value);
                                    setValue(`template`, value);
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
                      <Grid item xs={11}>
                        <TextField
                          fullWidth
                          label="ชื่อ*"
                          margin="dense"
                          disabled={mode === "view" ? true : false}
                          size="small"
                          id={`${baseName}.baseRows.TemplateName`}
                          {...register(`${baseName}.baseRows.TemplateName`)}
                          error={Boolean(errors?.name)}
                          inputProps={{ maxLength: 100 }}
                        />
                        <FormHelperText error={errors?.name}>
                          {errors?.name?.message}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={5.5}>
                        <TextField
                          disabled={mode === "view" ? true : false}
                          InputProps={{
                            inputComponent: AppNumericFormat,
                            endAdornment: (
                              <InputAdornment position="end">
                                บาท
                              </InputAdornment>
                            ),
                          }}
                          fullWidth
                          label="ความคุ้มครองต่ำสุด*"
                          margin="dense"
                          size="small"
                          value={watch(
                            `${baseObject}.${index}.min_coverage_amount`
                          )}
                          onChange={handleMinCoverage}
                          error={Boolean(errors?.name)}
                          inputProps={{ allowNegative: false }}
                        />
                        <FormHelperText error={errors?.name}>
                          {errors?.name?.message}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={5.5}>
                        <TextField
                          fullWidth
                          disabled={mode === "view" ? true : false}
                          label="ความคุ้มครองสูงสุด*"
                          margin="dense"
                          size="small"
                          value={watch(
                            `${baseObject}.${index}.max_coverage_amount`
                          )}
                          onChange={handleMaxCoverage}
                          error={Boolean(errors?.name)}
                          inputProps={{ allowNegative: false }}
                          InputProps={{
                            inputComponent: AppNumericFormat,
                            endAdornment: (
                              <InputAdornment position="end">
                                บาท
                              </InputAdornment>
                            ),
                          }}
                        />
                        <FormHelperText error={errors?.name}>
                          {errors?.name?.message}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={2.75} alignContent={"center"}>
                        <Typography>อายุต่ำสุด</Typography>
                      </Grid>
                      <Grid item xs={2.75}>
                        <TextField
                          fullWidth
                          disabled={mode === "view" ? true : false}
                          placeholder="0"
                          margin="dense"
                          size="small"
                          value={watch(`${baseObject}.${index}.min_age_years`)}
                          onChange={handleMinYear}
                          error={Boolean(errors?.name)}
                          inputProps={{ maxLength: 100 }}
                          type="number"
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
                      <Grid item xs={2.75}>
                        <TextField
                          fullWidth
                          disabled={mode === "view" ? true : false}
                          placeholder="0"
                          margin="dense"
                          size="small"
                          value={watch(`${baseObject}.${index}.min_age_months`)}
                          onChange={handleMinMonth}
                          error={Boolean(errors?.name)}
                          inputProps={{ maxLength: 100 }}
                          type="number"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                เดือน
                              </InputAdornment>
                            ),
                          }}
                        />
                        <FormHelperText error={errors?.name}>
                          {errors?.name?.message}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={2.75}>
                        <TextField
                          fullWidth
                          disabled={mode === "view" ? true : false}
                          placeholder="0"
                          margin="dense"
                          size="small"
                          value={watch(`${baseObject}.${index}.min_age_days`)}
                          onChange={handleMinDay}
                          error={Boolean(errors?.name)}
                          inputProps={{ maxLength: 100 }}
                          type="number"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                วัน
                              </InputAdornment>
                            ),
                          }}
                        />
                        <FormHelperText error={errors?.name}>
                          {errors?.name?.message}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={2.75} alignContent={"center"}>
                        <Typography>อายุสูงสุด</Typography>
                      </Grid>
                      <Grid item xs={2.75} mb={2}>
                        <TextField
                          fullWidth
                          disabled={mode === "view" ? true : false}
                          placeholder="0"
                          margin="dense"
                          size="small"
                          value={watch(`${baseObject}.${index}.max_age_years`)}
                          onChange={handleMaxYear}
                          error={Boolean(errors?.name)}
                          inputProps={{ maxLength: 100 }}
                          type="number"
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
                      <Grid item xs={2.75}>
                        <TextField
                          fullWidth
                          disabled={mode === "view" ? true : false}
                          placeholder="0"
                          margin="dense"
                          size="small"
                          value={watch(`${baseObject}.${index}.max_age_months`)}
                          onChange={handleMaxMonth}
                          error={Boolean(errors?.name)}
                          inputProps={{ maxLength: 100 }}
                          type="number"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                เดือน
                              </InputAdornment>
                            ),
                          }}
                        />
                        <FormHelperText error={errors?.name}>
                          {errors?.name?.message}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={2.75}>
                        <TextField
                          fullWidth
                          disabled={mode === "view" ? true : false}
                          placeholder="0"
                          margin="dense"
                          size="small"
                          value={watch(`${baseObject}.${index}.max_age_days`)}
                          onChange={handleMaxDay}
                          error={Boolean(errors?.name)}
                          inputProps={{ maxLength: 100 }}
                          type="number"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                วัน
                              </InputAdornment>
                            ),
                          }}
                        />
                        <FormHelperText error={errors?.name}>
                          {errors?.name?.message}
                        </FormHelperText>
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
                              })
                            );
                          }}
                        >
                          ยืนยัน
                        </Button>
                      </Grid>
                    )}

                    <Grid item xs={12} md="auto">
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
  const hiddenColumn = {
    id: false,
  };
  useEffect(() => {
    handleFetchProduct();
    handleFetchListTemplate();
  }, [pageNumber, pageSize]);

  const columns = [
    {
      field: "id",
    },

    {
      flex: 1,
      field: "TemplateName",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อ",
      headerClassName: "header-main",
      align: "left",
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
      field: "min_coverage_amount",
      type: "string",
      headerAlign: "center",
      headerName: "ความคุ้มครองต่ำสุด",
      headerClassName: "header-main",
      align: "right",
      minWidth: 200,
      renderCell: (params) => Transform.formatNumber(params.value),
    },
    {
      flex: 1,
      field: "max_coverage_amount",
      type: "string",
      headerAlign: "center",
      headerName: "ความคุ้มครองสูงสุด",
      headerClassName: "header-main",
      align: "right",
      minWidth: 200,
      renderCell: (params) => Transform.formatNumber(params.value),
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
        const index = Array.from(watch(`${baseName}.rows`)).findIndex(
          (item) => item.id === id
        );
        let disabledView = false; // TODO: เช็คตามสิทธิ์
        let disabledEdit = false; // TODO: เช็คตามสิทธิ์
        let disabledDelete = false; // TODO: เช็คตามสิทธิ์
        const viewFunction = disabledView
          ? null
          : () => handleView(params.row.app_temp_id, index);
        const editFunction = disabledEdit
          ? null
          : () => handleEdit(params.row.app_temp_id, index);
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

  const handleFetchListTemplate = async (id) => {
    try {
      const response = await fetch(
        `/api/direct?action=getApplicationTemplateById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      const dataSelect = Array.from(data).find((item) => item.id === id);
      setTemplateList(data);
      const _form = watch();

      reset({
        ..._form,
        template: dataSelect,
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
      let body = JSON.stringify({
        field: "create_date",
        direction: "asc",
        page_number: pageNumber,
        page_size: pageSize,
        product_sale_channel_id: productId,
      });
      const response = await fetch(
        `/api/direct?action=getProductApplicationTemplateById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }
      );

      const data = await response.json();

      let resultData = [];
      if (data.status !== 204) {
        if (data) {
          resultData = Array.from(data).map((value) => {
            return {
              ...value,
              id: value.product_app_temp_id,
              TemplateName: value.app_temp_name_master,
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
      reset({ ...resetData, saleTemplate: { rows: [...resultData] } });
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ล้มเหลวเกิดข้อผิดพลาด${error}`,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Grid container justifyContent={"center"} my={2}>
      <Grid item xs={12}>
        <AppCard
          title={`เทมเพลตใบคำขอ`}
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
                              label: "Option 1",
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
                  label="รหัสเทมเพลต"
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
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="ความคุ้มครองต่ำสุด"
                  margin="dense"
                  size="small"
                  id={`minimumCoverage`}
                  {...register(`minimumCoverage`)}
                  error={Boolean(errors?.name)}
                  inputProps={{ maxLength: 100 }}
                />
                <FormHelperText error={errors?.name}>
                  {errors?.name?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="ความคุ้มครองสูงสุด"
                  margin="dense"
                  size="small"
                  id={`MaximumCoverage`}
                  {...register(`MaximumCoverage`)}
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
              //#region Date1
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
                          label="จากวันที่เริ่มต้น"
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
                          label="ถึงวันที่เริ่มต้น"
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
                          label="จากวันที่สิ้นสุด"
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
                          label="ถึงวันที่สิ้นสุด"
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
export default AppProductSaleTemplate;
