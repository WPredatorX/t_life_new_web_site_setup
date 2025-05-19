"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Button,
  useTheme,
  TextField,
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
import { Transform, Yup } from "@utilities";
import {
  useAppForm,
  useAppSnackbar,
  useAppSelector,
  useAppFeatureCheck,
} from "@hooks";
import { APPLICATION_DEFAULT, APPLICATION_PROMOTION_STATUS } from "@constants";
import { format, addYears, parseISO } from "date-fns";
import {
  Edit,
  Check,
  Delete,
  Search,
  RestartAlt,
  RemoveRedEye,
} from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { AppManagePromotion } from ".";

const AppPromotion = () => {
  const defaultSortField = "create_date";
  const defaultSortDirection = "desc";
  const { handleSnackAlert } = useAppSnackbar();
  const { promotionCode: globalPromotionCode } = useAppSelector(
    (state) => state.global
  );
  const [loading, setLoading] = useState(false);
  const [promotion, setPromotion] = useState([]);
  const [openManagePromotion, setOpenManagePromotion] = useState(false);
  const [openManagePromotionMode, setOpenManagePromotionNode] = useState(false);
  const [openManagePromotionInitialData, setOpenManagePromotionInitialData] =
    useState(null);
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  const [pageNumber, setPageNumber] = useState(
    APPLICATION_DEFAULT.dataGrid.pageNumber
  );
  const [pageSize, setPageSize] = useState(
    APPLICATION_DEFAULT.dataGrid.pageSize
  );
  const { validFeature: grantRead } = useAppFeatureCheck([
    "direct.promotion.read",
  ]);
  const { validFeature: grantEdit } = useAppFeatureCheck([
    "direct.promotion.write",
  ]);
  const { validFeature: grantRequest } = useAppFeatureCheck([
    "direct.promotion.request",
  ]);
  const { validFeature: grantApprove } = useAppFeatureCheck([
    "direct.promotion.approve",
  ]);
  const { validFeature: grantDrop } = useAppFeatureCheck([
    "direct.promotion.drop",
  ]);

  const validationSchema = Yup.object().shape({
    status: Yup.mixed().nullable(),
    promotionCode: Yup.string().nullable(),
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

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      status: null,
      promotionCode: globalPromotionCode,
      fromCreateDate: null,
      toCreateDate: null,
      fromUpdateDate: null,
      toUpdateDate: null,
    },
  });

  const {
    reset,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const hiddenColumn = {
    id: false,
  };

  const columns = useMemo(
    () => [
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
        renderCell: (params) => {
          return (
            <AppStatus
              type="1"
              status={params.value}
              statusText={params?.row?.promotion_status_name}
            />
          );
        },
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
            date =
              typeof value === "string" ? parseISO(value) : new Date(value);
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
            date =
              typeof value === "string" ? parseISO(value) : new Date(value);
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
          const allowView = true;
          const allowEdit =
            params?.row?.promotion_status === 1 || // แบบร่าง
            params?.row?.promotion_status === 4 || // ยกเลิกใช้งาน
            params?.row?.promotion_status === 5; // ไม่อนุมัติ
          const allowApprove = params?.row?.promotion_status === 2; // ขออนุมัติ
          const allowDrop = params?.row?.promotion_status === 3; // เปิดใช้งาน
          let viewFunction = null;
          let editFunction = null;
          let approveFunction = null;
          let deleteFunction = null;

          if (allowView)
            viewFunction = () => handleOpenManage(params?.row, "view");

          if (allowEdit)
            editFunction = () => handleOpenManage(params?.row, "edit");

          if (allowApprove)
            approveFunction = () => handleOpenManage(params?.row, "approve");

          if (allowDrop)
            deleteFunction = () => handleOpenManage(params?.row, "drop");

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
                disabled={!allowView}
                onClick={viewFunction}
              />
            );
          }

          if (grantEdit && allowEdit) {
            actions.push(
              <GridActionsCellItem
                key={`edit_${id}`}
                icon={<Edit />}
                {...defaultProps}
                label="แก้ไขรายละเอียด"
                onClick={editFunction}
              />
            );
          }

          if (grantApprove && allowApprove) {
            actions.push(
              <GridActionsCellItem
                key={`Approve_${id}`}
                icon={<Check />}
                {...defaultProps}
                label="พิจารณาอนุมัติ"
                onClick={approveFunction}
              />
            );
          }

          if (grantDrop && allowDrop) {
            actions.push(
              <GridActionsCellItem
                key={`delete_${id}`}
                icon={<Delete />}
                {...defaultProps}
                label="ยกเลิกใช้งาน"
                onClick={deleteFunction}
              />
            );
          }

          return actions;
        },
      },
    ],
    []
  );

  const handleOpenManage = (row, mode) => {
    setOpenManagePromotionInitialData(row);
    setOpenManagePromotionNode(mode);
    setOpenManagePromotion(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await handleFetchPromotion();
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPromotion = async () => {
    setLoading(true);

    try {
      const body = {
        promotion_code: watch("promotionCode"),
        create_date_start: watch("fromCreateDate"),
        create_date_end: watch("toCreateDate"),
        update_date_start: watch("fromUpdateDate"),
        update_date_end: watch("toUpdateDate"),
        field: Transform.snakeToPascalCase(sortField),
        direction: sortDirection,
        page_number: pageNumber,
        page_size: pageSize,
        promotion_status: watch("status")?.value,
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

      setPromotion(resultData);
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด" + error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = async () => {
    reset({
      status: null,
      promotionCode: "",
      fromCreateDate: null,
      toCreateDate: null,
      fromUpdateDate: null,
      toUpdateDate: null,
    });
    await handleFetchPromotion();
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

  useEffect(() => {
    handleFetchPromotion();
  }, [openManagePromotion]);

  useEffect(() => {
    handleFetchPromotion();
  }, [pageNumber, pageSize, sortField, sortDirection]);

  return (
    <Grid container justifyContent={"center"} my={2}>
      <AppManagePromotion
        mode={openManagePromotionMode}
        open={openManagePromotion}
        setOpen={setOpenManagePromotion}
        initialData={openManagePromotionInitialData}
      />

      <Grid item xs={11.6}>
        <AppCard
          title={`โปรโมชั่นทั้งหมด`}
          cardstyle={{ border: "1px solid grey" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
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
                          options={APPLICATION_PROMOTION_STATUS}
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
                  {...register(`promotionCode`)}
                  error={Boolean(errors?.promotionCode)}
                  inputProps={{ maxLength: 100 }}
                />
                <FormHelperText error={errors?.promotionCode}>
                  {errors?.promotionCode?.message}
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
                          minDate={new Date(watch("fromCreateDate"))}
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
                          minDate={new Date(watch("fromUpdateDate"))}
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
            <Grid container spacing={2} justifyContent={"end"} mb={2}>
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
          </form>
          <Grid item xs={12} sx={{ height: "25rem" }}>
            <AppDataGrid
              rows={promotion}
              rowCount={promotion?.[0]?.total_records}
              columns={columns}
              loading={loading}
              hiddenColumn={hiddenColumn}
              pageNumber={pageNumber}
              pageSize={pageSize}
              sortField={sortField}
              sortDirection={sortDirection}
              onPaginationModelChange={handlePageModelChange}
              onSortModelChange={handleSortModelChange}
            />
          </Grid>
        </AppCard>
      </Grid>
    </Grid>
  );
};

export default AppPromotion;
