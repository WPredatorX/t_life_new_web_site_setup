"use client";

import { useState, useEffect, useMemo, useRef, createRef } from "react";
import {
  Card,
  Grid,
  Button,
  Switch,
  useTheme,
  Collapse,
  Accordion,
  TextField,
  InputLabel,
  FormHelperText,
  InputAdornment,
  AccordionDetails,
  FormControlLabel,
  AccordionSummary,
  CircularProgress,
} from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { ArrowDropDown, RemoveRedEye, Edit, Delete } from "@mui/icons-material";
import {
  AppCard,
  AppStatus,
  AppWyswig,
  AppLoadData,
  AppDataGrid,
  AppAutocomplete,
} from "@components";
import { Yup } from "@utilities";
import {
  APPLICATION_CONTENT_FILE_TYPE,
  APPLICATION_CONFIGURATION,
} from "@constants";
import {
  useAppForm,
  useAppRouter,
  useAppDialog,
  useAppScroll,
  useAppSnackbar,
  useAppSelector,
  useAppFieldArray,
  useAppGridApiRef,
  useAppFeatureCheck,
  useAppSearchParams,
} from "@hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";
import { format, addYears, parseISO } from "date-fns";
import { PageProductDisplayVersionManage, PageRejectComponent } from ".";
import NextImage from "next/image";
import ReactPlayer from "react-player";

const PageProductDisplay = ({
  mode,
  type,
  channel,
  productId,
  saleChannelId,
  productCondition,
}) => {
  const theme = useTheme();
  const router = useAppRouter();
  const dataGridApiRef = useAppGridApiRef();
  const { handleSnackAlert } = useAppSnackbar();
  const { handleNotification } = useAppDialog();
  const { handleScrollTo } = useAppScroll();
  const { brokerId, activator, sasToken } = useAppSelector(
    (state) => state.global
  );
  const [loadingVersion, setLoadingVersion] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailMode, setDetailMode] = useState("view");
  const [openManage, setOpenManage] = useState(false);
  const [openManageMode, setOpenManageMode] = useState("create");
  const [selectionModel, setSelectionModel] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});
  const [loadBrochure, setLoadBrochure] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const brochureRef = useRef();
  const bannerRef = useRef();
  const cardRef = useRef();
  const benefitRef = useRef();
  const {
    documentFileAccept,
    documentFileExtension,
    defaultFileAccept,
    defaultFileExtension,
  } = APPLICATION_CONFIGURATION;

  const { validFeature: grantRead } = useAppFeatureCheck([
    "direct.product.display.read",
    "broker.product.display.read",
  ]);

  const { validFeature: grantEdit } = useAppFeatureCheck([
    "direct.product.display.write",
    "broker.product.display.write",
  ]);

  const { validFeature: grantDrop } = useAppFeatureCheck([
    "direct.product.display.drop",
    "broker.product.display.drop",
  ]);

  const { validFeature: grantRequest } = useAppFeatureCheck([
    "direct.product.display.request",
    "broker.product.display.request",
  ]);

  const { validFeature: grantApprove } = useAppFeatureCheck([
    "direct.product.display.approve",
    "broker.product.display.approve",
  ]);

  const validationSchema = Yup.object().shape({
    displayVersion: Yup.array().of(Yup.mixed()),
    displayVersionTemp: Yup.array().of(Yup.mixed()),
    displayVersionDetail: Yup.object()
      .shape({
        actionType: Yup.string(),
        main: Yup.mixed().nullable(),
        popularity: Yup.bool(),
        name: Yup.string(),
        caption: Yup.string()
          .when("actionType", {
            is: "edit",
            then: (schema) => schema.required(),
          })
          .preventSpace("ต้องไม่เป็นค่าว่าง"),
        description: Yup.string()
          .when("actionType", {
            is: "edit",
            then: (schema) => schema.required(),
          })
          .preventSpace("ต้องไม่เป็นค่าว่าง"),
        cardDescription: Yup.string()
          .when("actionType", {
            is: "edit",
            then: (schema) => schema.required(),
          })
          .preventSpace("ต้องไม่เป็นค่าว่าง"),
        remark: Yup.string(),
        url: Yup.string(),
        urlWithParams: Yup.string(),

        // banner
        bannerImage: Yup.mixed().nullable(),
        bannerImageUrl: Yup.string(),
        bannerImageName: Yup.string().required(),
        bannerImageString: Yup.string(),
        bannerImageUrlPreview: Yup.string(),

        // card
        cardImage: Yup.mixed().nullable(),
        cardImageUrl: Yup.string(),
        cardImageName: Yup.string().required(),
        cardImageString: Yup.mixed(),
        cardImageUrlPreview: Yup.string(),

        // benefit
        benefitImage: Yup.mixed().nullable(),
        benefitImageUrl: Yup.string(),
        benefitImageName: Yup.string().required(),
        benefitImageString: Yup.string(),
        benefitImageUrlPreview: Yup.string(),

        // brochure
        brochureFile: Yup.mixed().nullable(),
        brochureFileUrl: Yup.string(),
        brochureFileName: Yup.string(),
        brochureFileString: Yup.string(),
        brochureFileUrlPreview: Yup.string(),

        status: Yup.string().nullable(),
        rejectReason: Yup.string().nullable(),
      })
      .nullable(),
    displayProductDetail: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required(),
        fullWidth: Yup.bool(),
        fileType: Yup.mixed().required(),
        fileName: Yup.string()
          .nullable()
          .when("fileType.value", {
            is: (value) => value === "0",
            then: (schema) => schema.required(),
          }),
        fileUrl: Yup.string()
          .nullable()
          .when("fileType.value", {
            is: (value) => value === "1",
            then: (schema) => schema.required(),
          }),
        fileItem: Yup.mixed().nullable(),
        fileString: Yup.string().nullable(),
        filePreviewUrl: Yup.string().nullable(),
        conditionTitle: Yup.string().when("fullWidth", {
          is: false,
          then: (schema) => schema.required(),
        }),
        htmlDescription: Yup.string()
          .when("fullWidth", {
            is: (value) => {
              return !value;
            },
            then: (schema) => schema.required(),
          })
          .when("fileType", {
            is: (value) => {
              return value?.id === "2";
            },
            then: (schema) => schema.required(),
          }),
      })
    ),
  });

  const {
    watch,
    reset,
    trigger,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      displayVersion: [],
      displayVersionTemp: [],
      displayVersionDetail: {
        actionType: "view",
        popularity: false,
        caption: "",
        description: "",
        cardDescription: "",
        url: "",
        urlWithParams: "",
        bannerImageUrl: "",
        bannerImageName: "",
        bannerImageUrlPreview: "",
        cardImageUrl: "",
        cardImageName: "",
        cardImageUrlPreview: "",
        benefitImageUrl: "",
        benefitImageName: "",
        benefitImageUrlPreview: "",
        brochureFile: null,
        brochureFileUrl: "",
        brochureFileName: "",
        brochureFileString: "",
        brochureFileUrlPreview: "",
      },
      displayProductDetail: [],
    },
  });

  const { fields, append, update, remove } = useAppFieldArray({
    name: "displayProductDetail",
    control: control,
  });

  const watchedData = watch("displayVersion");
  const watchDetail = watch("displayVersionDetail");
  const watchedDataTemp = watch("displayVersionTemp");

  const allowPreview = useMemo(() => {
    //แบบร่าง, ขออนุมัติ, เปิดใช้งาน
    const allowList = ["1", "2", "3"];
    if (!watchDetail?._temp?.sale_card_status) {
      return false;
    }

    if (selectionModel?.length < 1) {
      return false;
    }

    return allowList.includes(watchDetail?._temp?.sale_card_status);
  }, [watchDetail, selectionModel]);

  const versionWaitForApprove = useMemo(() => {
    return watchDetail?._temp?.sale_card_status === "2";
  }, [watchDetail]);

  const showOperationButton = useMemo(() => {
    return (
      watchDetail == null ||
      watchDetail._copy === true ||
      !watchDetail._temp ||
      watchDetail._temp.sale_card_status === "1" ||
      watchDetail._temp.sale_card_status === "5"
    );
  }, [watchDetail]);

  const preventAddVersion = useMemo(() => {
    if (watchedDataTemp?.length > 0) {
      return true;
    }

    if (
      watchedData.some(
        (item) =>
          item?.sale_card_status === "1" ||
          item?.sale_card_status === "2" ||
          item?.sale_card_status === "5"
      )
    ) {
      return true;
    }
  }, [watchedData, watchedDataTemp]);

  const rowsDisplay = useMemo(() => {
    const tempData = watchedDataTemp ?? [];
    const rowData = watchedData ?? [];

    // 1. Merge ของเก่า
    const merged = rowData.map((item) => {
      const override = tempData.find(
        (i) => i.product_sale_card_id === item.product_sale_card_id
      );
      return override ? { ...item, ...override } : item;
    });

    // 2. หาตัวใหม่จาก temp ที่ยังไม่มีใน rowData
    const newItems = tempData.filter(
      (item) =>
        !rowData.some(
          (r) => r.product_sale_card_id === item.product_sale_card_id
        )
    );

    // 3. รวมทั้งหมด
    return [...merged, ...newItems];
  }, [watchedData, watchedDataTemp]);

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
        field: "version_name",
        type: "string",
        headerAlign: "center",
        headerName: "ชื่อ",
        headerClassName: "header-main",
        align: "center",
        minWidth: 200,
        sortable: !isDirty,
      },
      {
        flex: 1,
        field: "sale_card_status_name",
        type: "string",
        headerAlign: "center",
        headerName: "สถานะ",
        headerClassName: "header-main",
        align: "center",
        minWidth: 200,
        renderCell: (params) => (
          <AppStatus
            type="4"
            status={params.row.sale_card_status}
            statusText={params.row.sale_card_status_name}
          />
        ),
        sortable: !isDirty,
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
        sortable: !isDirty,
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
        // valueGetter: (value) => {
        //   if (!value) return "";

        //   try {
        //     let date;
        //     date =
        //       typeof value === "string" ? parseISO(value) : new Date(value);
        //     if (isNaN(date.getTime())) return value;
        //     let formattedValue = format(
        //       addYears(date, 543),
        //       "dd/MM/yyyy HH:mm:ss"
        //     );
        //     return formattedValue;
        //   } catch (error) {
        //     return value;
        //   }
        // },
        sortable: !isDirty,
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
        sortable: !isDirty,
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
        // valueGetter: (value) => {
        //   if (!value) return "";
        //   try {
        //     let date;
        //     date =
        //       typeof value === "string" ? parseISO(value) : new Date(value);
        //     if (isNaN(date.getTime())) return value;
        //     let formattedValue = format(
        //       addYears(date, 543),
        //       "dd/MM/yyyy HH:mm:ss"
        //     );
        //     return formattedValue;
        //   } catch (error) {
        //     return value;
        //   }
        // },
        sortable: !isDirty,
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
          const id = params?.row?.product_sale_card_id;
          const tempRow = params?.row?.is_new;
          const viewLoading = loadingMap[id]?.view || false;
          const editLoading = loadingMap[id]?.edit || false;
          const dropLoading = loadingMap[id]?.drop || false;
          const isDropped = params?.row?.sale_card_status === "4";
          const hasTemp = watchedDataTemp.length > 0;
          const rowEffective = params?.row?.sale_card_status === "3";
          const waitingForApprove = params?.row?.sale_card_status === "2";

          let disableView =
            viewLoading || editLoading || dropLoading || hasTemp;
          let disableEdit =
            viewLoading || editLoading || dropLoading || hasTemp;
          let disableDrop =
            viewLoading || editLoading || dropLoading || hasTemp;
          let viewFunction = () => handleRowSelection(params?.row, "view");
          let editFunction = () => handleRowSelection(params?.row, "edit");
          let dropFunction = () => handleRowSelection(params?.row, "drop");

          if (tempRow) {
            disableDrop = false;
          }

          const defaultProps = {
            showInMenu: false,
            sx: {
              "&.Mui-disabled": {
                pointerEvents: "all",
              },
            },
          };

          let actions = [];
          if (!tempRow && grantRead) {
            actions.push(
              <GridActionsCellItem
                key={`view_${id}`}
                disabled={disableView}
                icon={
                  viewLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <RemoveRedEye />
                  )
                }
                {...defaultProps}
                label="ดูรายละเอียด"
                title="คลิกเพื่อดูรายละเอียด"
                onClick={viewFunction}
              />
            );
          }

          if (
            !isDropped &&
            !tempRow &&
            !waitingForApprove &&
            !rowEffective &&
            grantEdit
          ) {
            actions.push(
              <GridActionsCellItem
                key={`edit_${id}`}
                disabled={disableEdit}
                icon={editLoading ? <CircularProgress size={20} /> : <Edit />}
                {...defaultProps}
                label="แก้ไขรายละเอียด"
                title="คลิกเพื่อแก้ไขรายละเอียด"
                onClick={editFunction}
              />
            );
          }

          if (
            (!isDropped && !waitingForApprove && !rowEffective && grantDrop) ||
            tempRow
          ) {
            actions.push(
              <GridActionsCellItem
                key={`drop_${id}`}
                disabled={disableDrop}
                icon={dropLoading ? <CircularProgress size={20} /> : <Delete />}
                {...defaultProps}
                label="ยกเลิกการใช้งาน"
                title="คลิกเพื่อยกเลิกการใข้งาน"
                onClick={dropFunction}
              />
            );
          }

          return actions;
        },
      },
    ],
    [isDirty, loadingMap, watchedDataTemp]
  );

  const handleReset = () => {
    reset();
  };

  const setRowLoading = (rowId, actionKey, isLoading) => {
    setLoadingMap((prev) => ({
      ...prev,
      [rowId]: {
        ...(prev[rowId] || {}),
        [actionKey]: isLoading,
      },
    }));
  };

  const handleRowSelection = (row, mode) => {
    // ถ้าเป็นการยกเลิกไม่ต้อง select ให้ปรับสถานะเลย และถ้าเป็นรายการใหม่ก็เอาออกจาก selection model ด้วย
    if (mode === "drop") {
      handleRowDrop(row);
    } else {
      setSelectionModel((prevSelection) => {
        const selectedId = row?.product_sale_card_id;
        if (prevSelection.includes(selectedId)) {
          setValue("displayVersionDetail", null);
          return [];
        } else {
          // ถ้าไม่ใช้ temp ให้โหลดข้อมูลและแสดงการโหลด
          if (!row.is_new) {
            setRowLoading(row?.product_sale_card_id, mode, true);
          }
          return [selectedId];
        }
      });

      setValue("displayVersionDetail.actionType", mode);
      setDetailMode(mode);
    }
  };

  const handleRowDrop = (row) => {
    handleNotification(
      "คุณต้องการยกเลิกรายการนี้หรือไม่ ?",
      () => {
        const tempData = watch("displayVersionTemp");
        const isTemp = tempData.some(
          (item) => item.product_sale_card_id === row.product_sale_card_id
        );

        if (isTemp) {
          // เอาออกจาก temp array ไปเลย
          const newTempData = tempData.filter(
            (item) => item.product_sale_card_id !== row.product_sale_card_id
          );

          setValue("displayVersionTemp", [...newTempData]);
          setSelectionModel([]);
        } else {
          const deleteRow = {
            ...row,
            sale_card_status: "4",
            sale_card_status_name: "ยกเลิกใช้งาน",
            update_date: new Date(),
            update_by: activator,
          };
          handleAddOrUpdateVersion(deleteRow, "drop");
        }
      },
      null,
      "question"
    );
  };

  const handleFetchVersion = async () => {
    setLoadingVersion(true);

    try {
      const payload = {
        direction: "desc",
        product_sale_channel_id: saleChannelId,
      };
      const response = await fetch(
        `/api/direct?action=GetProductSaleCardListById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      const mappedData = Array.from(data || []).map((item) => {
        return {
          ...item,
          is_new: false,
        };
      });
      reset({
        displayVersion: mappedData,
        displayVersionTemp: [],
      });
      dataGridApiRef?.current?.setSortModel([
        { field: "create_date", sort: "desc" },
      ]);
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoadingVersion(false);
    }
  };

  const handleFetchVersionDetail = async (id) => {
    setLoadingDetail(true);

    try {
      const currentValue = watch();
      const row = dataGridApiRef?.current?.getRow(id);
      const cardId = row?.is_copy
        ? row.copy_version?.id
        : row?.is_new
        ? null
        : row?.product_sale_card_id;

      if (row?.is_copy || !row?.is_new) {
        // #region โหลดข้อมูลกลุ่มแบบประกัน
        const mainList = await handleFetchInsuranceGroup();
        // #endregion

        // #region โหลดข้อมูลทั่วไป
        const payloadGeneral = {
          product_sale_card_id: cardId,
        };
        const responseGeneral = await fetch(
          `/api/direct/productSale/profile?action=GetProductSaleCardByProductSaleId`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadGeneral),
          }
        );
        const dataGeneral = await responseGeneral.json();
        // #endregion

        // #region โหลดข้อมูลคอนเท้น
        const payloadContent = {
          product_sale_card_id: cardId,
        };
        const responseContent = await fetch(
          `/api/direct/productSale/profile?action=GetContentSectionItemsById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadContent),
          }
        );
        const dataContent = await responseContent.json();
        const mappedDataContent = Array.from(dataContent).map((item) => {
          const previewUrl =
            item?.content_item_file_type === "0"
              ? `${item?.section_content_item}${sasToken?.sas_images}`
              : item?.section_content_item;

          return {
            _temp: { ...item },
            title: item?.section_name ?? "",
            conditionTitle: item?.condition_title ?? "",
            fullWidth: item?.is_full,
            fileType:
              APPLICATION_CONTENT_FILE_TYPE.find(
                (typeItem) => typeItem.value === item?.content_item_file_type
              ) ?? null,
            fileName: item?.content_item_file_name ?? "",
            fileUrl: item?.section_content_item ?? "",
            fileItem: null,
            filePreviewUrl: previewUrl ?? "",
            htmlDescription: item?.description ?? "",
          };
        });
        // #endregion

        // #region วางข้อมูล default ของส่วน detail แต่คงข้อมูล main เอาไว้
        const preparedData = {
          displayVersionDetail: {
            _temp: { ...dataGeneral },
            ...(row?.is_copy && { _copy: true }),
            main:
              Array.from(mainList).find(
                (mainItem) =>
                  mainItem?.id?.toLowerCase() ===
                  dataGeneral?.main_id?.toLowerCase()
              ) ?? null,
            actionType: row?.is_copy ? "edit" : "view",
            popularity: Boolean(dataGeneral?.tag_sale) ?? false,
            name: dataGeneral?.title ?? "",
            caption: dataGeneral?.sub_title ?? "",
            description: dataGeneral?.description_banner ?? "",
            cardDescription: dataGeneral?.description ?? "",
            remark: dataGeneral?.remark_marketing_name ?? "",
            url: dataGeneral?.buy_link_url ?? "",
            urlWithParams: dataGeneral?.more_link_url ?? "",
            bannerImageUrl: dataGeneral?.content_url_banner_product ?? "",
            bannerImageName: dataGeneral?.content_url_banner_product_name ?? "",
            bannerImageUrlPreview: dataGeneral?.content_url_banner_product
              ? `${dataGeneral.content_url_banner_product}${
                  sasToken?.sas_images ?? ""
                }`
              : "",
            cardImageUrl: dataGeneral?.content_url_product ?? "",
            cardImageName: dataGeneral?.content_url_product_name ?? "",
            cardImageUrlPreview: dataGeneral?.content_url_product
              ? `${dataGeneral.content_url_product}${
                  sasToken?.sas_images ?? ""
                }`
              : "",
            benefitImageUrl: dataGeneral?.beneficiary_content_url ?? "",
            benefitImageName: dataGeneral?.beneficiary_content_url_name ?? "",
            benefitImageUrlPreview: dataGeneral?.beneficiary_content_url
              ? `${dataGeneral.beneficiary_content_url}${
                  sasToken?.sas_images ?? ""
                }`
              : "",
            brochureFileUrl: dataGeneral?.brochure_document_file_path ?? "",
            brochureFileName: dataGeneral?.brochure_document_name ?? "",
            brochureFileUrlPreview: dataGeneral?.brochure_document_file_path
              ? `${dataGeneral.brochure_document_file_path}${
                  sasToken?.sas_files ?? ""
                }`
              : "",
            status: dataGeneral?.sale_card_status,
            rejectReason: productCondition?.marketting_status_message ?? "",
          },
          displayProductDetail: [...mappedDataContent],
        };

        reset({
          ...currentValue,
          ...preparedData,
        });
        // #endregion
      } else {
        // ทำข้อมูลตั้งต้นของ temp
        reset({
          displayVersion: [...currentValue?.displayVersion],
          displayVersionTemp: [...currentValue?.displayVersionTemp],
          displayProductDetail: [],
          displayVersionDetail: {
            actionType: "edit",
            popularity: false,
            caption: "",
            description: "",
            cardDescription: "",
            url: "",
            urlWithParams: "",
            bannerImageUrl: "",
            bannerImageName: "",
            bannerImageUrlPreview: "",
            cardImageUrl: "",
            cardImageName: "",
            cardImageUrlPreview: "",
            benefitImageUrl: "",
            benefitImageName: "",
            benefitImageUrlPreview: "",
            brochureFile: null,
            brochureFileUrl: "",
            brochureFileName: "",
            brochureFileString: "",
            brochureFileUrlPreview: "",
          },
        });
      }

      // เลื่อนหน้าจอ
      setTimeout(() => handleScrollTo("detail-anchor", 300), 0);
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ล้มเหลวเกิดข้อผิดพลาด : " + error,
      });
    } finally {
      setLoadingDetail(false);
      setRowLoading(id, "view", false);
      setRowLoading(id, "edit", false);
    }
  };

  const handleAddOrUpdateVersion = (data, mode = "edit") => {
    let updated;
    debugger;
    const currentValue = watch("displayVersionTemp") ?? [];
    const existsIndex = currentValue.findIndex(
      (item) => item.product_sale_card_id === data.product_sale_card_id
    );
    if (existsIndex > -1) {
      // กรณี create ซ้ำ หรือ edit
      updated = [...currentValue];
      updated[existsIndex] = { ...updated[existsIndex], ...data };
    } else {
      // เพิ่มใหม่ หรือแก้ไขจากของจริง
      updated = [...currentValue, data];
    }

    setValue("displayVersionTemp", updated);
    setValue("displayVersionDetail.actionType", "edit");
    if (mode === "drop") {
      handleSaveVersion({ ...data, sale_card_status: "4" }, false, "4");
      return;
    }

    let loadDataId = data?.product_sale_card_id;
    setDetailMode(mode);
    setSelectionModel([loadDataId]);
  };

  const handleCopyClipboard = async (link) => {
    await navigator.clipboard.writeText(link);
    handleSnackAlert({
      open: true,
      severity: "success",
      message: `คัดลอกลิ้งค์เรียบร้อยแล้ว`,
    });
  };

  const handlePreviewBrochure = async () => {
    setLoadBrochure(true);

    try {
      let blobUrl = "";
      if (watch("displayVersionDetail.brochureFile")) {
        blobUrl = URL.createObjectURL(
          watch("displayVersionDetail.brochureFile")
        );
      } else {
        const payload = {
          fileName: watch("displayVersionDetail.brochureFileName"),
          pdfUrl:
            watch("displayVersionDetail.brochureFileUrl") + sasToken?.sas_files,
        };
        const response = await fetch(
          `/api/direct/productSale/profile?action=PreviewBrochure`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) throw new Error();
        const blob = await response.blob();
        blobUrl = URL.createObjectURL(blob);
      }

      window.open(blobUrl, "_blank");
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: `ทำรายการไม่สำเร็จ`,
      });
    } finally {
      setLoadBrochure(false);
    }
  };

  const handleFileUpload = (
    event,
    prefix,
    base64Prop,
    nameProp,
    blobProp,
    previewProp,
    type = "0"
  ) => {
    const file = event.target.files[0];
    if (file) {
      if (type === "0") {
        // ตรวจสอบประเภทไฟล์
        if (!documentFileExtension.includes(file.type)) {
          handleSnackAlert({
            open: true,
            message: "กรุณาอัปโหลดไฟล์ PDF เท่านั้น",
            severity: "error",
          });
          return;
        }
      } else if (type === "1") {
        // ตรวจสอบประเภทไฟล์
        if (!defaultFileExtension.includes(file.type)) {
          handleSnackAlert({
            open: true,
            message: "กรุณาอัปโหลดไฟล์ .png, .jpg, .jpeg เท่านั้น",
            severity: "error",
          });
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        setValue(`${prefix}.${base64Prop}`, base64String, {
          shouldDirty: true,
        });
        setValue(`${prefix}.${nameProp}`, file.name, {
          shouldDirty: true,
        });
      };
      reader.readAsDataURL(file);

      setValue(`${prefix}.${blobProp}`, file, {
        shouldDirty: true,
      });
      if (type === "1") {
        const blobUrl = URL.createObjectURL(file);
        setValue(`${prefix}.${previewProp}`, blobUrl, {
          shouldDirty: true,
        });
      }
    }
  };

  const handleFetchInsuranceGroup = async () => {
    try {
      const payload = {
        i_subbusiness_line: channel,
      };
      const response = await fetch(
        `/api/direct/productSale/profile?action=GetMainProductSaleCardId`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      const mappedData = Array.from(data).map((item) => {
        return {
          _temp: { ...item },
          id: item?.main_id,
          label: item?.topic_mode,
          value: item?.main_id,
        };
      });
      return mappedData;
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    }
  };

  const handleSaveVersion = async (
    data,
    silent = false,
    versionStatus = null,
    saveDetail = true
  ) => {
    try {
      let versionId = null;
      const selectedId = selectionModel[0] ?? data?.product_sale_card_id;
      const row = dataGridApiRef?.current?.getRow(selectedId);
      const targetData = row;
      if (targetData) {
        // #region สร้างหรืออัพเดตเวอร์ชั่น
        versionId = targetData?.product_sale_card_id;
        const isDrop =
          targetData?.sale_card_status === "4" || versionStatus === "4";
        const payload = {
          ...targetData,
          is_active: true,
          create_by: activator,
          update_by: activator,
          version_name: targetData?.version_name,
          sale_card_status: versionStatus ? versionStatus : isDrop ? "4" : "1",
          product_sale_channel_id: saleChannelId,
        };
        const response = await fetch(
          `/api/direct/productSale/profile?action=AddOrUpdateProfileProductSaleCard`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const responseData = await response.json();

        // ถ้าเป็นการ create ให้ใช้ id ใหม่ที่ได้จาก response
        if (targetData?.is_new) {
          versionId = responseData;
        }
        // #endregion

        // จะบันทึกข้อมูล detail ก็ต่อเมื่อไม่เป็นการยกเลิก และ บันทึก detail
        if (!isDrop && saveDetail) {
          // #region สร้างหรืออัพเดตข้อมูลรายละเอียดเวอร์ชั่น
          const detailData = data?.displayVersionDetail;
          const payloadDetail = {
            tag_sale: detailData?.popularity ? "1" : "",
            is_active: true,
            create_by: activator,
            update_by: activator,
            product_sale_channel_id: saleChannelId,
            product_sale_card_id: versionId,
            title: productCondition?.title,
            sub_title: detailData?.caption,
            description: detailData?.cardDescription,
            buy_link_url: detailData?.url,
            more_link_url: detailData?.urlWithParams,
            ...(detailData?.benefitImageUrl && {
              beneficiary_content_url: detailData?.benefitImageUrl,
            }),
            ...(detailData?.benefitImageString && {
              beneficiary_content_url_file: detailData?.benefitImageString,
            }),
            beneficiary_content_url_name: detailData?.benefitImageName,

            ...(detailData?.cardImageUrl && {
              content_url_product: detailData?.cardImageUrl,
            }),
            ...(detailData?.cardImageString && {
              content_url_product_file: detailData?.cardImageString,
            }),
            content_url_product_name: detailData?.cardImageName,

            ...(detailData?.bannerImageUrl && {
              content_url_banner_product: detailData?.bannerImageUrl,
            }),
            ...(detailData?.bannerImageString && {
              content_url_banner_product_file: detailData?.bannerImageString,
            }),
            content_url_banner_product_name: detailData?.bannerImageName,
            description_banner: detailData?.description,

            ...(detailData?.brochureFileUrl && {
              brochure_document_file_path: detailData?.brochureFileUrl,
            }),
            ...(detailData?.brochureFileString && {
              brochure_document_file: detailData?.brochureFileString,
            }),
            brochure_document_name: detailData?.brochureFileName,

            main_id: detailData?.main?.id,
          };
          const responseDetail = await fetch(
            `/api/direct/productSale/profile?action=AddOrUpdateProfileProductSaleCard`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payloadDetail),
            }
          );
          const responseDetailData = await responseDetail.json();
          // #endregion

          // #region สร้างหรืออัพเดตข้อมูลรายละเอียดคอนแท้น
          if (data?.displayProductDetail?.length > 0) {
            const payloadDetailList = data?.displayProductDetail.map(
              (productDisplayItem, index) => {
                return {
                  is_active: true,
                  create_by: activator,
                  update_by: activator,
                  product_sale_channel_id: saleChannelId,
                  product_sale_card_id: versionId,
                  section_name: productDisplayItem?.title,
                  section_content: null,
                  tag_promotion: "1",
                  is_full: productDisplayItem?.fullWidth,
                  seq_content: index + 1,
                  title_item: productDisplayItem?.title,
                  section_content_item: productDisplayItem?.fileUrl,
                  content_item_file_name: productDisplayItem?.fileName,
                  content_item_file_type: productDisplayItem?.fileType?.value,
                  file_content_item: productDisplayItem?.fileString,
                  condition_title: productDisplayItem?.conditionTitle,
                  description: productDisplayItem?.htmlDescription,
                };
              }
            );
            const responseDetailList = await fetch(
              `/api/direct/productSale/profile?action=AddOrUpdateContentSection`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadDetailList),
              }
            );
            const responseDetailListData = await responseDetailList.json();
          } else {
            const payloadDeleteContentSection = {
              product_sale_channel_id: saleChannelId,
              product_sale_card_id: versionId,
            };
            const responseDeleteContentSection = await fetch(
              `/api/direct/productSale/profile?action=DeleteContentSection`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadDeleteContentSection),
              }
            );
            const responseDeleteContentSectionData =
              await responseDeleteContentSection.json();
          }
          // #endregion
        }

        if (!silent) {
          handleNotification(
            "บันทึกข้อมูลสำเร็จ",
            () => {
              window.location.reload();
            },
            null,
            "info",
            "ตกลง"
          );
        } else {
          return true;
        }
      }
    } catch (error) {
      handleNotification({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
      if (silent) {
        return false;
      }
    }
  };

  const handleRequestApprove = async () => {
    try {
      // #region บันทึกข้อมูลปัจจุบัน / อัพเดตสถานะของเวอร์ชั่นให้เป็นรออนุมัติ
      const currentData = watch();
      const silentSave = await handleSaveVersion(currentData, true, "2");
      // #endregion

      if (silentSave) {
        // #region อัพเดตสถานะรออนุมัติของการตลาด
        const markettingStatusPayload = {
          marketting_status: null,
          marketting_status_message: null,
          product_sale_channel_id: saleChannelId,
        };
        const markettingStatusResponse = await fetch(
          `/api/direct/productSale/profile?action=AddOrUpdateProductSaleStatusGroup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(markettingStatusPayload),
          }
        );
        if (markettingStatusResponse.status !== 200) {
          throw new Error();
        }
        // #endregion

        // #region ส่งอีเมลแจ้งขออนุมัติ
        const requestForApprovePayload = {
          type: 1,
          product_sale_channel_id: saleChannelId,
          product_plan_id: productId,
          mode: "DISPLAY_APPROVE",
          template_code: "01",
          channel: channel,
          broker_id: brokerId,
        };
        const requestForApproveResponse = await fetch(
          `/api/direct?action=ProductRecordApprove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestForApprovePayload),
          }
        );
        if (requestForApproveResponse.status !== 200) {
          throw new Error();
        }
        // #endregion
        handleNotification(
          "ทำการบันทึกและขออนุมัติสำเร็จ",
          () => handleBack(),
          null,
          "info",
          "ตกลง"
        );
      } else {
        throw new Error("");
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    }
  };

  const handleApprove = async () => {
    try {
      // #region บันทึกข้อมูลปัจจุบัน / อัพเดตสถานะของเวอร์ชั่นให้เป็นอนุมัติ
      const currentData = watch();
      const silentSave = await handleSaveVersion(currentData, true, "3", false);
      // #endregion

      if (silentSave) {
        // #region อัพเดตสถานะเปิดใช้งานของการตลาด
        const markettingStatusPayload = {
          marketting_status: "3",
          marketting_status_message: null,
          product_sale_channel_id: saleChannelId,
        };
        const markettingStatusResponse = await fetch(
          `/api/direct/productSale/profile?action=AddOrUpdateProductSaleStatusGroup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(markettingStatusPayload),
          }
        );
        if (markettingStatusResponse.status !== 200) {
          throw new Error();
        }
        // #endregion

        // #region ส่งอีเมลแจ้งอนุมัติ
        const detailVersion = currentData?.displayVersionDetail?._temp;
        const approvePayload = {
          type: 1,
          request_to: detailVersion?.create_by,
          product_sale_channel_id: saleChannelId,
          product_plan_id: productId,
          mode: "DISPLAY_APPROVE",
          template_code: "02",
          channel: channel,
          broker_id: brokerId,
        };
        const approveResponse = await fetch(
          `/api/direct?action=ProductRecordApprove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(approvePayload),
          }
        );
        if (approveResponse.status !== 200) {
          throw new Error();
        }

        // #endregion
        handleNotification(
          "ทำการอนุมัติสำเร็จ",
          () => handleBack(),
          null,
          "info",
          "ตกลง"
        );
      } else {
        throw new Error("");
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    }
  };

  const handleReject = async (reason) => {
    try {
      // #region บันทึกข้อมูลปัจจุบัน / อัพเดตสถานะของเวอร์ชั่นให้เป็นรออนุมัติ
      const currentData = watch();
      const silentSave = await handleSaveVersion(currentData, true, "5", false);
      // #endregion

      if (silentSave) {
        // #region อัพเดตสถานะเปิดใช้งานของการตลาด
        const markettingStatusPayload = {
          marketting_status: null,
          marketting_status_message: reason,
          product_sale_channel_id: saleChannelId,
        };
        const markettingStatusResponse = await fetch(
          `/api/direct/productSale/profile?action=AddOrUpdateProductSaleStatusGroup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(markettingStatusPayload),
          }
        );
        if (markettingStatusResponse.status !== 200) {
          throw new Error();
        }
        // #endregion

        // #region ส่งอีเมลแจ้งอนุมัติ
        const detailVersion = currentData?.displayVersionDetail?._temp;
        const rejectPayload = {
          type: 1,
          product_sale_channel_id: saleChannelId,
          request_to: detailVersion?.create_by,
          product_plan_id: productId,
          mode: "DISPLAY_APPROVE",
          template_code: "03",
          channel: channel,
          broker_id: brokerId,
        };
        const rejectResponse = await fetch(
          `/api/direct?action=ProductRecordApprove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rejectPayload),
          }
        );
        if (rejectResponse.status !== 200) {
          throw new Error();
        }

        // #endregion
        handleNotification(
          "ทำการบันทึกสำเร็จ",
          () => handleBack(),
          null,
          "info",
          "ตกลง"
        );
      } else {
        throw new Error("");
      }
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    }
  };

  const handleBack = () => {
    let pageUrl = channel === "606" ? "direct" : `brokers/${channel}`;
    router.push(`/${pageUrl}?tabIndex=1`);
    setTimeout(() => {
      handleScrollTo();
    }, 1000);
  };

  const GenerateLink = (type) => {
    const onlineSaleUrl =
      process.env.NEXT_PUBLIC_APPLICATION_ONLINE_BASE_URL ?? "";
    const planCode = productCondition?.i_plan;
    const detailStatus = watch("displayVersionDetail")?._temp?.sale_card_status;
    const suffix = `?brokerId=${brokerId}&previewMode=PRODUCT&previewProductId=${saleChannelId}&preview=${detailStatus}`;

    switch (type) {
      case "1":
        return `${onlineSaleUrl}/online-assurance/${saleChannelId}${suffix}`;
      case "2":
        return `${onlineSaleUrl}/online-assurance/${saleChannelId}&SubBusiLine=${channel}&PlanCode=${planCode}&SaleCode=XXXXXXXXXX${suffix}`;
      default:
        return `${onlineSaleUrl}/online-assurance/${saleChannelId}${suffix}`;
    }
  };

  const onSubmit = (data, event) => {
    handleNotification(
      "คุณต้องการยืนยันการบันทึกการเปลี่ยนแปลงหรือไม่ ?",
      () => {
        handleSaveVersion(data);
      },
      null,
      "question"
    );
  };

  const onError = (error, event) => console.error(error);

  const handleProductPreview = () => {
    const baseUrl = `${process.env.NEXT_PUBLIC_APPLICATION_ONLINE_BASE_URL}`;
    const detailStatus = watch("displayVersionDetail")?._temp?.sale_card_status;

    let additionUrl = `?`;
    if (channel !== "606") {
      additionUrl += `brokerId=${brokerId}&`;
    }
    additionUrl += `previewMode=PRODUCT&previewProductId=${saleChannelId}&preview=${detailStatus}`;
    window.open(`${baseUrl}${additionUrl}`, "_blank");
  };

  useEffect(() => {
    handleFetchVersion();
  }, []);

  useEffect(() => {
    if (selectionModel.length > 0 && detailMode) {
      handleFetchVersionDetail(selectionModel[0]);
    }
  }, [selectionModel.join(","), detailMode]);

  return (
    <>
      <PageProductDisplayVersionManage
        open={openManage}
        mode={openManageMode}
        setOpen={setOpenManage}
        productData={productCondition}
        handleSave={handleAddOrUpdateVersion}
      />
      <PageRejectComponent
        open={openRejectModal}
        setOpen={setOpenRejectModal}
        handleReject={handleReject}
      />

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Grid container mt={2}>
          {watch("displayVersionTemp").length > 0 ||
          preventAddVersion ? null : (
            <Grid container spacing={2} justifyContent={"end"}>
              <Grid item xs="auto">
                <Button
                  onClick={() => {
                    setOpenManageMode("create");
                    setOpenManage(true);
                  }}
                  variant="contained"
                >
                  เพิ่ม
                </Button>
              </Grid>
              <Grid item xs="auto">
                <Button
                  onClick={() => {
                    setOpenManageMode("copy");
                    setOpenManage(true);
                  }}
                  variant="contained"
                >
                  คัดลอก
                </Button>
              </Grid>
            </Grid>
          )}
          <Grid container mb={2}>
            <Grid item xs={12} sx={{ height: "20rem" }} mt={1}>
              <AppDataGrid
                hideFooter
                rowSelection
                columns={columns}
                rows={rowsDisplay}
                hideFooterPagination
                sortingMode={"client"}
                apiRef={dataGridApiRef}
                loading={loadingVersion}
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
                hiddenColumn={hiddenColumn}
                rowSelectionModel={selectionModel}
                getRowId={(row) => row.product_sale_card_id}
              />
            </Grid>
          </Grid>
          <div id="detail-anchor"></div>

          {loadingDetail ? (
            <AppLoadData loadingState={0} />
          ) : (
            <>
              <Collapse in={!loadingDetail && selectionModel.length > 0}>
                {watch("displayVersionDetail.status") === "5" && (
                  <Grid container justifyContent={"space-around"} my={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        disabled
                        multiline
                        rows={5}
                        label="เหตุผลการปฏิเสธคำขออนุมัติ"
                        margin="dense"
                        size="small"
                        {...register("displayVersionDetail.rejectReason")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
                <Grid container>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item>
                        <Controller
                          name="displayVersionDetail.popularity"
                          control={control}
                          render={({ field }) => {
                            const { name, onChange, value, ...otherProps } =
                              field;
                            return (
                              <FormControlLabel
                                control={
                                  <Switch
                                    disabled={detailMode === "view"}
                                    checked={value}
                                    onChange={onChange}
                                    {...otherProps}
                                  />
                                }
                                label="ยอดนิยม"
                              />
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <Controller
                          name={`displayVersionDetail.main`}
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
                                  disabled={detailMode === "view"}
                                  label="กลุ่มแบบประกัน"
                                  onChange={(event, value) => {
                                    onChange(value);
                                  }}
                                  {...otherProps}
                                  onBeforeOpen={handleFetchInsuranceGroup}
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
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12} md={6}>
                          <TextField
                            disabled
                            fullWidth
                            label="ชื่อ"
                            margin="dense"
                            size="small"
                            value={productCondition?.title ?? ""}
                            InputProps={{
                              readOnly: true,
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12} md={6}>
                          <TextField
                            required
                            fullWidth
                            label="แคปชั่น"
                            margin="dense"
                            size="small"
                            disabled={detailMode === "view"}
                            {...register("displayVersionDetail.caption")}
                            error={Boolean(
                              errors?.displayVersionDetail?.caption
                            )}
                            inputProps={{ maxLength: 100 }}
                            InputLabelProps={{
                              shrink: watch("displayVersionDetail.caption"),
                            }}
                          />
                          <FormHelperText
                            error={errors?.displayVersionDetail?.caption}
                          >
                            {errors?.displayVersionDetail?.caption?.message}
                          </FormHelperText>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* รายละเอียด */}
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12} md={6}>
                          <TextField
                            required
                            fullWidth
                            label="รายละเอียด"
                            margin="dense"
                            size="small"
                            multiline
                            rows={5}
                            disabled={detailMode === "view"}
                            {...register("displayVersionDetail.description")}
                            error={errors?.displayVersionDetail?.description}
                            inputProps={{ maxLength: 250 }}
                            InputLabelProps={{
                              shrink: watch("displayVersionDetail.description"),
                            }}
                          />
                          <FormHelperText
                            error={errors?.displayVersionDetail?.description}
                          >
                            {errors?.displayVersionDetail?.description?.message}
                          </FormHelperText>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* รายละเอียดบน card */}
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12} md={6}>
                          <TextField
                            required
                            fullWidth
                            label="รายละเอียดบนการ์ด"
                            margin="dense"
                            size="small"
                            multiline
                            rows={5}
                            disabled={detailMode === "view"}
                            {...register(
                              "displayVersionDetail.cardDescription"
                            )}
                            error={
                              errors?.displayVersionDetail?.cardDescription
                            }
                            inputProps={{ maxLength: 250 }}
                            InputLabelProps={{
                              shrink: watch(
                                "displayVersionDetail.cardDescription"
                              ),
                            }}
                          />
                          <FormHelperText
                            error={
                              errors?.displayVersionDetail?.cardDescription
                            }
                          >
                            {
                              errors?.displayVersionDetail?.cardDescription
                                ?.message
                            }
                          </FormHelperText>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* หมายเหตุ */}
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12} md={6}>
                          <TextField
                            disabled
                            fullWidth
                            label="หมายเหตุ"
                            margin="dense"
                            size="small"
                            value={
                              productCondition?.remark_marketing_name ?? ""
                            }
                            inputProps={{ maxLength: 250 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* ลิ้งเข้าถึงผลิตภัณฑ์ */}
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6.1}>
                          <TextField
                            fullWidth
                            label="ลิ้งเข้าถึงผลิตภัณฑ์"
                            margin="dense"
                            size="small"
                            disabled={detailMode === "view"}
                            {...register("displayVersionDetail.url")}
                            error={errors?.displayVersionDetail?.url}
                            inputProps={{ maxLength: 100 }}
                            InputLabelProps={{
                              shrink: watch("displayVersionDetail.url"),
                            }}
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button
                                    onClick={async () =>
                                      await handleCopyClipboard(
                                        watch("displayVersionDetail.url")
                                      )
                                    }
                                    sx={{ color: "GrayText" }}
                                  >
                                    คัดลอก
                                  </Button>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        {watch(
                          "displayVersionDetail.url"
                        ) ? null : detailMode === "view" ? null : (
                          <Grid item xs="auto" mt={1}>
                            <Button
                              onClick={() => {
                                const link = GenerateLink("1");
                                setValue("displayVersionDetail.url", link, {
                                  shouldDirty: true,
                                });
                              }}
                              variant="contained"
                            >
                              สร้างลิงค์
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* ลิ้งเข้าถึงผลิตภัณฑ์แบบมีพารามิเตอร์ */}
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6.1}>
                          <TextField
                            fullWidth
                            label="ลิ้งเข้าถึงผลิตภัณฑ์แบบมีพารามิเตอร์"
                            margin="dense"
                            size="small"
                            disabled={detailMode === "view"}
                            {...register("displayVersionDetail.urlWithParams")}
                            error={errors?.displayVersionDetail?.urlWithParams}
                            inputProps={{ maxLength: 100 }}
                            InputLabelProps={{
                              shrink: watch(
                                "displayVersionDetail.urlWithParams"
                              ),
                            }}
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button
                                    onClick={async () =>
                                      await handleCopyClipboard(
                                        watch(
                                          "displayVersionDetail.urlWithParams"
                                        )
                                      )
                                    }
                                    sx={{ color: "GrayText" }}
                                  >
                                    คัดลอก
                                  </Button>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        {watch(
                          "displayVersionDetail.urlWithParams"
                        ) ? null : detailMode === "view" ? null : (
                          <Grid item xs="auto" mt={1}>
                            <Button
                              onClick={() => {
                                const link = GenerateLink("2");
                                setValue(
                                  "displayVersionDetail.urlWithParams",
                                  link,
                                  {
                                    shouldDirty: true,
                                  }
                                );
                              }}
                              variant="contained"
                            >
                              สร้างลิงค์
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* เอกสารโบรชัวร์ */}
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6.1}>
                          <TextField
                            fullWidth
                            label="เอกสารโบรชัวร์"
                            margin="dense"
                            size="small"
                            disabled={detailMode === "view"}
                            {...register(
                              "displayVersionDetail.brochureFileName"
                            )}
                            inputProps={{ maxLength: 100 }}
                            InputLabelProps={{
                              shrink: watch(
                                "displayVersionDetail.brochureFileName"
                              ),
                            }}
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <input
                                    disabled={detailMode === "view"}
                                    type="file"
                                    ref={brochureRef}
                                    id="brochure-file-upload"
                                    style={{ display: "none" }}
                                    onChange={(event) =>
                                      handleFileUpload(
                                        event,
                                        "displayVersionDetail",
                                        "brochureFileString",
                                        "brochureFileName",
                                        "brochureFile"
                                      )
                                    }
                                    accept={documentFileAccept.join(",")}
                                  />
                                  <label htmlFor="brochure-file-upload">
                                    <Button
                                      component="span"
                                      disabled={detailMode === "view"}
                                      sx={{ color: "GrayText" }}
                                    >
                                      อัปโหลด
                                    </Button>
                                  </label>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs="auto" mt={1}>
                          <Button
                            onClick={handlePreviewBrochure}
                            disabled={
                              loadBrochure ||
                              !watch("displayVersionDetail.brochureFileName")
                            }
                            variant="contained"
                          >
                            ดูตัวอย่าง
                            {loadBrochure ? (
                              <CircularProgress
                                sx={{ marginLeft: 2 }}
                                size={20}
                              />
                            ) : null}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container mt={2}>
                  <Grid item xs={12}>
                    <AppCard
                      title={`รูปภาพ`}
                      cardstyle={{
                        border: "1px solid",
                        borderColor: "#e7e7e7",
                      }}
                    >
                      <Grid container>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={12}>
                              <NextImage
                                alt="banner"
                                src={
                                  watch(
                                    "displayVersionDetail.bannerImageUrlPreview"
                                  )?.trim()
                                    ? watch(
                                        "displayVersionDetail.bannerImageUrlPreview"
                                      )
                                    : "/images/2000x600.png"
                                }
                                width={2000}
                                height={600}
                                style={{
                                  aspectRatio: 2000 / 600,
                                  border: "2px dashed #e7e7e7",
                                  objectFit: "contain",
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} mt={2}>
                          <Grid container>
                            <Grid item xs={12} md={6}>
                              <TextField
                                required
                                fullWidth
                                label="รูปแบนเนอร์ (2000 × 600 px)"
                                margin="dense"
                                size="small"
                                id={`banner`}
                                disabled={detailMode === "view"}
                                {...register(
                                  `displayVersionDetail.bannerImageName`
                                )}
                                inputProps={{ maxLength: 100 }}
                                InputLabelProps={{
                                  shrink: watch(
                                    "displayVersionDetail.bannerImageName"
                                  ),
                                }}
                                error={
                                  errors?.displayVersionDetail?.bannerImageName
                                }
                                InputProps={{
                                  readOnly: true,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <input
                                        disabled={detailMode === "view"}
                                        type="file"
                                        ref={bannerRef}
                                        id="banner-file-upload"
                                        style={{ display: "none" }}
                                        onChange={(event) =>
                                          handleFileUpload(
                                            event,
                                            "displayVersionDetail",
                                            "bannerImageString",
                                            "bannerImageName",
                                            "bannerImage",
                                            "bannerImageUrlPreview",
                                            "1"
                                          )
                                        }
                                        accept={defaultFileAccept.join(",")}
                                      />
                                      <label htmlFor="banner-file-upload">
                                        <Button
                                          component="span"
                                          disabled={detailMode === "view"}
                                          sx={{ color: "GrayText" }}
                                        >
                                          อัปโหลด
                                        </Button>
                                      </label>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              <FormHelperText
                                error={
                                  errors?.displayVersionDetail?.bannerImageName
                                }
                              >
                                {
                                  errors?.displayVersionDetail?.bannerImageName
                                    ?.message
                                }
                              </FormHelperText>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} mt={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Grid container>
                                <Grid item xs={12}>
                                  <NextImage
                                    alt="banner"
                                    src={
                                      watch(
                                        "displayVersionDetail.cardImageUrlPreview"
                                      )?.trim()
                                        ? watch(
                                            "displayVersionDetail.cardImageUrlPreview"
                                          )
                                        : "/images/1000x1200.png"
                                    }
                                    width={1000}
                                    height={1200}
                                    style={{
                                      aspectRatio: 1000 / 1200,
                                      border: "2px dashed #e7e7e7",
                                      objectFit: "contain",
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} mt={2}>
                                  <TextField
                                    required
                                    fullWidth
                                    label="รูปการ์ด (1000 × 1200 px)"
                                    margin="dense"
                                    size="small"
                                    disabled={detailMode === "view"}
                                    {...register(
                                      `displayVersionDetail.cardImageName`
                                    )}
                                    inputProps={{ maxLength: 100 }}
                                    InputLabelProps={{
                                      shrink: watch(
                                        "displayVersionDetail.cardImageName"
                                      ),
                                    }}
                                    error={
                                      errors?.displayVersionDetail
                                        ?.cardImageName
                                    }
                                    InputProps={{
                                      readOnly: true,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <input
                                            type="file"
                                            disabled={detailMode === "view"}
                                            ref={cardRef}
                                            id="card-file-upload"
                                            style={{ display: "none" }}
                                            onChange={(event) =>
                                              handleFileUpload(
                                                event,
                                                "displayVersionDetail",
                                                "cardImageString",
                                                "cardImageName",
                                                "cardImage",
                                                "cardImageUrlPreview",
                                                "1"
                                              )
                                            }
                                            accept={defaultFileAccept.join(",")}
                                          />
                                          <label htmlFor="card-file-upload">
                                            <Button
                                              component="span"
                                              disabled={detailMode === "view"}
                                              sx={{ color: "GrayText" }}
                                            >
                                              อัปโหลด
                                            </Button>
                                          </label>
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  <FormHelperText
                                    error={
                                      errors?.displayVersionDetail
                                        ?.cardImageName
                                    }
                                  >
                                    {
                                      errors?.displayVersionDetail
                                        ?.cardImageName?.message
                                    }
                                  </FormHelperText>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={12}>
                              <NextImage
                                alt="banner"
                                src={
                                  watch(
                                    "displayVersionDetail.benefitImageUrlPreview"
                                  )?.trim()
                                    ? watch(
                                        "displayVersionDetail.benefitImageUrlPreview"
                                      )
                                    : "/images/2000x1000.png"
                                }
                                width={2000}
                                height={1000}
                                style={{
                                  aspectRatio: 2000 / 1000,
                                  border: "2px dashed #e7e7e7",
                                  objectFit: "contain",
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} mt={2}>
                          <Grid container>
                            <Grid item xs={12} md={6}>
                              <TextField
                                required
                                fullWidth
                                label="รูปตัวอย่างผลประโยชน์ (2000 × 1000 px)"
                                margin="dense"
                                size="small"
                                disabled={detailMode === "view"}
                                {...register(
                                  `displayVersionDetail.benefitImageName`
                                )}
                                inputProps={{ maxLength: 100 }}
                                InputLabelProps={{
                                  shrink: watch(
                                    "displayVersionDetail.benefitImageName"
                                  ),
                                }}
                                error={
                                  errors?.displayVersionDetail?.benefitImageName
                                }
                                InputProps={{
                                  readOnly: true,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <input
                                        disabled={detailMode === "view"}
                                        type="file"
                                        ref={benefitRef}
                                        id="benefit-file-upload"
                                        style={{ display: "none" }}
                                        onChange={(event) =>
                                          handleFileUpload(
                                            event,
                                            "displayVersionDetail",
                                            "benefitImageString",
                                            "benefitImageName",
                                            "benefitImage",
                                            "benefitImageUrlPreview",
                                            "1"
                                          )
                                        }
                                        accept={defaultFileAccept.join(",")}
                                      />
                                      <label htmlFor="benefit-file-upload">
                                        <Button
                                          component="span"
                                          disabled={detailMode === "view"}
                                          sx={{ color: "GrayText" }}
                                        >
                                          อัปโหลด
                                        </Button>
                                      </label>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              <FormHelperText
                                error={
                                  errors?.displayVersionDetail?.benefitImageName
                                }
                              >
                                {
                                  errors?.displayVersionDetail?.benefitImageName
                                    ?.message
                                }
                              </FormHelperText>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </AppCard>
                  </Grid>
                </Grid>
                <Grid container mt={2}>
                  <Grid item xs={12}>
                    <AppCard
                      title={`รายละเอียดผลิตภัณฑ์`}
                      cardstyle={{
                        border: "1px solid",
                        borderColor: "#e7e7e7",
                      }}
                    >
                      {detailMode === "view" ? null : (
                        <Grid container spacing={2} justifyContent={"end"}>
                          <Grid item xs="auto">
                            <Button
                              disabled={fields.length === 0}
                              onClick={() => {
                                handleNotification(
                                  "คุณต้องการยืนยันเพื่อลบทั้งหมดหรือไม่ ?",
                                  () => {
                                    remove();
                                  },
                                  null,
                                  "question"
                                );
                              }}
                              variant="contained"
                            >
                              ลบทั้งหมด
                            </Button>
                          </Grid>
                          <Grid item xs="auto">
                            <Button
                              onClick={() => {
                                append(
                                  {
                                    title: "",
                                    conditionTitle: "",
                                    fileItem: null,
                                    fileName: "",
                                    filePreviewUrl: "",
                                    fileType: null,
                                    fileUrl: "",
                                    fullWidth: false,
                                    htmlDescription: "",
                                  },
                                  fields?.length
                                );

                                // await trigger(
                                //   `displayProductDetail.${fields.length}`
                                // );
                              }}
                              variant="contained"
                            >
                              เพิ่ม
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                      {fields.map((fieldItem, index) => {
                        const contentRef = createRef();
                        const baseNameIndex = `displayProductDetail.${index}`;
                        const errorIndex =
                          errors?.displayProductDetail?.[index];

                        const typeOptions = !!watch(
                          `${baseNameIndex}.fullWidth`
                        )
                          ? APPLICATION_CONTENT_FILE_TYPE
                          : APPLICATION_CONTENT_FILE_TYPE.filter(
                              (typeItem) =>
                                typeItem?.id !== "2" && typeItem?.id !== "1"
                            );
                        const showHtmlDescription =
                          !watch(`${baseNameIndex}.fullWidth`) ||
                          watch(`${baseNameIndex}.fileType`)?.id === "2";

                        return (
                          <Accordion
                            defaultExpanded
                            key={fieldItem?.id}
                            sx={{
                              border: "1px solid",
                              borderColor: "#e7e7e7",
                              borderRadius: 2,
                              "&:before": {
                                display: "none",
                              },
                              marginTop: 2,
                            }}
                          >
                            <AccordionSummary expandIcon={<ArrowDropDown />}>
                              <Grid container spacing={2}>
                                <Grid item xs={5}>
                                  <TextField
                                    required
                                    fullWidth
                                    margin="dense"
                                    size="small"
                                    label="ชื่อกล่องรายละเอียด"
                                    disabled={detailMode === "view"}
                                    {...register(`${baseNameIndex}.title`)}
                                    inputProps={{ maxLength: 100 }}
                                    error={errorIndex?.title}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <FormHelperText error={errorIndex?.title}>
                                    {errorIndex?.title?.message}
                                  </FormHelperText>
                                </Grid>
                                <Grid item xs></Grid>
                                {detailMode === "view" ? null : (
                                  <Grid item xs="auto">
                                    <Button
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleNotification(
                                          "คุณต้องการลบรายการนี้หรือไม่ ?",
                                          () => {
                                            remove(index);
                                          },
                                          null,
                                          "question"
                                        );
                                      }}
                                      variant="contained"
                                    >
                                      ลบ
                                    </Button>
                                  </Grid>
                                )}
                              </Grid>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                borderTop: "1px solid",
                                borderColor: "#e7e7e7",
                              }}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                      <Controller
                                        name={`${baseNameIndex}.fullWidth`}
                                        control={control}
                                        render={({
                                          field: { value, onChange },
                                        }) => (
                                          <FormControlLabel
                                            control={
                                              <Switch
                                                disabled={detailMode === "view"}
                                                checked={value}
                                                onChange={(event) => {
                                                  onChange(
                                                    event.target.checked
                                                  );
                                                  setValue(
                                                    `${baseNameIndex}.fileType`,
                                                    null
                                                  );
                                                }}
                                              />
                                            }
                                            label={`แสดงแบบเต็มกล่อง`}
                                          />
                                        )}
                                      />
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Controller
                                        name={`${baseNameIndex}.fileType`}
                                        control={control}
                                        render={({ field }) => {
                                          const {
                                            name,
                                            onChange,
                                            ...otherProps
                                          } = field;

                                          return (
                                            <>
                                              <AppAutocomplete
                                                required
                                                id={name}
                                                name={name}
                                                disablePortal
                                                fullWidth
                                                label="ประเภท"
                                                onChange={async (
                                                  event,
                                                  value
                                                ) => {
                                                  const commonOptions = {
                                                    shouldTouch: true,
                                                    shouldValidate: true,
                                                  };
                                                  setValue(
                                                    `${baseNameIndex}.fileType`,
                                                    value,
                                                    commonOptions
                                                  );
                                                  setValue(
                                                    `${baseNameIndex}.fileUrl`,
                                                    "",
                                                    commonOptions
                                                  );
                                                  setValue(
                                                    `${baseNameIndex}.fileName`,
                                                    "",
                                                    commonOptions
                                                  );
                                                  setValue(
                                                    `${baseNameIndex}.filePreviewUrl`,
                                                    "",
                                                    commonOptions
                                                  );
                                                }}
                                                {...otherProps}
                                                disabled={detailMode === "view"}
                                                options={typeOptions}
                                                error={Boolean(
                                                  errorIndex?.fileType
                                                )}
                                              />
                                              <FormHelperText
                                                error={errorIndex?.fileType}
                                              >
                                                {errorIndex?.fileType?.message}
                                              </FormHelperText>
                                            </>
                                          );
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={6}>
                                      {watch(`${baseNameIndex}.fileType`) &&
                                        watch(`${baseNameIndex}.fileType`)
                                          ?.value === "0" && (
                                          <>
                                            <TextField
                                              required
                                              fullWidth
                                              label="ไฟล์"
                                              margin="dense"
                                              size="small"
                                              disabled={detailMode === "view"}
                                              {...register(
                                                `${baseNameIndex}.fileName`
                                              )}
                                              inputProps={{ maxLength: 100 }}
                                              InputLabelProps={{
                                                shrink: watch(
                                                  `${baseNameIndex}.fileName`
                                                ),
                                              }}
                                              error={errorIndex?.fileName}
                                              InputProps={{
                                                readOnly: true,
                                                endAdornment: (
                                                  <InputAdornment position="end">
                                                    <input
                                                      type="file"
                                                      ref={contentRef}
                                                      disabled={
                                                        detailMode === "view"
                                                      }
                                                      id={`${baseNameIndex}-file-upload`}
                                                      style={{
                                                        display: "none",
                                                      }}
                                                      onChange={(event) =>
                                                        handleFileUpload(
                                                          event,
                                                          `${baseNameIndex}`,
                                                          "fileString",
                                                          "fileName",
                                                          "fileItem",
                                                          "filePreviewUrl",
                                                          "1"
                                                        )
                                                      }
                                                      accept={defaultFileAccept.join(
                                                        ","
                                                      )}
                                                    />
                                                    <label
                                                      htmlFor={`${baseNameIndex}-file-upload`}
                                                    >
                                                      <Button
                                                        component="span"
                                                        disabled={
                                                          detailMode === "view"
                                                        }
                                                        sx={{
                                                          color: "GrayText",
                                                        }}
                                                      >
                                                        อัปโหลด
                                                      </Button>
                                                    </label>
                                                  </InputAdornment>
                                                ),
                                              }}
                                            />
                                            <FormHelperText
                                              error={errorIndex?.fileName}
                                            >
                                              {errorIndex?.fileName?.message}
                                            </FormHelperText>
                                          </>
                                        )}
                                      {watch(`${baseNameIndex}.fileType`) &&
                                        watch(`${baseNameIndex}.fileType`)
                                          ?.value === "1" && (
                                          <>
                                            <TextField
                                              required
                                              fullWidth
                                              label="Url"
                                              margin="dense"
                                              size="small"
                                              disabled={detailMode === "view"}
                                              {...register(
                                                `${baseNameIndex}.fileUrl`
                                              )}
                                              inputProps={{ maxLength: 100 }}
                                              InputLabelProps={{
                                                shrink: watch(
                                                  `${baseNameIndex}.fileUrl`
                                                ),
                                              }}
                                              error={errorIndex?.fileUrl}
                                            />
                                            <FormHelperText
                                              error={errorIndex?.fileUrl}
                                            >
                                              {errorIndex?.fileUrl?.message}
                                            </FormHelperText>
                                          </>
                                        )}
                                    </Grid>
                                    <Collapse
                                      in={watch(`${baseNameIndex}.fileType`)}
                                      sx={{
                                        border: "0px solid red",
                                        width: "100%",
                                        height: "auto",
                                      }}
                                    >
                                      {watch(`${baseNameIndex}.fileType`)
                                        ?.value === "0" ? (
                                        <Grid item xs={12}>
                                          <NextImage
                                            alt="content"
                                            src={
                                              watch(
                                                `${baseNameIndex}.filePreviewUrl`
                                              )?.trim()
                                                ? watch(
                                                    `${baseNameIndex}.filePreviewUrl`
                                                  )
                                                : "/images/1920x1080.png"
                                            }
                                            width={1920}
                                            height={1080}
                                            style={{
                                              aspectRatio: 1920 / 1080,
                                              border: "2px dashed #e7e7e7",
                                              objectFit: "contain",
                                            }}
                                          />
                                        </Grid>
                                      ) : watch(`${baseNameIndex}.fileType`)
                                          ?.value === "1" ? (
                                        <Grid
                                          item
                                          xs={12}
                                          sx={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            justifyItems: "center",
                                            border: "0px solid red",
                                            aspectRatio: 16 / 9,
                                          }}
                                        >
                                          <ReactPlayer
                                            url={
                                              watch(
                                                `${baseNameIndex}.fileUrl`
                                              )?.trim()
                                                ? watch(
                                                    `${baseNameIndex}.fileUrl`
                                                  )
                                                : ""
                                            }
                                            controls
                                            width="100%"
                                            height="100%"
                                          />
                                        </Grid>
                                      ) : null}
                                    </Collapse>
                                    {watch(`${baseNameIndex}.fullWidth`) ? (
                                      <Grid item xs={6}></Grid>
                                    ) : (
                                      <Grid item xs={6}>
                                        <TextField
                                          required
                                          fullWidth
                                          label="ชื่อคำอธิบาย"
                                          margin="dense"
                                          size="small"
                                          disabled={detailMode === "view"}
                                          {...register(
                                            `${baseNameIndex}.conditionTitle`
                                          )}
                                          inputProps={{ maxLength: 100 }}
                                          InputLabelProps={{
                                            shrink: watch(
                                              `${baseNameIndex}.conditionTitle`
                                            ),
                                          }}
                                          error={errorIndex?.conditionTitle}
                                        />
                                        <FormHelperText
                                          error={errorIndex?.conditionTitle}
                                        >
                                          {errorIndex?.conditionTitle?.message}
                                        </FormHelperText>
                                      </Grid>
                                    )}

                                    <Grid item xs={6}></Grid>
                                  </Grid>
                                </Grid>
                                {showHtmlDescription && (
                                  <Grid container>
                                    <Grid
                                      item
                                      xs={11}
                                      sx={{
                                        padding: 2,
                                        paddingBottom: 0,
                                      }}
                                    >
                                      <InputLabel
                                        required={
                                          !watch(
                                            `${baseNameIndex}.fullWidth`
                                          ) ||
                                          watch(`${baseNameIndex}.fileType`)
                                            ?.value === "2"
                                        }
                                      >
                                        คำอธิบาย
                                      </InputLabel>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      sx={{
                                        padding: 2,
                                      }}
                                    >
                                      <Controller
                                        name={`${baseNameIndex}.htmlDescription`}
                                        control={control}
                                        render={({
                                          field: { value, onChange, onBlur },
                                        }) => {
                                          return (
                                            <>
                                              <AppWyswig
                                                editable={detailMode !== "view"}
                                                value={value}
                                                onChange={(value) => {
                                                  onChange(value);
                                                }}
                                                onBlur={onBlur}
                                                error={
                                                  errorIndex?.htmlDescription
                                                }
                                              />
                                              <FormHelperText
                                                error={
                                                  errorIndex?.htmlDescription
                                                }
                                              >
                                                {
                                                  errorIndex?.htmlDescription
                                                    ?.message
                                                }
                                              </FormHelperText>
                                            </>
                                          );
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                )}
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </AppCard>
                  </Grid>
                </Grid>
              </Collapse>

              <Grid item xs={12} mt={2}>
                <Card>
                  <Grid container spacing={2} justifyContent={"end"}>
                    <Grid item xs={11.3}>
                      <Grid container justifyContent={"end"} spacing={2}>
                        <Grid item xs={12} md="auto">
                          <Button
                            color="inherit"
                            variant="outlined"
                            onClick={() => {
                              handleNotification(
                                "คุณต้องการยกเลิกการเปลี่ยนแปลงหรือไม่ ?",
                                () => handleBack(),
                                null,
                                "question"
                              );
                            }}
                          >
                            ยกเลิก / ออก
                          </Button>
                        </Grid>
                        {versionWaitForApprove ? (
                          <>
                            {watchDetail && grantApprove && (
                              <>
                                <Grid item xs={12} md="auto">
                                  <Button
                                    color="error"
                                    variant="contained"
                                    onClick={() => {
                                      handleNotification(
                                        "ท่านต้องการยืนยันการไม่อนุมัติข้อมูลผลิตภัณฑ์นี้หรือไม่ ?",
                                        () => setOpenRejectModal(true),
                                        null,
                                        "question"
                                      );
                                    }}
                                  >
                                    ไม่อนุมัติ
                                  </Button>
                                </Grid>
                                <Grid item xs={12} md="auto">
                                  <Button
                                    color="success"
                                    variant="contained"
                                    onClick={() => {
                                      handleNotification(
                                        "ท่านต้องการยืนยันการอนุมัติข้อมูลผลิตภัณฑ์นี้หรือไม่ ?",
                                        () => handleApprove(),
                                        null,
                                        "question"
                                      );
                                    }}
                                  >
                                    อนุมัติ
                                  </Button>
                                </Grid>
                              </>
                            )}
                          </>
                        ) : showOperationButton ? (
                          <>
                            {selectionModel?.length > 0 && grantRequest && (
                              <Grid item xs={12} md="auto">
                                <Button
                                  color="info"
                                  variant="contained"
                                  onClick={() => {
                                    handleNotification(
                                      "คุณการบันทึกข้อมูลและขออนุมัติการใช้งานหรือไม่ ?",
                                      () => handleRequestApprove(),
                                      null,
                                      "question"
                                    );
                                  }}
                                >
                                  ขออนุมัติ
                                </Button>
                              </Grid>
                            )}
                            {selectionModel?.length > 0 && (
                              <Grid item xs={12} md="auto">
                                <Button
                                  disabled={!isDirty}
                                  onClick={() => {
                                    handleNotification(
                                      "คุณต้องยืนยันการล้างค่าการเปลี่ยนแปลงหรือไม่ ?",
                                      () => handleReset(),
                                      null,
                                      "question"
                                    );
                                  }}
                                  variant="outlined"
                                >
                                  ล้างค่า
                                </Button>
                              </Grid>
                            )}
                            {selectionModel?.length > 0 && (
                              <Grid item xs={12} md="auto">
                                <Button
                                  disabled={!isDirty}
                                  type="submit"
                                  color="primary"
                                  variant="contained"
                                >
                                  บันทึกแบบร่าง
                                </Button>
                              </Grid>
                            )}
                          </>
                        ) : null}
                        {allowPreview && (
                          <Grid item xs={12} md="auto">
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleProductPreview}
                            >
                              ดูตัวอย่าง
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </form>
    </>
  );
};

export default PageProductDisplay;
