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
import { useAppSnackbar, useAppRouter, useAppForm } from "@hooks";
import { format, addYears, addDays } from "date-fns";
import { APPLICATION_DEFAULT } from "@constants";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yup } from "@utilities";
import { AppStatusProduct } from "./components";

const PageProductsList = () => {
  const router = useAppRouter();
  const { handleSnackAlert } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
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

  const sortString = (a, b) => {
    return a.localeCompare(b);
  };

  const columns = [
    {
      field: "id",
    },
    {
      flex: 1,
      field: "planCode",
      type: "string",
      headerAlign: "center",
      headerName: "รหัสแบบประกัน",
      headerClassName: "header-main",
      align: "center",
      minWidth: 200,
    },
    {
      flex: 1,
      field: "planName",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อแบบประกัน",
      headerClassName: "header-main",
      align: "left",
      minWidth: 200,
    },
    {
      flex: 1,
      field: "promise_type_Code",
      type: "string",
      headerAlign: "center",
      headerName: "สถานะ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 200,
      renderCell: (params) => (
        <AppStatus status={params.value} statusText={params.row.promise_type} />
      ),
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
      renderCell: (params) => <AppStatusProduct status={params.value} />,
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
          let formattedValue = format(new Date(value), "dd/MM/yyyy");
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
          let formattedValue = format(new Date(value), "dd/MM/yyyy");
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
        let disabledView = false; // TODO: เช็คตามสิทธิ์
        let disabledEdit = false; // TODO: เช็คตามสิทธิ์
        const viewFunction = disabledView
          ? null
          : () =>
              router.push(
                `/products/detail?&mode=VIEW&type=${params?.row?.promise_type_Code}&i_package=${i_package}&`
              );
        const editFunction = disabledEdit
          ? null
          : () =>
              router.push(
                `/products/detail?mode=EDIT&type=${params?.row?.promise_type_Code}`
              );

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
        ];
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
    create_date_end: Yup.date().nullable(),
    update_date_start: Yup.date().nullable(),
    update_date_end: Yup.date().nullable(),
  });

  const {
    reset,
    control,
    register,
    handleSubmit,
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
      let dataBody = JSON.stringify({
        field: sortField,
        direction: sortDirection,
        page_number: pageNumber,
        page_size: pageSize,
        is_active: watch(`status`) ? watch(`status.id`) : "0",
        product_name: watch(`name`) ? watch(`name`) : null,
        create_date_start: watch(`create_date_start`),
        create_date_end: watch(`create_date_end`),
        update_date_start: watch(`update_date_start`),
        update_date_end: watch(`update_date_end`),
      });

      const response = await fetch(
        `/api/products?action=getProducts`, //&pageNumber=${start}&pageSize=${limit}
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: dataBody,
        }
      );

      const data = await response.json();
      const mappedData = Array.from(data.products).map((item, index) => {
        return {
          ...item,
          id: index,
          planCode: item.plan_code,
          i_package: item.i_package,
          planName: item.product_name,
          promise_type_Code: item.i_package !== "NP-00" ? 0 : 5,
          status: item.active_status,
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

  const checkStatus = () => {};

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

  const handleResetForm = async () => {
    reset();
    await handleFetchProduct();
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
                          options={[
                            {
                              id: "0",
                              label: "ทั้งหมด",
                            },
                            { id: "1", label: "แบบร่าง" },
                            { id: "2", label: "เปิดใช้งาน" },
                            { id: "3", label: "ยกเลิกใช้งาน" },
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
                  name={`update_date_start`}
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
