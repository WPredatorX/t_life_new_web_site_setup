"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  InputLabel,
  TextField,
  Button,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { RemoveRedEye, Edit, Search, RestartAlt } from "@mui/icons-material";
import {
  AppCard,
  AppDataGrid,
  AppStatus,
  AppAutocomplete,
  AppDatePicker,
} from "@components";
import {
  useAppSnackbar,
  useAppRouter,
  useAppForm,
  useAppFeatureCheck,
  useAppSelector,
} from "@hooks";
import { format, addHours } from "date-fns";
import { APPLICATION_DEFAULT, APPLICATION_RECORD_STATUS } from "@constants";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yup, Transform } from "@utilities";
import { AppStatusProduct } from "./components";

const PageProductsList = () => {
  const router = useAppRouter();
  const { activator } = useAppSelector((state) => state.global);
  const { validFeature: grantRead } = useAppFeatureCheck([
    "product.general.read",
    "product.setting.read",
  ]);
  const { validFeature: grantEdit } = useAppFeatureCheck([
    "product.general.write",
    "product.setting.write",
  ]);
  const { handleSnackAlert } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
  });
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

  const columns = [
    {
      field: "id",
    },
    {
      flex: 1,
      field: "plan_code",
      type: "string",
      headerAlign: "center",
      headerName: "รหัสแบบประกัน",
      headerClassName: "header-main",
      align: "center",
      minWidth: 200,
    },
    {
      flex: 1,
      field: "broker_list",
      type: "string",
      headerAlign: "center",
      headerName: "ช่องทางที่ขาย",
      headerClassName: "header-main",
      align: "left",
      minWidth: 300,
      sortable: false,
      renderCell: (params) => (
        <div
          style={{
            height: "100%",
            display: "flex",
            wordBreak: "break-word",
            lineHeight: 1.4,
            alignItems: "center",
            whiteSpace: "normal",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      flex: 1,
      field: "product_name",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อแบบประกัน",
      headerClassName: "header-main",
      align: "left",
      minWidth: 200,
    },
    {
      flex: 1,
      field: "i_package",
      type: "string",
      headerAlign: "center",
      headerName: "ประเภท",
      headerClassName: "header-main",
      align: "center",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <AppStatus
            status={params.value === "NP-00" ? "2" : "1"}
            statusText={params.row.promise_type}
          />
        );
      },
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
      renderCell: (params) => {
        return <AppStatusProduct status={params.value} />;
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
      sort: "desc",
      valueGetter: (value) => {
        if (value) {
          let formattedValue = format(new Date(value), "dd/MM/yyyy HH:mm:ss");
          return formattedValue;
        } else return "";
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
        if (value) {
          let formattedValue = format(new Date(value), "dd/MM/yyyy HH:mm:ss");
          return formattedValue;
        } else return "";
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
        let id = params?.row?.plan_code;
        let i_package = params?.row?.i_package;
        let disabledView = true;
        let disabledEdit = false;
        if (params?.row?.product_plan_id) {
          disabledView = false;
        }
        const viewFunction = disabledView
          ? null
          : () =>
              router.push(
                `/products/detail?mode=VIEW&type=${params?.row?.promise_type_code}&i_package=${i_package}&plan_code=${id}&product_plan_id=${params?.row?.product_plan_id}`
              );

        const editFunction = disabledEdit
          ? null
          : () => {
              if (params?.row?.product_plan_id) {
                router.push(
                  `/products/detail?mode=EDIT&type=${params?.row?.promise_type_code}&i_package=${i_package}&plan_code=${id}&product_plan_id=${params?.row?.product_plan_id}`
                );
              } else {
                handleCreateProductOnShelf(params?.row);
              }
            };

        const defaultProps = {
          showInMenu: true,
          sx: {
            "&.Mui-disabled": {
              pointerEvents: "all",
            },
          },
        };

        let actions = [];
        if (grantRead) {
          actions.push(
            <GridActionsCellItem
              disabled={disabledView}
              data-testid="viewButton"
              key={`view_${id}`}
              icon={<RemoveRedEye />}
              {...defaultProps}
              label="ดูรายละเอียด"
              onClick={viewFunction}
            />
          );
        }

        if (grantEdit) {
          actions.push(
            <GridActionsCellItem
              key={`edit_${id}`}
              icon={<Edit />}
              {...defaultProps}
              label="แก้ไขรายละเอียด"
              disabled={disabledEdit}
              data-testid="editButton"
              onClick={editFunction}
            />
          );
        }

        return actions;
      },
    },
  ];

  const hiddenColumn = {
    id: false,
  };

  const validationSchema = Yup.object().shape({
    statusList: Yup.array().of(Yup.mixed()).nullable(),
    status: Yup.mixed().nullable(),
    name: Yup.string().nullable(),
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

  const {
    reset,
    control,
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    watch,
  } = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      statusList: [],
      status: null,
      name: "",
      create_date_start: null,
      create_date_end: null,
      update_date_start: null,
      update_date_end: null,
    },
  });

  useEffect(() => {
    handleFetchProduct();
  }, [pageNumber, pageSize, sortField, sortDirection]);

  const handleFetchProduct = async () => {
    setLoading(true);

    try {
      let payload = {
        field: Transform.snakeToPascalCase(sortField),
        direction: sortDirection,
        page_number: pageNumber,
        page_size: pageSize,
        is_active: watch(`status`) ? watch(`status`)?.value : "0",
        product_name: watch(`name`) || null,
        create_date_start: addHours(watch(`create_date_start`), 7),
        create_date_end: addHours(watch(`create_date_end`), 7),
        update_date_start: addHours(watch(`update_date_start`), 7),
        update_date_end: addHours(watch(`update_date_end`), 7),
      };

      const response = await fetch(`/api/products?action=getProducts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const mappedData = Array.from(data.products).map((item, index) => {
        return {
          ...item,
          id: index,
          promise_type_code: item.i_package === "NP-00" ? 5 : 0,
        };
      });
      setPageNumber(data.current_page);
      setPageSize(data.page_size);
      setData({
        rows: mappedData,
        totalRows: data.total_records,
      });
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ล้มเหลวเกิดข้อผิดพลาด${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProductOnShelf = async (params) => {
    setLoading(true);

    try {
      let payload = {
        is_active: true,
        create_date: addHours(new Date(), 7),
        create_by: activator,
        update_date: addHours(new Date(), 7),
        update_by: activator,
        product_plan_id: null,
        i_package: params.i_package,
        title: params.product_name,
        description: "",
        content_url: "",
        beneficiary_content_url: "",
        is_fatca: false,
        is_crs: false,
        is_refund: false,
        is_tax: false,
        is_send_mail: false,
        is_send_sms: false,
        is_recurring: false,
        is_health: false,
        is_factor: false,
        is_sale_fatca: false,
        is_sale_crs: false,
        i_plan: params.plan_code,
        is_check_fatca: false,
        remark_marketing_name: "",
        item_name: params.product_name,
        is_download: null,
      };

      const response = await fetch(
        `/api/products?action=AddOrUpdateProductOnShelf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      router.push(
        `/products/detail?&mode=EDIT&type=${params.promise_type_code}&i_package=${params.i_package}&plan_code=${params.plan_code}&product_plan_id=${data.product_plan_id}`
      );
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ล้มเหลวเกิดข้อผิดพลาด : ${error}`,
      });
    } finally {
      setLoading(false);
    }
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

  const handleResetForm = async () => {
    reset();
    await handleFetchProduct();
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

  return (
    <AppCard title={"ผลิตภัณฑ์ทั้งหมด"}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} alignItems={"center"}>
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
                          options={APPLICATION_RECORD_STATUS}
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
        </Grid>
        <Grid item xs={12} sx={{ height: "25rem" }}>
          <AppDataGrid
            rows={data?.rows}
            rowCount={data?.totalRows}
            columns={columns}
            hiddenColumn={hiddenColumn}
            loading={loading}
            pageNumber={pageNumber}
            pageSize={pageSize}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortModelChange={handleSortModelChange}
            onPaginationModelChange={handlePageModelChange}
          />
        </Grid>
      </Grid>
    </AppCard>
  );
};

export default PageProductsList;
