import { useState, useEffect, useRef } from "react";
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
  MenuList,
  Popper,
  Paper,
  MenuItem,
  ClickAwayListener,
  Menu,
} from "@mui/material";
import {
  AppCard,
  AppDataGrid,
  AppStatus,
  AppAutocomplete,
  AppDatePicker,
  AppCollapseCard,
  AppCardWithTab,
} from "@/components";
import { Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Transform, Yup } from "@utilities";
import { useAppSnackbar, useAppRouter, useAppForm } from "@hooks";
import { APPLICATION_DEFAULT } from "@constants";
import { format, addYears, addDays, parseISO } from "date-fns";
import {
  RemoveRedEye,
  Edit,
  Search,
  RestartAlt,
  ExpandMore,
  ArrowDropDown,
  Check,
  Delete,
} from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { AppProductListItem } from ".";
const AppProductList = ({ mode }) => {
  const router = useAppRouter();
  const { handleSnackAlert } = useAppSnackbar();
  const theme = useTheme();

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
  const [dataSub, setDataSub] = useState({
    rows: [],
    totalRows: 0,
  });
  const [tabContentP, setTabContent] = useState();
  const [tabLabelP, setTabLabel] = useState();

  const {
    reset,
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      status: null,
      name: "",
      fromCreateDate: addDays(new Date(), -7),
      toCreateDate: new Date(),
      fromUpdateDate: null,
      toUpdateDate: null,
      fromInsuredSum: null,
      ToInsuredSum: null,
    },
  });
  const hiddenColumn = {
    id: false,
  };

  const mainColumn = [
    {
      field: "id",
    },

    {
      flex: 1,
      field: "name",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อผลิตภัณฑ์",
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
        <AppStatus
          status={params.row.is_active}
          statusText={params.row.name_status}
        />
      ),
    },
    {
      flex: 1,
      field: "min_coverage_amount",
      type: "string",
      headerAlign: "center",
      headerName: "ทุนประกันต่ำสุด",
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
      headerName: "ทุนประกันต่ำสุด",
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
          let formattedValue = format(
            addYears(parseISO(value), 543),
            "dd/MM/yyyy"
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
            "dd/MM/yyyy"
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
        const saleChannelId = params?.row?.product_sale_channel_id;
        let disabledView = false; // TODO: เช็คตามสิทธิ์
        let disabledEdit = false; // TODO: เช็คตามสิทธิ์
        const viewFunction = disabledView
          ? null
          : () => router.push(`/productsale/${id}?mode=VIEW&type=0&saleChannelId=${saleChannelId}`);
        const editFunction = disabledEdit
          ? null
          : () => router.push(`/productsale/${id}?mode=EDIT&type=0&saleChannelId=${saleChannelId}`);

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
            key={`approveProduct_${id}`}
            icon={<Check />}
            {...defaultProps}
            label="อนุมัติข้อมูลทั่วไปผลิตภัณฑ์"
          />,
          <GridActionsCellItem
            key={`approvePreview_${id}`}
            icon={<Check />}
            {...defaultProps}
            label="อนุมัติการแเสดงผลผลิตภัณฑ์"
          />,
          <GridActionsCellItem
            key={`approvePreview_${id}`}
            icon={<Delete />}
            {...defaultProps}
            label="ยกเลิกการใช้งาน"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    handleFetchProduct();
  }, [pageNumber, pageSize]);

  useEffect(() => {
    if (!loading) {
      setTab();
    }
  }, [data, dataSub]);

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
        is_active: true,
        c_plan: watch(`name`) ? watch(`name`) : null,
        min_coverage_amount: watch(`fromInsuredSum`),
        max_coverage_amount: watch(`ToInsuredSum`),
        create_date_start: null, //watch(`fromCreateDate`) ,
        create_date_end: null, //watch(`toCreateDate`),
        update_date_start: null, //watch(`fromUpdateDate`),
        update_date_end: null, //watch("toUpdateDate"),
      };

      const response = await fetch(
        `/api/direct?action=getAllProductSaleDirect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      if (data.status === 204) {
        handleSnackAlert({
          open: true,
          message: `ไม่พบข้อมูล`,
        });
      }
      else {
        const mapData = data[0].detail.map((item) => {
          return {
            ...item,
            id: item.product_plan_id,
            name: item.i_plan,
            status: item.product_status,
            statusText: item.name_status,
          };
        });
        setData({
          rows: mapData,
          totalRows: 100,
        });
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ล้มเหลวเกิดข้อผิดพลาด ${error}`,
      });
    } finally {
      handleFetchProductSub();
      setLoading(false);
    }
  };

  const handleFetchProductSub = async () => {
    setLoading(true);
    try {
      const start = pageNumber * pageSize;
      const limit = pageSize;
      const response = await fetch(`/api/direct?action=GetProductMainAndSub`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setDataSub({
        rows: data,
        totalRows: 100,
      });
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };

  const setDataTabs = () => {
    return (
      <Grid container rowGap={2}>
        {dataSub &&
          dataSub.rows.map((value, index) => (
            <AppProductListItem
              key={index}
              data={value}
              hiddenColumn={hiddenColumn}
            />
          ))}
      </Grid>
    );
  };

  const setDataTabsMain = () => {
    return (
      <Grid item xs={12} sx={{ height: "25rem" }}>
        <AppDataGrid
          rows={data.rows}
          rowCount={100}
          columns={mainColumn}
          hiddenColumn={hiddenColumn}
          pageNumber={APPLICATION_DEFAULT.dataGrid.pageNumber}
          pageSize={APPLICATION_DEFAULT.dataGrid.pageSize}
          onPaginationModelChange={handlePageModelChange}
        />
      </Grid>
    );
  };

  const setTab = () => {
    try {
      let Data = [setDataTabsMain(), setDataTabs()];
      let DataLabel = ["สัญญาหลัก", "สัญญาหลัก + สัญญาเพิ่มเติม"];
      setTabContent(Data);
      setTabLabel(DataLabel);
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ล้มเหลวเกิดข้อผิดพลาด ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent={"center"} my={2}>
      <Grid item xs={11.6}>
        <AppCard
          title={`ผลิตภัณฑ์ที่ขายทั้งหมดของ ${mode}`}
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
            {
              //#endregion
            }
            {
              //#region InsuredSum
            }
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                {/* เปลี่ยนเป็น number */}
                <TextField
                  fullWidth
                  label="จากทุนประกันต่ำสุด"
                  margin="dense"
                  size="small"
                  id={`fromInsuredSum`}
                  {...register(`fromInsuredSum`)}
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
                  label="ถึงทุนประกันต่ำสุด"
                  margin="dense"
                  size="small"
                  id={`ToInsuredSum`}
                  {...register(`ToInsuredSum`)}
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
                  label="จากทุนประกันสูงสุด"
                  margin="dense"
                  size="small"
                  id={`fromInsuredSum`}
                  {...register(`fromInsuredSum`)}
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
                  label="ถึงทุนประกันสูงสุด"
                  margin="dense"
                  size="small"
                  id={`ToInsuredSum`}
                  {...register(`ToInsuredSum`)}
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
                  onClick={handleSubmit(onSubmit)}
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
          <AppCardWithTab
            tabContent={tabContentP}
            tabLabels={tabLabelP}
            cardstyle={{
              border: "1px solid",
              borderColor: "#e7e7e7",
            }}
          />
        </AppCard>
      </Grid>
    </Grid>
  );
};
export default AppProductList;
