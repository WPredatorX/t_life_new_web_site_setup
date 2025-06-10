"use client";

import { useState, useEffect } from "react";
import {
  Link,
  Grid,
  Button,
  TextField,
  IconButton,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
  RemoveRedEye,
  Edit,
  Search,
  RestartAlt,
  ContentCopy,
} from "@mui/icons-material";
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
} from "@hooks";
import { format, addYears, parseISO, addHours } from "date-fns";
import {
  APPLICATION_DEFAULT,
  APPLICATION_RECORD_BROKER_STATUS,
} from "@constants";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yup, Transform } from "@utilities";

const PageBrokerList = () => {
  const { validFeature: grantRead } = useAppFeatureCheck([
    "broker.general.read",
  ]);
  const { validFeature: grantEdit } = useAppFeatureCheck([
    "broker.general.write",
  ]);
  const router = useAppRouter();
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

  const hiddenColumn = {
    id: false,
  };

  const columns = [
    {
      field: "id",
    },
    {
      flex: 1,
      field: "c_subbusiness_line",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อ",
      headerClassName: "header-main",
      align: "left",
      minWidth: 200,
    },
    {
      flex: 1,
      field: "broker_email",
      type: "string",
      headerAlign: "center",
      headerName: "อีเมล",
      headerClassName: "header-main",
      align: "left",
      minWidth: 150,
    },
    {
      flex: 1,
      field: "broker_license_number",
      type: "string",
      headerAlign: "center",
      headerName: "เลขทะเบียน",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
    },
    {
      flex: 1,
      field: "broker_url",
      type: "string",
      headerAlign: "center",
      headerName: "ลิ้งค์เข้าถึง",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
      renderCell: (params) => {
        if (params?.value) {
          return (
            <>
              <Link href={params?.value}>คลิก</Link>
              <IconButton
                size="small"
                title="คัดลอก"
                onClick={async () => {
                  await navigator.clipboard.writeText(params?.value);
                  handleSnackAlert({
                    open: true,
                    severity: "success",
                    message: `คัดลอกลิ้งค์เข้าถึงของโบรกเกอร์${params?.row?.name}เรียบร้อยแล้ว`,
                  });
                }}
              >
                <ContentCopy style={{ fontSize: 15 }} />
              </IconButton>
            </>
          );
        }

        return <>-</>;
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
      minWidth: 100,
      renderCell: (params) => (
        <AppStatus
          type="3"
          status={params.value}
          statusText={params.row.name_status}
        />
      ),
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
        let formattedValue = value
          ? format(addYears(parseISO(value), 543), "dd/MM/yyyy HH:mm:ss")
          : "";
        return formattedValue;
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
        let formattedValue = value
          ? format(addYears(parseISO(value), 543), "dd/MM/yyyy HH:mm:ss")
          : "";
        return formattedValue;
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
        const subbusiness_line = params?.row?.i_subbusiness_line;
        const viewFunction = () => router.push(`/brokers/${subbusiness_line}`);
        const editFunction = () => router.push(`/brokers/${subbusiness_line}`);

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
              label="แก้ไข"
              onClick={editFunction}
            />
          );
        }

        return actions;
      },
    },
  ];

  const validationSchema = Yup.object().shape({
    active_status: Yup.mixed().nullable(),
    c_subbusiness_line: Yup.string().nullable(),
    broker_license_number: Yup.string().nullable(),
    broker_email: Yup.string().nullable(),
    fromCreateDate: Yup.date().nullable(),
    toCreateDate: Yup.date()
      .nullable()
      .when("fromCreateDate", {
        is: (value) => {
          return Boolean(value);
        },
        then: (schema) => schema.required(),
      }),
    fromUpdateDate: Yup.date().nullable(),
    toUpdateDate: Yup.date()
      .nullable()
      .when("fromUpdateDate", {
        is: (value) => {
          return Boolean(value);
        },
        then: (schema) => schema.required(),
      }),
  });

  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      c_subbusiness_line: "",
      active_status: null,
      broker_license_number: "",
      broker_email: "",
      fromCreateDate: null,
      toCreateDate: null,
      fromUpdateDate: null,
      toUpdateDate: null,
    },
  });

  const handleFetchBroker = async () => {
    setLoading(true);
    try {
      const payload = {
        field: Transform.snakeToPascalCase(sortField),
        direction: sortDirection,
        page_number: pageNumber,
        page_size: pageSize,
        active_status: watch("active_status")?.id ?? "0",
        broker_email: watch("broker_email"),
        broker_license_number: watch("broker_license_number"),
        c_subbusiness_line: watch("c_subbusiness_line"),
        create_date_start: addHours(watch("fromCreateDate"), 7),
        create_date_end: addHours(watch("toCreateDate"), 7),
        update_date_start: addHours(watch("fromUpdateDate"), 7),
        update_date_end: addHours(watch("toUpdateDate"), 7),
      };
      const response = await fetch(`/api/broker?action=getBroker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status !== 200) throw new Error("");

      const data = await response.json();
      setData(data);
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
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
    await handleFetchBroker();
  };

  const onSubmit = async (data, event) => {
    handleFetchBroker();
  };

  const onError = (error, event) => console.error(error);

  useEffect(() => {
    handleFetchBroker();
  }, [pageNumber, pageSize, sortField, sortDirection]);

  return (
    <AppCard title={"ช่องทาง Broker"}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <form
            data-testid="form-submit"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <Grid container spacing={2} alignItems={"center"}>
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
                          fullWidth
                          label="สถานะ"
                          options={APPLICATION_RECORD_BROKER_STATUS}
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
                  label="เลขทะเบียน"
                  margin="dense"
                  size="small"
                  {...register(`broker_license_number`)}
                  error={Boolean(errors?.broker_license_number)}
                  inputProps={{ maxLength: 100 }}
                  InputLabelProps={{
                    shrink: watch(`broker_license_number`),
                  }}
                />
                <FormHelperText error={errors?.broker_license_number}>
                  {errors?.broker_license_number?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="อีเมล"
                  margin="dense"
                  size="small"
                  {...register(`broker_email`)}
                  error={Boolean(errors?.broker_email)}
                  inputProps={{ maxLength: 100 }}
                  InputLabelProps={{
                    shrink: watch(`broker_email`),
                  }}
                />
                <FormHelperText error={errors?.broker_email}>
                  {errors?.broker_email?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  margin="dense"
                  size="small"
                  {...register(`c_subbusiness_line`)}
                  error={Boolean(errors?.c_subbusiness_line)}
                  inputProps={{ maxLength: 100 }}
                  InputLabelProps={{
                    shrink: watch(`c_subbusiness_line`),
                  }}
                />
                <FormHelperText error={errors?.c_subbusiness_line}>
                  {errors?.c_subbusiness_line?.message}
                </FormHelperText>
              </Grid>
            </Grid>
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
                          disabled={!watch("fromCreateDate")}
                          readOnly={!watch("fromCreateDate")}
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
                          disabled={!watch("fromUpdateDate")}
                          readOnly={!watch("fromUpdateDate")}
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
            getRowId={(row) => row.i_subbusiness_line}
            rows={data}
            rowCount={data[0]?.total_records || 0}
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

export default PageBrokerList;
