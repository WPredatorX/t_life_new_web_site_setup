import { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Button,
  useTheme,
  FormHelperText,
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
  useAppDialog,
  useAppForm,
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
import AppManageSaleRange from "./appManageSaleRange";

const AppProductSaleRange = ({ dataForm, productId, preventInput }) => {
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
  const [dialogMode, setDialogMode] = useState("view");
  const [selectedRow, setSelectedRow] = useState(null);

  const validationSchema = Yup.object().shape({
    active_status: Yup.mixed().nullable(),
    sale_start_date_start: Yup.date().nullable(),
    sale_start_date_end: Yup.date()
      .nullable()
      .when("sale_start_date_start", {
        is: (value) => {
          return Boolean(value);
        },
        then: (schema) => schema.required(),
      }),
    sale_end_date_start: Yup.date().nullable(),
    sale_end_date_end: Yup.date()
      .nullable()
      .when("sale_end_date_start", {
        is: (value) => {
          return Boolean(value);
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
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      active_status: null,
      sale_start_date_start: null,
      sale_start_date_end: null,
      sale_end_date_start: null,
      sale_end_date_end: null,
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
    formState: { errors },
  } = formMethods;

  const {
    // getValues: getValuesData,
    watch: watchData,
    reset: resetData,
    // resetField: resetFieldData,
    setValue: setValueData,
    formState: formStateData,
  } = dataForm;
  const { dirtyFields: dirtyFieldsData } = formStateData;
  const isDirtyData = dirtyFieldsData.saleRangeTemp;

  const watchedSaleRange = watchData("saleRange");
  const watchedSaleRangeTemp = watchData("saleRangeTemp");

  const rowsDisplay = useMemo(() => {
    const tempData = watchedSaleRangeTemp ?? [];
    const rowData = watchedSaleRange ?? [];

    // 1. Merge ของเก่า
    const merged = rowData.map((item) => {
      const override = tempData.find(
        (i) => i.sale_period_id === item.sale_period_id
      );
      return override ? { ...item, ...override } : item;
    });

    // 2. หาตัวใหม่จาก temp ที่ยังไม่มีใน rowData
    const newItems = tempData.filter(
      (item) => !rowData.some((r) => r.sale_period_id === item.sale_period_id)
    );

    // 3. รวมทั้งหมด
    return [...merged, ...newItems];
  }, [watchedSaleRange, watchedSaleRangeTemp]);

  const hiddenColumn = {
    id: false,
  };

  const columns = [
    {
      field: "id",
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
      field: "sale_start_date",
      type: "string",
      headerAlign: "center",
      headerName: "วันที่เริ่มต้น",
      headerClassName: "header-main",
      align: "left",
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
      field: "sale_end_date",
      type: "string",
      headerAlign: "center",
      headerName: "วันที่สิ้นสุด",
      headerClassName: "header-main",
      align: "left",
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
          let formattedValue = format(
            addYears(date, 543),
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
          let date;
          date = typeof value === "string" ? parseISO(value) : new Date(value);
          if (isNaN(date.getTime())) return value;
          let formattedValue = format(
            addYears(date, 543),
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
    const currentValue = watchData("saleRangeTemp") ?? [];
    const existsIndex = currentValue.findIndex(
      (item) => item.sale_period_id === data.sale_period_id
    );
    if (existsIndex > -1) {
      // กรณี create ซ้ำ หรือ edit
      updated = [...currentValue];
      updated[existsIndex] = { ...updated[existsIndex], ...data };
    } else {
      // เพิ่มใหม่ หรือแก้ไขจากของจริง
      updated = [...currentValue, data];
    }

    // ถ้ายังมีรายการใน Temp ถึงจะให้ฟอร์ม dirty ต่อไป
    setValueData("saleRangeTemp", updated, {
      shouldDirty: updated.length > 0,
    });
  };

  const handleDelete = (row) => {
    handleNotification(
      "คุณต้องการยกเลิกรายการนี้หรือไม่ ?",
      () => {
        const tempData = watchData("saleRangeTemp") ?? [];
        const isTemp = tempData.some(
          (item) => item.sale_period_id === row.sale_period_id
        );

        if (isTemp) {
          // เอาออกจาก temp array ไปเลย
          const newTempData = tempData.filter(
            (item) => item.sale_period_id !== row.sale_period_id
          );

          setValueData("saleRangeTemp", [...newTempData]);
        } else {
          // กรณีไม่ใช่ temp → ทำ soft delete
          const deleteRow = {
            ...row,
            sale_start_date:
              row?.sale_start_date && new Date(row.sale_start_date),
            sale_end_date: row?.sale_end_date && new Date(row.sale_end_date),
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
        sale_start_date_start: addHours(watch("sale_start_date_start"), 7),
        sale_start_date_end: addHours(watch("sale_start_date_end"), 7),
        sale_end_date_start: addHours(watch("sale_end_date_start"), 7),
        sale_end_date_end: addHours(watch("sale_end_date_end"), 7),
        create_date_start: addHours(watch("create_date_start"), 7),
        create_date_end: addHours(watch("create_date_end"), 7),
        update_date_start: addHours(watch("update_date_start"), 7),
        update_date_end: addHours(watch("update_date_end"), 7),
      };
      const response = await fetch(
        `/api/direct?action=getProductSalePeriodById`,
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
      resetData({
        ...currentValue,
        saleRange: [...resultData],
        saleRangeTemp: [],
      });
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ล้มเหลวเกิดข้อผิดพลาด ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchProduct();
  }, [pageNumber, pageSize, sortField, sortDirection]);

  return (
    <Grid container justifyContent={"center"} my={2}>
      <Grid item xs={12}>
        <AppManageSaleRange
          mode={dialogMode}
          open={dialogOpen}
          setOpen={setDialogOpen}
          initialData={selectedRow}
          handleSave={handleSave}
        />
        <AppCard
          title={`ระยะเวลาในการขาย (เปิดใช้งานได้ 1 รายการ)`}
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
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`sale_start_date_start`}
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
                          disabled={isDirtyData}
                          onChange={(date) => {
                            clearErrors([
                              "sale_start_date_start",
                              "sale_start_date_end",
                            ]);
                            onChange(date);
                          }}
                          error={Boolean(errors?.sale_start_date_start)}
                          {...otherProps}
                        />
                        <FormHelperText error={errors?.sale_start_date_start}>
                          {errors?.sale_start_date_start?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`sale_start_date_end`}
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
                          minDate={new Date(watch("sale_start_date_start"))}
                          disabled={
                            !watch("sale_start_date_start") || isDirtyData
                          }
                          readOnly={
                            !watch("sale_start_date_start") || isDirtyData
                          }
                          margin="dense"
                          size="small"
                          onChange={(date) => {
                            onChange(date);
                          }}
                          error={Boolean(errors?.sale_start_date_end)}
                          {...otherProps}
                        />
                        <FormHelperText error={errors?.sale_start_date_end}>
                          {errors?.sale_start_date_end?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`sale_end_date_start`}
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
                          disabled={isDirtyData}
                          onChange={(date) => {
                            clearErrors([
                              "sale_end_date_start",
                              "sale_end_date_end",
                            ]);
                            onChange(date);
                          }}
                          error={Boolean(errors?.sale_end_date_start)}
                          {...otherProps}
                        />
                        <FormHelperText error={errors?.sale_end_date_start}>
                          {errors?.sale_end_date_start?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name={`sale_end_date_end`}
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
                          minDate={new Date(watch("sale_end_date_start"))}
                          disabled={
                            !watch("sale_end_date_start") || isDirtyData
                          }
                          readOnly={
                            !watch("sale_end_date_start") || isDirtyData
                          }
                          onChange={(date) => {
                            onChange(date);
                          }}
                          error={Boolean(errors?.sale_end_date_end)}
                          {...otherProps}
                        />
                        <FormHelperText error={errors?.sale_end_date_end}>
                          {errors?.sale_end_date_end?.message}
                        </FormHelperText>
                      </>
                    );
                  }}
                />
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
              getRowId={(row) => row.sale_period_id}
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
export default AppProductSaleRange;
