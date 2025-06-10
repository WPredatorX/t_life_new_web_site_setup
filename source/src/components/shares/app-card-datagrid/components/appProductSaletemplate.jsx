import { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Button,
  useTheme,
  TextField,
  FormHelperText,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  AppCard,
  AppStatus,
  AppDataGrid,
  AppDatePicker,
  AppAutocomplete,
} from "@/components";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yup, Transform } from "@utilities";
import {
  useAppForm,
  useAppDialog,
  useAppSelector,
  useAppSnackbar,
} from "@hooks";
import {
  APPLICATION_DEFAULT,
  APPLICATION_RECORD_PRODUCT_CHANNEL_DETAIL_STATUS,
} from "@constants";
import { format, addYears, parseISO, addHours } from "date-fns";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
  Add,
  Edit,
  Search,
  Delete,
  RestartAlt,
  RemoveRedEye,
} from "@mui/icons-material";
import AppManageSaleTemplate from "./appManageSaleTemplate";
import { NumericFormat } from "react-number-format";

const AppProductSaleTemplate = ({ dataForm, productId, preventInput }) => {
  const theme = useTheme();
  const { handleSnackAlert } = useAppSnackbar();
  const { handleNotification } = useAppDialog();
  const { activator } = useAppSelector((state) => state.global);
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [selectedRow, setSelectedRow] = useState(null);

  const validationSchema = Yup.object().shape({
    active_status: Yup.mixed().nullable(),
    template_name: Yup.string().nullable(),
    create_date_start: Yup.date().nullable(),
    create_date_end: Yup.date()
      .nullable()
      .when("create_date_start", {
        is: (value) => {
          return Boolean(value);
        },
        then: (schema) => schema.required(),
      }),
    min_coverage_amount: Yup.number().nullable(),
    max_coverage_amount: Yup.number()
      .nullable()
      .when("min_coverage_amount", {
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
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      active_status: null,
      template_name: null,
      min_coverage_amount: null,
      max_coverage_amount: null,
      create_date_start: null,
      create_date_end: null,
      update_date_start: null,
      update_date_end: null,
    },
  });

  const {
    watch,
    reset,
    control,
    handleSubmit,
    clearErrors,
    register,
    formState: { errors },
  } = formMethods;

  const {
    watch: watchData,
    reset: resetData,
    setValue: setValueData,
    formState: formStateData,
  } = dataForm;
  const { dirtyFields: dirtyFieldsData } = formStateData;
  const isDirtyData = !!dirtyFieldsData.saleTemplateTemp;

  const watchedData = watchData("saleTemplate");

  const watchedDataTemp = watchData("saleTemplateTemp");

  const rowsDisplay = useMemo(() => {
    const tempData = watchedDataTemp ?? [];
    const rowData = watchedData ?? [];

    // 1. Merge ของเก่า
    const merged = rowData.map((item) => {
      const override = tempData.find(
        (i) => i.product_app_temp_id === item.product_app_temp_id
      );
      return override ? { ...item, ...override } : item;
    });

    // 2. หาตัวใหม่จาก temp ที่ยังไม่มีใน rowData
    const newItems = tempData.filter(
      (item) =>
        !rowData.some((r) => r.product_app_temp_id === item.product_app_temp_id)
    );

    // 3. รวมทั้งหมด
    return [...merged, ...newItems];
  }, [watchedData, watchedDataTemp]);

  const hiddenColumn = {
    id: false,
  };

  const columns = [
    {
      field: "id",
    },
    {
      flex: 1,
      field: "app_temp_name",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
    },
    {
      flex: 1,
      field: "active_status",
      type: "string",
      headerAlign: "center",
      headerName: "สถานะ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 200,
      renderCell: (params) => (
        <AppStatus
          type="2"
          status={params.value}
          statusText={params.row.name_status}
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
      align: "center",
      minWidth: 100,
      renderCell: (params) => Transform.formatNumber(params.value),
    },
    {
      flex: 1,
      field: "max_coverage_amount",
      type: "string",
      headerAlign: "center",
      headerName: "ความคุ้มครองสูงสุด",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
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
        const row = params.row;
        const tempRow = params?.row?.is_new ?? false;
        const isActive =
          params?.row?.is_active || params?.row?.is_active === null || tempRow;

        let disabledView = false;
        let disabledEdit = false;
        let disabledDelete = false;
        let viewFunction = disabledView ? null : () => handleView(row);
        let editFunction = disabledEdit ? null : () => handleEdit(row);
        let deleteFunction = disabledDelete ? null : () => handleDelete(row);

        if (preventInput) {
          disabledEdit = true;
          disabledDelete = true;
          editFunction = null;
          deleteFunction = null;
        }

        const defaultProps = {
          showInMenu: true,
          sx: {
            "&.Mui-disabled": {
              pointerEvents: "all",
            },
          },
        };

        let actions = [
          <GridActionsCellItem
            key={`view_${id}`}
            icon={<RemoveRedEye />}
            {...defaultProps}
            label="ดูรายละเอียด"
            disabled={disabledView}
            onClick={viewFunction}
          />,
        ];

        if (isActive) {
          actions.push(
            <GridActionsCellItem
              key={`edit_${id}`}
              icon={<Edit />}
              {...defaultProps}
              label="แก้ไขรายละเอียด"
              disabled={disabledEdit}
              onClick={editFunction}
            />
          );
          actions.push(
            <GridActionsCellItem
              key={`delete_${id}`}
              icon={<Delete />}
              {...defaultProps}
              label={tempRow ? `นำรายการออก` : `ยกเลิกใช้งาน`}
              disabled={disabledDelete}
              onClick={deleteFunction}
            />
          );
        }

        return actions;
      },
    },
  ];

  const handleAdd = () => {
    setDialogMode("create");
    setSelectedRow(null);
    setDialogOpen(true);
  };

  const handleEdit = (row) => {
    setDialogMode("edit");
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleView = (row) => {
    setDialogMode("view");
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleSave = (data) => {
    let updated;
    const currentValue = watchData("saleTemplateTemp") ?? [];
    const existsIndex = currentValue.findIndex(
      (item) => item.product_app_temp_id === data.product_app_temp_id
    );
    if (existsIndex > -1) {
      // กรณี create ซ้ำ หรือ edit
      updated = [...currentValue];
      updated[existsIndex] = { ...updated[existsIndex], ...data };
    } else {
      // เพิ่มใหม่ หรือแก้ไขจากของจริง
      updated = [...currentValue, data];
    }

    setValueData("saleTemplateTemp", updated, { shouldDirty: true });
  };

  const handleDelete = (row) => {
    handleNotification(
      "คุณต้องการยกเลิกรายการนี้หรือไม่ ?",
      () => {
        const tempData = watchData("saleTemplateTemp") ?? [];
        const isTemp = tempData.some(
          (item) => item.product_app_temp_id === row.product_app_temp_id
        );

        if (isTemp) {
          // เอาออกจาก temp array ไปเลย
          const newTempData = tempData.filter(
            (item) => item.product_app_temp_id !== row.product_app_temp_id
          );
          setValueData("saleTemplateTemp", newTempData);
        } else {
          // กรณีไม่ใช่ temp → ทำ soft delete
          const deleteRow = {
            ...row,
            active_status: 3,
            name_status: "ยกเลิกใช้งาน",
            update_date: new Date(),
            update_by: activator,
          };
          handleSave(deleteRow);
        }
      },
      null,
      "question"
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await handleFetchProduct();
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };

  const onError = (error, event) => console.error({ error, event });

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
        product_sale_channel_id: productId,
        active_status: watch("active_status")?.id ?? "0",
        app_temp_name: watch("template_name"),
        min_coverage_amount: watch("min_coverage_amount"),
        max_coverage_amount: watch("max_coverage_amount"),
        create_date_start: addHours(watch("create_date_start"), 7),
        create_date_end: addHours(watch("create_date_end"), 7),
        update_date_start: addHours(watch("update_date_start"), 7),
        update_date_end: addHours(watch("update_date_end"), 7),
      };
      const response = await fetch(
        `/api/direct?action=getProductApplicationTemplateById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      let resultData = [];
      const data = await response.json();
      if (data.status !== 204) {
        if (data) {
          resultData = data;
        }
      }

      const currentValue = watchData();
      resetData(
        { ...currentValue, saleTemplate: [...resultData] },
        {
          keepDirty: true,
        }
      );
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ล้มเหลวเกิดข้อผิดพลาด ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTemplate = async () => {
    try {
      const response = await fetch(
        `/api/direct?action=getApplicationTemplateById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetchProduct();
  }, [pageNumber, pageSize, sortField, sortDirection]);

  return (
    <Grid container justifyContent={"center"} my={2}>
      <Grid item xs={12}>
        <AppManageSaleTemplate
          mode={dialogMode}
          open={dialogOpen}
          setOpen={setDialogOpen}
          initialData={selectedRow}
          handleSave={handleSave}
          handleFetchTemplate={handleFetchTemplate}
        />
        <AppCard
          title={`เทมเพลตใบคำขอ`}
          cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
        >
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`active_status`}
                  control={control}
                  render={({ field }) => {
                    const { name, onChange, ...otherProps } = field;

                    return (
                      <>
                        <AppAutocomplete
                          id={name}
                          name={name}
                          disablePortal
                          disabled={isDirtyData}
                          fullWidth
                          label="สถานะ"
                          options={
                            APPLICATION_RECORD_PRODUCT_CHANNEL_DETAIL_STATUS
                          }
                          onChange={(event, value) => {
                            onChange(value);
                          }}
                          {...otherProps}
                          error={Boolean(errors?.active_status)}
                        />
                        <FormHelperText error={errors?.active_status}>
                          {errors?.active_status?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  margin="dense"
                  label="ชื่อเทมเพลต"
                  disabled={isDirtyData}
                  {...register("template_name")}
                  error={errors?.template_name}
                />
                <FormHelperText error={errors?.template_name}>
                  {errors?.template_name?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name="min_coverage_amount"
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
                      label="ความคุ้มครองต่ำสุด"
                      fullWidth
                      margin="dense"
                      size="small"
                      name={name}
                      inputRef={ref}
                      onBlur={onBlur}
                      disabled={isDirtyData}
                      InputLabelProps={value ? { shrink: true } : undefined}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">บาท</InputAdornment>
                        ),
                      }}
                      error={errors?.min_coverage_amount}
                    />
                  )}
                />
                <FormHelperText error={Boolean(errors?.min_coverage_amount)}>
                  {errors?.min_coverage_amount?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name="max_coverage_amount"
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
                      label="ความคุ้มครองสูงสุด"
                      fullWidth
                      margin="dense"
                      size="small"
                      name={name}
                      inputRef={ref}
                      onBlur={onBlur}
                      disabled={isDirtyData}
                      InputLabelProps={value ? { shrink: true } : undefined}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">บาท</InputAdornment>
                        ),
                      }}
                      error={errors?.max_coverage_amount}
                    />
                  )}
                />
                <FormHelperText error={Boolean(errors?.max_coverage_amount)}>
                  {errors?.max_coverage_amount?.message}
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
                          disabled={isDirtyData}
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
                          disabled={!watch("create_date_start") || isDirtyData}
                          readOnly={!watch("create_date_start") || isDirtyData}
                          onChange={(date) => {
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
                          disabled={isDirtyData}
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
                          disabled={!watch("update_date_start") || isDirtyData}
                          readOnly={!watch("update_date_start") || isDirtyData}
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
                  disabled={loading || isDirtyData}
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
                  disabled={loading || isDirtyData}
                  endIcon={
                    loading ? <CircularProgress size={15} /> : <Search />
                  }
                >
                  ค้นหา
                </Button>
              </Grid>
              {!preventInput && (
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
              )}
            </Grid>
          </form>
          <Grid item xs={12} sx={{ height: "25rem" }} mt={1}>
            <AppDataGrid
              getRowId={(row) => row.product_app_temp_id}
              columns={columns}
              rows={rowsDisplay}
              rowCount={rowsDisplay.length}
              hiddenColumn={hiddenColumn}
              pageNumber={APPLICATION_DEFAULT.dataGrid.pageNumber}
              pageSize={APPLICATION_DEFAULT.dataGrid.pageSize}
              sortField={sortField}
              sortDirection={sortDirection}
              onPaginationModelChange={handlePageModelChange}
              onSortModelChange={handleSortModelChange}
              pagination={!isDirtyData}
              disableColumnSorting={isDirtyData}
              hideFooterPagination={isDirtyData}
              hideFooterSelectedRowCount={isDirtyData}
            />
          </Grid>
        </AppCard>
      </Grid>
    </Grid>
  );
};
export default AppProductSaleTemplate;
