import { useState, useEffect, useRef, createRef, useMemo } from "react";
import {
  Box,
  Link,
  Card,
  Grid,
  Select,
  Button,
  Collapse,
  useTheme,
  TextField,
  Accordion,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
  FormHelperText,
  InputAdornment,
  CircularProgress,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  AppCard,
  AppStatus,
  AppDataGrid,
  AppAutocomplete,
  AppReOrderDatagrid,
} from "@/components";
import { Edit, Delete, RemoveRedEye, ArrowDropDown } from "@mui/icons-material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
  useAppForm,
  useAppRouter,
  useAppDialog,
  useAppSnackbar,
  useAppDispatch,
  useAppSelector,
  useAppFieldArray,
  useAppGridApiRef,
  useAppFeatureCheck,
} from "@hooks";
import { setDialog, closeDialog } from "@stores/slices";
import {
  APPLICATION_DEFAULT,
  APPLICATION_CONFIGURATION,
  APPLICATION_LOGO_ASPECT,
  APPLICATION_DESCRIPTION_SIZE,
  APPLICATION_DESCRIPTION_POSITION,
} from "@constants";
import { Controller } from "react-hook-form";
import { format, addYears, parseISO } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yup } from "@utilities";
import {
  AppManageProfile,
  AppManageBanner,
  AppManageSocial,
  AppApproveProfile,
  AppManageInsuraceGroupProduct,
} from ".";
import NextImage from "next/image";

const AppProfile = ({ mode, channel, brokerData }) => {
  const theme = useTheme();
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  const dataGridApiRef = useAppGridApiRef();
  const inputLogoRef = useRef(null);
  const { handleSnackAlert } = useAppSnackbar();
  const { dialog, brokerId, activator, sasToken } = useAppSelector(
    (state) => state.global
  );
  const { handleNotification: handleNotificationHook } = useAppDialog();
  const [bannerReOrder, setBannerReOrder] = useState(false);
  const [bannerDisplay, setBannerDisplay] = useState([]);
  const [loadingVersion, setLoadingVersion] = useState(false);
  const [detailMode, setDetailMode] = useState("view");
  const [openManageBanner, setOpenManageBanner] = useState(false);
  const [openManageSocial, setOpenManageSocial] = useState(false);
  const [openManageInsuranceGroupProduct, setOpenManageInsuranceGroupProduct] =
    useState(false);
  const [
    openManageInsuranceGroupProductInitialData,
    setOpenManageInsuranceGroupProductInitialData,
  ] = useState(null);
  const [openManageSocialMode, setOpenManageSocialMode] = useState("create");
  const [openManageSocialInitialData, setOpenManageSocialInitialData] =
    useState(null);
  const [openApproveProfile, setOpenApproveProfile] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [openManageProfileVersion, setOpenManageProfileVersion] =
    useState(false);
  const [openManageProfileVersionMode, setOpenManageProfileVersionMode] =
    useState("create");
  const [loadingMap, setLoadingMap] = useState({});
  const [pageNumber, setPageNumber] = useState(
    APPLICATION_DEFAULT.dataGrid.pageNumber
  );
  const [pageSize, setPageSize] = useState(
    APPLICATION_DEFAULT.dataGrid.pageSize
  );
  const [BannerPageNumber, setBannerPageNumber] = useState(
    APPLICATION_DEFAULT.dataGrid.pageNumber
  );
  const [BannerPageSize, setBannerPageSize] = useState(
    APPLICATION_DEFAULT.dataGrid.pageSize
  );
  const hiddenColumn = {
    id: false,
  };
  const { defaultFileAccept, defaultFileExtension, defaultFileSize } =
    APPLICATION_CONFIGURATION;

  const { validFeature: grantRead } = useAppFeatureCheck([
    "direct.profile.read",
    "broker.profile.read",
  ]);
  const { validFeature: grantEdit } = useAppFeatureCheck([
    "direct.profile.write",
    "broker.profile.write",
  ]);
  const { validFeature: grantDrop } = useAppFeatureCheck([
    "direct.profile.drop",
    "broker.profile.drop",
  ]);
  const { validFeature: grantRequest } = useAppFeatureCheck([
    "direct.profile.request",
    "broker.profile.request",
  ]);
  const { validFeature: grantApprove } = useAppFeatureCheck([
    "direct.profile.approve",
    "broker.profile.approve",
  ]);

  const showOperationButton = useMemo(() => {
    if (detailMode !== "view") {
      return true;
    }
  }, [detailMode]);

  const defaultScale = APPLICATION_LOGO_ASPECT?.find(
    (aspectItem) => aspectItem?.id === "0"
  );

  const validationSchema = Yup.object().shape({
    actionType: Yup.string(),
    displayVersion: Yup.array().of(Yup.object()),
    displayVersionTemp: Yup.array().of(Yup.object()),
    displayVersionDetail: Yup.object()
      .shape({
        name: Yup.string().nullable(),
        logo: Yup.mixed().nullable(),
        logoName: Yup.string().nullable().required(),
        logoUrl: Yup.string().nullable(),
        logoString: Yup.string().nullable(),
        logoPreviewUrl: Yup.string().nullable(),
        scale: Yup.object().nullable().required(),
        banner: Yup.array().of(Yup.object()),
        bannerTemp: Yup.array().of(Yup.object()),
        insuranceGroup: Yup.array().of(
          Yup.object().shape({
            icon1: Yup.mixed(),
            icon1ImageName: Yup.string().nullable().required(),
            icon1ImageString: Yup.string(),
            icon1ImageUrl: Yup.string(),
            icon1ImageUrlPreview: Yup.string(),
            name1: Yup.string().required(),
            description1: Yup.string().required(),
            icon2: Yup.mixed(),
            icon2ImageName: Yup.string().nullable().required(),
            icon2ImageString: Yup.string(),
            icon2ImageUrl: Yup.string(),
            icon2ImageUrlPreview: Yup.string(),
            name2: Yup.string().required(),
            description2: Yup.string().required(),
            icon3: Yup.mixed(),
            icon3ImageName: Yup.string().nullable().required(),
            icon3ImageString: Yup.string(),
            icon3ImageUrl: Yup.string(),
            icon3ImageUrlPreview: Yup.string(),
            name3: Yup.string().when("descriptionSize.value", {
              is: (value) => value !== 12,
              then: (schema) => schema.required(),
            }),
            description3: Yup.string().when("descriptionSize.value", {
              is: (value) => value !== 12,
              then: (schema) => schema.required(),
            }),
            descriptionSize: Yup.mixed().nullable().required(),
            descriptionPosition: Yup.mixed()
              .nullable()
              .when("descriptionSize.value", {
                is: (value) => value !== 12,
                then: (schema) => schema.required(),
              }),
          })
        ),
        additionalInfo: Yup.object().shape({
          phone: Yup.string()
            .nullable()
            .required()
            .preventSpace("ต้องไม่เป็นค่าว่าง"),
          social: Yup.array().of(Yup.object()),
          socialTemp: Yup.array().of(Yup.object()),
        }),
        contactUs: Yup.object().shape({
          phone: Yup.string()
            .nullable()
            .required()
            .preventSpace("ต้องไม่เป็นค่าว่าง"),
          email: Yup.string()
            .nullable()
            .required()
            .preventSpace("ต้องไม่เป็นค่าว่าง"),
          description: Yup.string()
            .nullable()
            .required()
            .preventSpace("ต้องไม่เป็นค่าว่าง"),
        }),
      })
      .nullable(),
  });

  const formMethods = useAppForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      displayVersion: [],
      displayVersionTemp: [],
      displayVersionDetail: {
        name: "",
        logo: null,
        logoName: "",
        logoUrl: "",
        logoString: "",
        logoPreviewUrl: "",
        scale: defaultScale,
        banner: [],
        bannerTemp: [],
        insuranceGroup: [],
        additionalInfo: {
          phone: "",
          social: [],
          socialTemp: [],
        },
        contactUs: {
          phone: "",
          email: "",
          description: "",
        },
      },
    },
  });

  const {
    getValues,
    setValue,
    watch,
    control,
    trigger,
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = formMethods;

  const { append: appendBanner } = useAppFieldArray({
    name: "displayVersionDetail.bannerTemp",
    control: control,
  });

  const {
    fields: fieldsInsuranceGroup,
    append: appendInsuranceGroup,
    remove: removeInsuranceGroup,
  } = useAppFieldArray({
    name: "displayVersionDetail.insuranceGroup",
    control: control,
  });

  const {
    fields: fieldsInsuranceGroupProduct,
    append: appendInsuranceGroupProduct,
    remove: removeInsuranceGroupProduct,
  } = useAppFieldArray({
    name: "displayVersionDetail.insuranceGroup.product",
    control: control,
  });

  const watchedProfileData = watch("displayVersion");
  const watchedProfileDataTemp = watch("displayVersionTemp");
  const rowsDisplayVersion = useMemo(() => {
    const tempData = watchedProfileDataTemp ?? [];
    const rowData = watchedProfileData ?? [];
    // 1. Merge ของเก่า
    const merged = rowData.map((item) => {
      const override = tempData.find((i) => i.id === item.id);
      return override ? { ...item, ...override } : item;
    });

    // 2. หาตัวใหม่จาก temp ที่ยังไม่มีใน rowData
    const newItems = tempData.filter(
      (item) => !rowData.some((r) => r.id === item.id)
    );

    // 3. รวมทั้งหมด
    return [...merged, ...newItems];
  }, [watchedProfileData, watchedProfileDataTemp]);
  const preventAddVersion = useMemo(() => {
    if (watchedProfileDataTemp?.length > 0) {
      return true;
    }

    if (
      watchedProfileData.some(
        (item) =>
          item?.profile_status === "1" ||
          item?.profile_status === "2" ||
          item?.profile_status === "5"
      )
    ) {
      return true;
    }
  }, [watchedProfileData, watchedProfileDataTemp]);

  const watchedBanner = watch("displayVersionDetail.banner");
  const watchedBannerTemp = watch("displayVersionDetail.bannerTemp");

  const handleBannerRowDisplay = () => {
    if (bannerReOrder) {
      // ถ้าเรียงจะยึดตามเรียงเลย
      return watchedBannerTemp;
    } else {
      const banner = watchedBanner ?? [];
      const bannerTemp = watchedBannerTemp ?? [];
      if (!bannerTemp || bannerTemp.length === 0) {
        return [...banner].sort(sortFn);
      }
      const bannerMap = new Map(bannerTemp.map((item) => [item.id, item]));
      const merged = [];

      // เอา banner มาก่อน ถ้า bannerTemp มี id ตรงกันให้ใช้ของ bannerTemp แทน
      for (const item of banner) {
        if (bannerMap.has(item.id)) {
          merged.push(bannerMap.get(item.id));
          bannerMap.delete(item.id); // เอาออกเพื่อไม่ให้ duplicate
        } else {
          merged.push(item);
        }
      }

      // เอา item ที่เหลือใน bannerTemp (ที่ไม่มีใน banner) มาต่อท้าย
      for (const item of bannerMap.values()) {
        merged.push(item);
      }

      // ฟังก์ชันเรียงลำดับ
      function sortFn(a, b) {
        const seqBanner = a.seq;
        const seqBannerTemp = b.seq;

        if (seqBanner != null && seqBannerTemp != null) {
          return seqBanner - seqBannerTemp;
        }
        if (seqBanner != null) return -1;
        if (seqBannerTemp != null) return 1;

        const dateA = new Date(a.createDate);
        const dateB = new Date(b.createDate);
        return dateB - dateA; // ใหม่ก่อน
      }

      return merged.sort(sortFn);
    }
  };

  useEffect(() => {
    const bannerRowsToDisplay = handleBannerRowDisplay();
    setBannerDisplay(bannerRowsToDisplay);
    setBannerReOrder(false);
  }, [watchedBanner, watchedBannerTemp]);

  const watchedSocial = watch("displayVersionDetail.additionalInfo.social");
  const watchedSocialTemp = watch(
    "displayVersionDetail.additionalInfo.socialTemp"
  );
  const rowSocial = useMemo(() => {
    const tempData = watchedSocialTemp ?? [];
    const rowData = watchedSocial ?? [];
    // 1. Merge ของเก่า
    const merged = rowData.map((item) => {
      const override = tempData.find((i) => i.id === item.id);
      return override ? { ...item, ...override } : item;
    });

    // 2. หาตัวใหม่จาก temp ที่ยังไม่มีใน rowData
    const newItems = tempData.filter(
      (item) => !rowData.some((r) => r.id === item.id)
    );

    // 3. รวมทั้งหมด
    return [...merged, ...newItems];
  }, [watchedSocial, watchedSocialTemp]);

  const displayVersionColumns = useMemo(
    () => [
      {
        field: "id",
      },
      {
        flex: 1,
        field: "title",
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
        field: "profile_status",
        type: "string",
        headerAlign: "center",
        headerName: "สถานะ",
        headerClassName: "header-main",
        align: "center",
        minWidth: 200,
        renderCell: (params) => (
          <AppStatus
            type="1"
            status={params.value}
            statusText={params.row.name_status}
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
          if (!value) return "";
          try {
            let date;
            date =
              typeof value === "string" ? parseISO(value) : new Date(value);
            if (isNaN(date.getTime())) return value;
            let formattedValue = format(addYears(date, 543), "dd/MM/yyyy");
            return formattedValue;
          } catch (error) {
            return value;
          }
        },
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
          if (!value) return "";
          try {
            let date;
            date =
              typeof value === "string" ? parseISO(value) : new Date(value);
            if (isNaN(date.getTime())) return value;
            let formattedValue = format(addYears(date, 543), "dd/MM/yyyy");
            return formattedValue;
          } catch (error) {
            return value;
          }
        },
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
          const id = params?.row?.id;
          const tempRow = params?.row?.is_new;
          const viewLoading = loadingMap[id]?.view || false;
          const editLoading = loadingMap[id]?.edit || false;
          const dropLoading = loadingMap[id]?.drop || false;
          const isDropped = params?.row?.profile_status === "4";
          const hasTemp = (watchedProfileDataTemp ?? []).length > 0;
          const rowEffective = params?.row?.profile_status === "3";
          const waitingForApprove = params?.row?.profile_status === "2";

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
                key={`delete_${id}`}
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
    [isDirty, loadingMap, watchedProfileDataTemp]
  );

  const productColumns = [
    {
      field: "id",
    },
    {
      flex: 1,
      field: "title",
      type: "string",
      headerAlign: "center",
      headerName: "ชื่อ",
      headerClassName: "header-main",
      align: "center",
      minWidth: 200,
    },
    {
      flex: 1,
      field: "actions",
      type: "actions",
      headerAlign: "center",
      headerClassName: "header-main",
      align: "center",
      minWidth: 100,
      renderCell: (params) => {
        const id = params?.row?.id;
        const detailView = detailMode === "view";
        const dropLoading = loadingMap[id]?.drop || false;
        let disableDrop = dropLoading;

        let dropFunction = () => {};

        if (!detailView) {
          return (
            <IconButton disabled={disableDrop} onClick={dropFunction}>
              <Delete />
            </IconButton>
          );
        }

        return <></>;
      },
    },
  ];

  const bannerColumns = useMemo(
    () => [
      {
        field: "id",
      },
      {
        flex: 1,
        field: "type",
        type: "string",
        headerAlign: "center",
        headerName: "ประเภท",
        headerClassName: "header-main",
        align: "center",
        minWidth: 50,
      },
      {
        flex: 1,
        field: "fileUrlPreview",
        type: "string",
        headerAlign: "center",
        headerName: "URL",
        headerClassName: "header-main",
        align: "center",
        minWidth: 50,
        renderCell: (params) => {
          const id = params?.row?.id;
          const isLoading = loadingMap[id]?.previewBanner;

          return (
            <>
              <Link
                href="#"
                sx={{
                  pointerEvents: isLoading && "none",
                  color: isLoading && "text.disabled",
                  cursor: isLoading && "default",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  handleBannerLinkPreview(
                    id,
                    params?.value,
                    params?.row?.fileName,
                    params?.row?.is_newImage ?? false
                  );
                }}
              >
                {params?.row?.fileName}
              </Link>
              {isLoading && (
                <CircularProgress sx={{ marginLeft: 2 }} size={10} />
              )}
            </>
          );
        },
      },
      {
        flex: 1,
        field: "status",
        headerAlign: "center",
        headerName: "สถานะ",
        headerClassName: "header-main",
        align: "center",
        minWidth: 200,
        renderCell: (params) => {
          return (
            <AppStatus
              type="2"
              status={params.value}
              statusText={params.row.statusName}
            />
          );
        },
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
        renderCell: (params) => {
          const value = params?.value;

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
        renderCell: (params) => {
          const value = params?.value;

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
        renderCell: (params) => {
          const id = params?.row?.id;
          const detailView = detailMode === "view";
          const dropLoading = loadingMap[id]?.drop || false;
          let disableDrop = dropLoading;
          const tempRow = params?.row?.is_new;
          const isDropped =
            params?.row?.is_active === false || params?.row?.status === 3;

          let dropFunction = () => handleDropBanner(params?.row);

          if (!isDropped && !detailView) {
            return (
              <IconButton disabled={disableDrop} onClick={dropFunction}>
                <Delete />
              </IconButton>
            );
          }

          return <></>;
        },
      },
    ],
    [loadingMap]
  );

  const socialColumns = useMemo(
    () => [
      {
        field: "id",
      },
      {
        flex: 1,
        field: "status",
        type: "string",
        headerAlign: "center",
        headerName: "สถานะ",
        headerClassName: "header-main",
        align: "center",
        minWidth: 150,
        renderCell: (params) => (
          <AppStatus
            type="2"
            status={params.value}
            statusText={params.row.statusName}
          />
        ),
        sortable: !isDirty,
      },
      {
        flex: 1,
        field: "title",
        type: "string",
        headerAlign: "center",
        headerName: "ชื่อ",
        headerClassName: "header-main",
        align: "left",
        minWidth: 200,
      },
      {
        flex: 1,
        field: "iconImageUrlPreview",
        headerAlign: "center",
        headerName: "ไอคอน",
        headerClassName: "header-main",
        align: "center",
        minWidth: 50,
        renderCell: (params) => {
          return (
            <NextImage
              alt="icon"
              src={params.value ? params.value : ""}
              width={40}
              height={40}
              style={{
                justifySelf: "anchor-center",
                width: 40,
                height: 40,
                borderRadius: 10,
                border: "0px solid red",
                marginTop: 5,
              }}
            />
          );
        },
      },
      {
        flex: 1,
        field: "url",
        type: "string",
        headerAlign: "center",
        headerName: "ลิงค์",
        headerClassName: "header-main",
        align: "left",
        minWidth: 50,
        renderCell: (params) => <Link href={params.value}>{params.value}</Link>,
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
            date =
              typeof value === "string" ? parseISO(value) : new Date(value);
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
          const viewLoading = loadingMap[id]?.view || false;
          const editLoading = loadingMap[id]?.edit || false;
          const dropLoading = loadingMap[id]?.drop || false;
          const detailView = detailMode === "view";
          let disableView = viewLoading || editLoading || dropLoading;
          let disableEdit = viewLoading || editLoading || dropLoading;
          let disableDrop = viewLoading || editLoading || dropLoading;
          const tempRow = params?.row?.is_new;
          const isDropped = params?.row?.status === "3";

          let editFunction = () => {
            setOpenManageSocial(true);
            setOpenManageSocialMode("edit");
            setOpenManageSocialInitialData(params?.row);
          };
          let dropFunction = () => handleRowDropSocial(params?.row);
          const defaultProps = {
            showInMenu: false,
            sx: {
              "&.Mui-disabled": {
                pointerEvents: "all",
              },
            },
          };
          let actions = [];

          if (!detailView && !isDropped) {
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

          if ((!detailView && !isDropped) || tempRow) {
            actions.push(
              <GridActionsCellItem
                key={`delete_${id}`}
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
    [loadingMap, detailMode]
  );

  const handleDropBanner = (row) => {
    handleNotificationHook(
      "คุณต้องการยกเลิกรายการนี้หรือไม่ ?",
      () => {
        const tempData = watch("displayVersionDetail.bannerTemp") ?? [];
        const isTemp = tempData.some((item) => item.id === row.id);

        if (isTemp) {
          // เอาออกจาก temp array ไปเลย
          const newTempData = tempData.filter((item) => item.id !== row.id);

          setValue("displayVersionDetail.bannerTemp", [...newTempData]);
        } else {
          const deleteRow = {
            ...row,
            status: 3,
            statusName: "ยกเลิกใช้งาน",
            updateDate: new Date().toISOString(),
            updateBy: activator,
          };

          appendBanner(deleteRow);
        }
      },
      null,
      "question"
    );
  };

  const handleBannerLinkPreview = async (
    id,
    fileUrlPreview,
    fileName,
    is_newImage
  ) => {
    setRowLoading(id, "previewBanner", true);

    try {
      let blob;
      let blobUrl;
      if (is_newImage) {
        blobUrl = fileUrlPreview;
      } else {
        const payload = {
          fileName: fileName,
          fileUrlPreview: fileUrlPreview,
        };
        const response = await fetch(
          `/api/direct/profile?action=PreviewBanner`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) throw new Error();
        blob = await response.blob();
        blobUrl = URL.createObjectURL(
          new Blob([blob], { type: blob.type || "application/octet-stream" })
        );
      }

      window.open(blobUrl, "_blank");
    } catch (error) {
      handleSnackAlert({
        open: true,
        message: "ทำรายการไม่สำเร็จ",
      });
    } finally {
      setRowLoading(id, "previewBanner", false);
    }
  };

  const handleRowSelection = (row, mode) => {
    // ถ้าเป็นการยกเลิกไม่ต้อง select ให้ปรับสถานะเลย และถ้าเป็นรายการใหม่ก็เอาออกจาก selection model ด้วย
    if (mode === "drop") {
      handleRowDrop(row);
    } else {
      setSelectionModel((prevSelection) => {
        const selectedId = row?.id;
        if (prevSelection.includes(selectedId)) {
          setValue("displayVersionDetail", null);
          return [];
        } else {
          // ถ้าไม่ใช้ temp ให้โหลดข้อมูลและแสดงการโหลด
          if (!row.is_new) {
            setRowLoading(row?.id, mode, true);
            setValue("actionType", mode);
          }
          return [selectedId];
        }
      });
      setDetailMode(mode);
    }
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

  const handleRowDrop = (row) => {
    handleNotificationHook(
      "คุณต้องการยกเลิกรายการนี้หรือไม่ ?",
      () => {
        const tempData = watch("displayVersionTemp") ?? [];
        const isTemp = tempData.some((item) => item.id === row.id);

        if (isTemp) {
          // เอาออกจาก temp array ไปเลย
          const newTempData = tempData.filter((item) => item.id !== row.id);

          setValue("displayVersionTemp", [...newTempData]);
          setSelectionModel([]);
        } else {
          const deleteRow = {
            ...row,
            profile_status: 4,
            name_status: "ยกเลิกใช้งาน",
            update_date: new Date(),
            update_by: activator,
          };
          handleSaveDialog(deleteRow);
          setDetailMode("drop");
        }
      },
      null,
      "question"
    );
  };

  const handleSaveDialog = (data) => {
    let updated;
    const currentValue = watch("displayVersionTemp") ?? [];
    const existsIndex = currentValue.findIndex((item) => item.id === data.id);
    if (existsIndex > -1) {
      // กรณี create ซ้ำ หรือ edit
      updated = [...currentValue];
      updated[existsIndex] = { ...updated[existsIndex], ...data };
    } else {
      // เพิ่มใหม่ หรือแก้ไขจากของจริง
      updated = [...currentValue, data];
    }

    // ถ้ายังมีรายการใน Temp ถึงจะให้ฟอร์ม dirty ต่อไป
    setValue("displayVersionTemp", updated, {
      shouldDirty: updated.length > 0,
    });
  };

  const handleRowDropSocial = (row) => {
    handleNotificationHook(
      "คุณต้องการยกเลิกรายการนี้หรือไม่ ?",
      () => {
        const tempData =
          watch("displayVersionDetail.additionalInfo.socialTemp") ?? [];
        const isTemp = tempData.some((item) => item.id === row.id);

        if (isTemp) {
          // เอาออกจาก temp array ไปเลย
          const newTempData = tempData.filter((item) => item.id !== row.id);

          setValue("displayVersionDetail.additionalInfo.socialTemp", [
            ...newTempData,
          ]);
        } else {
          const deleteRow = {
            ...row,
            status: 3,
            statusName: "ยกเลิกใช้งาน",
            update_date: new Date(),
            update_by: activator,
          };
          handleSaveSocialDialog(deleteRow);
        }
      },
      null,
      "question"
    );
  };

  const handleSaveSocialDialog = (data) => {
    let updated;
    const currentValue =
      watch("displayVersionDetail.additionalInfo.socialTemp") ?? [];
    const existsIndex = currentValue.findIndex((item) => item.id === data.id);
    if (existsIndex > -1) {
      // กรณี create ซ้ำ หรือ edit
      updated = [...currentValue];
      updated[existsIndex] = { ...updated[existsIndex], ...data };
    } else {
      // เพิ่มใหม่ หรือแก้ไขจากของจริง
      updated = [...currentValue, data];
    }

    // ถ้ายังมีรายการใน Temp ถึงจะให้ฟอร์ม dirty ต่อไป
    setValue("displayVersionDetail.additionalInfo.socialTemp", updated, {
      shouldDirty: updated.length > 0,
    });
  };

  const handleAddOrUpdateSocial = (data) => {
    let updated;
    const currentValue =
      watch("displayVersionDetail.additionalInfo.socialTemp") ?? [];
    const existsIndex = currentValue.findIndex((item) => item.id === data.id);
    if (existsIndex > -1) {
      // กรณี create ซ้ำ หรือ edit
      updated = [...currentValue];
      updated[existsIndex] = { ...updated[existsIndex], ...data };
    } else {
      // เพิ่มใหม่ หรือแก้ไขจากของจริง
      updated = [...currentValue, data];
    }

    // ถ้ายังมีรายการใน Temp ถึงจะให้ฟอร์ม dirty ต่อไป
    setValue("displayVersionDetail.additionalInfo.socialTemp", updated, {
      shouldDirty: updated.length > 0,
    });
  };

  const handleAddProduct = () => {
    const Content = (
      <Grid container>
        <Grid item xs={12}>
          <FormControl sx={{ m: 1, minWidth: "100%", maxWidth: "100%" }}>
            <InputLabel shrink htmlFor="select-multiple-native">
              เลือกผลิตภัณฑ์ (เลือกได้หลายรายการ)
            </InputLabel>
            <Select
              fullWidth
              multiple
              native
              //value={personName}
              //onChange={handleChangeMultiple}
              label="เลือกผลิตภัณฑ์ (เลือกได้หลายรายการ)"
              inputProps={{
                id: "select-multiple-native",
              }}
            >
              {watch("productGroup").map((item, index) => (
                <option key={index} value={item}>
                  {item.title}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
    handleNotification("ผลิตภัณฑ์", Content, 30, "product");
  };

  const handleNotification = (
    message,
    Content,
    dialogWidth,
    mode,
    callback
  ) => {
    dispatch(
      setDialog({
        ...dialog,
        open: true,
        title: message,
        width: dialogWidth,
        useDefaultBehavior: false,
        renderAction: () => {
          return (
            <Grid container justifyContent={"center"}>
              <Grid item xs={11}>
                {Content}
              </Grid>
              <Grid container justifyContent={"space-around"} mt={2}>
                <Grid item xs={11}>
                  <Grid container justifyContent={"end"} spacing={2}>
                    <Grid item xs={12} md="auto">
                      <Button
                        variant="outlined"
                        sx={{
                          fontSize: "1.8rem",
                          fontWeight: 700,
                        }}
                        onClick={() => {
                          dispatch(closeDialog());
                        }}
                      >
                        ยกเลิก
                      </Button>
                    </Grid>

                    <Grid item xs={12} md="auto">
                      <Button
                        variant="contained"
                        sx={{
                          fontSize: "1.8rem",
                          fontWeight: 700,
                          color: theme.palette.common.white,
                        }}
                        onClick={() => {
                          dispatch(closeDialog());
                        }}
                      >
                        บันทึก
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

  const handleFetchVersion = async () => {
    setLoadingVersion(true);

    try {
      const body = {
        broker_id: brokerId,
      };
      const response = await fetch(
        `/api/direct/profile?action=GetBrokersProfile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      reset({ displayVersion: [...data] });
    } catch (error) {
      handleSnackAlert({ open: true, message: "ล้มเหลวเกิดข้อผิดพลาด" });
    } finally {
      setLoadingVersion(false);
    }
  };

  const handleImageChange = (
    event,
    ref,
    prefix,
    nameProp,
    base64Prop,
    blobProp,
    previewProp
  ) => {
    try {
      const file = event.target.files[0];
      ref.current.value = null;

      // validate has file
      if (!file) return;
      const selectedFileType = file.type;
      const selectedFileSize = file.size;

      // validate type
      if (!defaultFileExtension.includes(selectedFileType)) {
        handleNotification(
          "ประเภทไฟล์ไม่ถูกต้อง (รองรับ .png, .jpg, .jpeg)",
          null,
          null,
          "error"
        );
        throw new Error("ประเภทไฟล์ไม่ถูกต้อง (รองรับ .png, .jpg, .jpeg)");
      }

      // validate size
      if (selectedFileSize > defaultFileSize) {
        handleNotification("ขนาดไฟล์ต้องไม่เกิน 3Mb.", null, null, "error");
        throw new Error("ขนาดไฟล์ต้องไม่เกิน 3Mb.");
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        setValue(`${prefix}.${base64Prop}`, base64String, {
          shouldDirty: true,
        });
        setValue(`${prefix}.${nameProp}`, file.name, { shouldDirty: true });
      };
      reader.readAsDataURL(file);

      const blobUrl = URL.createObjectURL(file);
      setValue(`${prefix}.${blobProp}`, file, { shouldDirty: true });
      setValue(`${prefix}.${previewProp}`, blobUrl, { shouldDirty: true });
    } catch (error) {
      let message = "ทำรายการไม่สำเร็จ กรุณาเข้าทำรายการใหม่อีกครั้ง";
      if (error.message) message = error.message;
    }
  };

  const handleFetchDetail = async (id) => {
    setLoadingDetail(true);

    try {
      const currentValue = watch();
      const row = dataGridApiRef?.current?.getRow(id);
      const brokerProfileId = row?.is_copy
        ? row.copy_version?.id
        : row?.is_new
        ? null
        : row?.id;

      if (row?.is_copy || !row?.is_new) {
        // #region โหลดข้อมูลโลโก้และติดต่อเรา
        const payloadLogoContact = {
          id: brokerProfileId,
        };
        const responseLogoContact = await fetch(
          `/api/direct/profile?action=GetBrokerProfileById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadLogoContact),
          }
        );
        if (responseLogoContact.status !== 200) {
          throw new Error("");
        }
        const dataLogoContact = await responseLogoContact.json();
        // #endregion

        // #region โหลดตารางแบนเนอร์
        const payloadBanner = {
          broker_profile_id: brokerProfileId,
        };
        const responseBanner = await fetch(
          `/api/direct/profile?action=GetMainContentById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadBanner),
          }
        );
        if (responseBanner.status !== 200) {
          throw new Error("");
        }
        const dataBanner = await responseBanner.json();
        const mappedBanner = dataBanner.map((bannerItem) => {
          return {
            _temp: { ...bannerItem },
            id: bannerItem?.id,
            seq: parseInt(bannerItem?.seq_content),
            product_sale_group_id: bannerItem?.product_sale_group_id,
            type: bannerItem?.content_type,
            fileUrl: bannerItem?.content_url,
            fileUrlPreview: bannerItem?.content_url
              ? `${bannerItem.content_url}${sasToken?.sas_images ?? ""}`
              : "",
            fileName: bannerItem?.content_file_name,
            status: parseInt(bannerItem?.active_status),
            statusName: bannerItem?.name_status,
            createBy: bannerItem?.create_by,
            createDate: bannerItem?.create_date,
            updateBy: bannerItem?.update_by,
            updateDate: bannerItem?.update_date,
          };
        });
        // #endregion

        // #region โหลดช่องทางโซเชี่ยล
        const payloadSocial = {
          broker_profile_id: brokerProfileId,
        };
        const responseSocial = await fetch(
          `/api/direct/profile?action=GetSocialById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadSocial),
          }
        );
        if (responseBanner.status !== 200) {
          throw new Error("");
        }
        const dataSocial = await responseSocial.json();
        const mappedSocial = dataSocial.map((socialItem) => {
          return {
            _temp: { ...socialItem },
            id: socialItem?.id,
            title: socialItem?.title,
            url: socialItem?.url,
            iconName: socialItem?.icon_name,
            iconUrl: socialItem?.icon,
            iconImageUrlPreview: socialItem?.icon
              ? `${socialItem.icon}${sasToken?.sas_images ?? ""}`
              : "",
            status: socialItem?.active_status,
            statusName: socialItem?.name_status,
            createBy: socialItem?.create_by,
            createDate: socialItem?.create_date,
            updateBy: socialItem?.update_by,
            updateDate: socialItem?.update_date,
          };
        });
        // #endregion

        // #region โหลดข้อมูลกลุ่มแบบประกัน
        const payloadInsuranceGroup = {
          broker_profile_id: brokerProfileId,
        };
        const responseInsuranceGroup = await fetch(
          `/api/direct/profile?action=GetInsuranceGroup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadInsuranceGroup),
          }
        );
        if (responseInsuranceGroup.status !== 200) {
          throw new Error("");
        }

        const dataInsuranceGroup = await responseInsuranceGroup.json();
        const mappedInsuranceGroup = dataInsuranceGroup.map(
          (insuranceGroupItem) => {
            const mappedProduct = (insuranceGroupItem?.products ?? []).map(
              (productItem) => {
                return {
                  ...productItem,
                };
              }
            );

            return {
              _temp: { ...insuranceGroupItem },
              title: insuranceGroupItem?.topic_mode ?? "",
              status: 1,
              statusText: "แบบร่าง",
              icon1: null,
              icon1ImageName: insuranceGroupItem?.icon_name1 ?? "",
              icon1ImageString: "",
              icon1Image: null,
              icon1ImageUrl: insuranceGroupItem?.icon1 ?? "",
              icon1ImageUrlPreview: insuranceGroupItem?.icon1
                ? `${insuranceGroupItem.icon1}${sasToken?.sas_images ?? ""}`
                : "",
              name1: insuranceGroupItem?.topic_mode ?? "",
              description1: insuranceGroupItem?.description_topic_mode ?? "",
              icon2: null,
              icon2ImageName: insuranceGroupItem?.icon_name2 ?? "",
              icon2ImageString: "",
              icon2Image: null,
              icon2ImageUrl: insuranceGroupItem?.icon2 ?? "",
              icon2ImageUrlPreview: insuranceGroupItem?.icon2
                ? `${insuranceGroupItem.icon2}${sasToken?.sas_images ?? ""}`
                : "",
              name2: insuranceGroupItem?.title ?? "",
              description2: insuranceGroupItem?.content_topic ?? "",
              icon3: null,
              icon3ImageName: insuranceGroupItem?.icon_name3 ?? "",
              icon3ImageString: "",
              icon3Image: null,
              icon3ImageUrl: insuranceGroupItem?.icon3 ?? "",
              icon3ImageUrlPreview: insuranceGroupItem?.icon3
                ? `${insuranceGroupItem.icon3}${sasToken?.sas_images ?? ""}`
                : "",
              name3: insuranceGroupItem?.description_topic ?? "",
              description3: insuranceGroupItem?.description ?? "",
              descriptionSize:
                APPLICATION_DESCRIPTION_SIZE.find(
                  (sizeItem) =>
                    sizeItem?.value === insuranceGroupItem?.content_size
                ) ?? null,
              descriptionPosition:
                APPLICATION_DESCRIPTION_POSITION.find(
                  (positionItem) =>
                    positionItem?.value ===
                    insuranceGroupItem?.description_placement
                ) ?? null,
              product: mappedProduct,
            };
          }
        );
        // #endregion

        const aspect = APPLICATION_LOGO_ASPECT.find(
          (aspectItem) =>
            aspectItem.value === dataLogoContact?.broker_logo_aspect
        );

        const preparedData = {
          displayVersionDetail: {
            name: dataLogoContact?.title,
            logo: null,
            logoName: dataLogoContact?.broker_logo,
            logoUrl: dataLogoContact?.broker_url,
            logoString: "",
            logoPreviewUrl: dataLogoContact?.broker_url
              ? `${dataLogoContact.broker_url}${sasToken?.sas_images ?? ""}`
              : "",
            scale: aspect,
            banner: mappedBanner,
            insuranceGroup: mappedInsuranceGroup,
            additionalInfo: {
              phone: dataLogoContact?.number_phone_social,
              social: mappedSocial,
              socialTemp: [],
            },
            contactUs: {
              phone: dataLogoContact?.number_phone ?? "",
              email: dataLogoContact?.email ?? "",
              description: dataLogoContact?.description ?? "",
            },
          },
        };

        reset({
          ...currentValue,
          ...preparedData,
        });
      } else {
        reset({
          actionType: "edit",
          displayVersion: [...currentValue?.displayVersion],
          displayVersionTemp: [...currentValue?.displayVersionTemp],
          displayVersionDetail: {
            name: row?.title,
            logo: null,
            logoName: "",
            logoUrl: "",
            logoString: "",
            logoPreviewUrl: "",
            scale: defaultScale,
            banner: [],
            additionalInfo: {
              phone: "",
              social: [],
              socialTemp: [],
            },
            contactUs: {
              phone: "",
              email: "",
              description: "",
            },
          },
        });
      }
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

  const handleAddOrUpdateVersion = (data, mode) => {
    let updated;
    const currentValue = watch("displayVersionTemp") ?? [];
    const existsIndex = currentValue.findIndex((item) => item.id === data.id);
    if (existsIndex > -1) {
      // กรณี create ซ้ำ หรือ edit
      updated = [...currentValue];
      updated[existsIndex] = { ...updated[existsIndex], ...data };
    } else {
      // เพิ่มใหม่ หรือแก้ไขจากของจริง
      updated = [...currentValue, data];
    }

    setValue("displayVersionTemp", updated);
    if (mode === "drop") {
      // handleSaveVersion({ ...data, sale_card_status: "4" }, false, "4");
      return;
    }

    let loadDataId = data?.id;
    setSelectionModel([loadDataId]);
    setDetailMode(mode);
  };

  const handleBack = () => {
    let pageUrl = channel === "606" ? "direct" : `brokers/${channel}`;
    router.push(`/${pageUrl}`);
    setTimeout(() => {
      handleScrollTo();
    }, 1000);
  };

  useEffect(() => {
    handleFetchVersion();
  }, []);

  useEffect(() => {
    if (selectionModel.length > 0) {
      handleFetchDetail(selectionModel[0]);
    }
  }, [selectionModel.join(",")]);

  const onError = (error, event) => console.error(error);

  const handleSaveProfile = async (data, silent = false) => {
    try {
      let ProfileId = null;
      const selectedId = selectionModel[0] ?? data.displayVersionTemp.id;
      const row = dataGridApiRef?.current?.getRow(selectedId);
      const targetData = row;

      if (targetData) {
        // #region สร้างหรืออัพเดตโปรไฟล์
        ProfileId = targetData?.id;
        const isDrop = targetData?.active_status === "4";
        const payloadProfile = {
          is_active: true,
          create_by: activator,
          update_by: activator,
          id: ProfileId,
          broker_id: brokerId,
          title: targetData.title,
          broker_logo: data.displayVersionDetail.logoName,
          broker_url: data.displayVersionDetail.logoUrl,
          broker_logo_aspect: data?.displayVersionDetail?.scale?.value,
          file_broker_logo: data.displayVersionDetail.logoString,
          number_phone_social: data.displayVersionDetail.additionalInfo.phone,
          description: data.displayVersionDetail.contactUs.description,
          email: data.displayVersionDetail.contactUs.email,
          number_phone: data.displayVersionDetail.contactUs.phone,
          profile_status: isDrop ? "4" : "1",
          profile_status_message: targetData.name_status,
        };
        const responseProfile = await fetch(
          `/api/direct/profile?action=AddOrUpdateBrokersProfile`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadProfile),
          }
        );
        if (responseProfile.status !== 200) {
          throw new Error("");
        }
        const dataProfile = await responseProfile.json();

        if (row?.is_new) {
          ProfileId = dataProfile;
        }
        // #endregion

        if (!isDrop) {
          // #region บันทึกรายการแบนเนอร์
          const originalBanner = watch("displayVersionDetail.banner") ?? [];
          const tempBanner = watch("displayVersionDetail.bannerTemp") ?? [];
          const runBannerAddOrUpdate = async () => {
            const promises = tempBanner.map(async (item, index) => {
              const payload = {
                is_active: item?.status === 3 ? false : null,
                create_by: activator,
                update_by: activator,
                id: item?.is_new ? null : item?.id,
                broker_profile_id: ProfileId,
                product_sale_group_id: item?.product?.product_sale_group_id,
                seq_content: parseInt(originalBanner.length + index),
                title: item?.product?.title,
                content_file_name: item?.fileName,
                content_url: item?.fileUrl ?? "",
                content_type: item?.type,
                description: "",
                content_file: item?.fileString,
              };

              await fetch(`/api/direct/profile?action=AddOrUpdateMainContent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
            });
            await Promise.all(promises);
          };
          runBannerAddOrUpdate();
          // #endregion

          // #region บันทึกรายการโซเชี่ยล
          const originalSocial =
            watch("displayVersionDetail.additionalInfo.social") ?? [];
          const tempSocial =
            watch("displayVersionDetail.additionalInfo.socialTemp") ?? [];
          const runSocialAddOrUpdate = async () => {
            const promises = tempSocial.map(async (item, index) => {
              const payload = {
                id: item?.id,
                is_active: item?.status === 3 ? false : null,
                create_by: activator,
                update_by: activator,
                broker_profile_id: ProfileId,
                seq: item?.seq ?? parseInt(originalSocial.length + index),
                title: item?.title,
                icon_name: item?.icon ?? item?.iconName,
                icon: item?.iconUrl,
                url: item?.url,
                icon_file: item?.iconFile,
              };

              await fetch(`/api/direct/profile?action=AddOrUpdateSocial`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
            });
            await Promise.all(promises);
          };
          runSocialAddOrUpdate();
          // #endregion
        }

        if (!silent) {
          handleNotificationHook(
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
    }
  };

  const onSubmit = (data, event) => {
    handleNotificationHook(
      "คุณต้องการยืนยันการบันทึกการเปลี่ยนแปลงหรือไม่ ?",
      () => {
        handleSaveProfile(data);
      },
      null,
      "question"
    );
  };

  const handleAddOrUpdateProduct = (data, mode) => {
    let updated;
    const currentValue = watch("displayVersionDetail.insuranceGroup") ?? [];
    const existsIndex = currentValue.findIndex((item) => item.id === data.id);
    if (existsIndex > -1) {
      // กรณี create ซ้ำ หรือ edit
      updated = [...currentValue];
      updated[existsIndex] = { ...updated[existsIndex], ...data };
    } else {
      // เพิ่มใหม่ หรือแก้ไขจากของจริง
      updated = [...currentValue, data];
    }

    setValue("displayVersionDetail.insuranceGroup", updated);
    if (mode === "drop") {
      // handleSaveVersion({ ...data, sale_card_status: "4" }, false, "4");
      return;
    }

    let loadDataId = data?.id;
    setSelectionModel([loadDataId]);
    setDetailMode(mode);
  };

  return (
    <>
      <AppManageProfile
        mode={openManageProfileVersionMode}
        open={openManageProfileVersion}
        setOpen={setOpenManageProfileVersion}
        handleSave={handleAddOrUpdateVersion}
      />
      {openManageBanner && (
        <AppManageBanner
          open={openManageBanner}
          setOpen={setOpenManageBanner}
          addBanner={appendBanner}
          currentSelected={bannerDisplay}
        />
      )}
      <AppManageSocial
        mode={openManageSocialMode}
        open={openManageSocial}
        setOpen={setOpenManageSocial}
        addSocial={handleAddOrUpdateSocial}
        form={openManageSocialInitialData}
      />
      <AppManageInsuraceGroupProduct
        open={openManageInsuranceGroupProduct}
        setOpen={setOpenManageInsuranceGroupProduct}
        addProduct={handleAddOrUpdateProduct}
        initialData={openManageInsuranceGroupProductInitialData}
      />
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Grid container>
          <Grid
            container
            justifyContent={"center"}
            my={2}
            sx={{ border: "0px solid red" }}
          >
            <Grid item xs={12}>
              <AppCard
                title={`โปรไฟล์ทั้งหมด`}
                cardstyle={{ border: "1px solid", borderColor: "#e7e7e7" }}
              >
                {!preventAddVersion && (
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "end", gap: 2 }}
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          setOpenManageProfileVersionMode("create");
                          setOpenManageProfileVersion(true);
                        }}
                      >
                        เพิ่ม
                      </Button>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          setOpenManageProfileVersionMode("copy");
                          setOpenManageProfileVersion(true);
                        }}
                      >
                        คัดลอก
                      </Button>
                    </Grid>
                  </Grid>
                )}

                <Grid container>
                  <Grid item xs={12} sx={{ height: "25rem" }} mt={1}>
                    <AppDataGrid
                      hideFooter
                      rowSelection
                      columns={displayVersionColumns}
                      rows={rowsDisplayVersion}
                      hideFooterPagination
                      sortingMode={"client"}
                      apiRef={dataGridApiRef}
                      loading={loadingVersion}
                      hideFooterSelectedRowCount
                      disableRowSelectionOnClick
                      hiddenColumn={hiddenColumn}
                      rowSelectionModel={selectionModel}
                    />
                  </Grid>
                </Grid>
              </AppCard>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12}>
              <Collapse in={!loadingDetail && selectionModel.length > 0}>
                <Grid
                  mb={2}
                  container
                  justifyContent={"center"}
                  sx={{ border: "0px solid red" }}
                >
                  <Grid item xs={12} mt={2}>
                    <AppCard
                      title={`โปรไฟล์แสดงผล`}
                      cardstyle={{
                        border: "1px solid",
                        borderColor: "#e7e7e7",
                      }}
                    >
                      <Grid container>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={12} md={2}>
                              <Box>
                                <NextImage
                                  alt="banner"
                                  src={
                                    watch(
                                      "displayVersionDetail.logoPreviewUrl"
                                    )?.trim()
                                      ? watch(
                                          "displayVersionDetail.logoPreviewUrl"
                                        )
                                      : watch("displayVersionDetail.scale")
                                          ?.id === "1"
                                      ? "/images/1920x1080.png"
                                      : "/images/600x600.png"
                                  }
                                  width={
                                    watch("displayVersionDetail.scale")?.id ===
                                    "1"
                                      ? 1920
                                      : 600
                                  }
                                  height={
                                    watch("displayVersionDetail.scale")?.id ===
                                    "1"
                                      ? 1000
                                      : 600
                                  }
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 10,
                                    aspectRatio:
                                      watch("displayVersionDetail.scale")
                                        ?.id === "1"
                                        ? 1.777777
                                        : 1,
                                    backgroundColor:
                                      watch("displayVersionDetail.scale")
                                        ?.id === "1"
                                        ? theme.palette?.common?.white
                                        : theme.palette?.primary?.main,
                                  }}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} mt={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={6} md={4}>
                              <input
                                ref={inputLogoRef}
                                accept="image/*"
                                type="file"
                                id="upload-input"
                                style={{ display: "none" }}
                                onChange={(event) =>
                                  handleImageChange(
                                    event,
                                    inputLogoRef,
                                    "displayVersionDetail",
                                    "logoName",
                                    "logoString",
                                    "logoUrl",
                                    "logoPreviewUrl"
                                  )
                                }
                              />
                              <TextField
                                required
                                fullWidth
                                margin="dense"
                                size="small"
                                {...register("displayVersionDetail.logoName")}
                                inputProps={{ maxLength: 100 }}
                                label={
                                  watch("displayVersionDetail.scale")?.id ===
                                  "1"
                                    ? "โลโก้ (1920 x 1080 px)"
                                    : "โลโก้ (600 x 600 px)"
                                }
                                disabled={detailMode === "view"}
                                InputLabelProps={{
                                  shrink: !!watch(
                                    "displayVersionDetail.logoName"
                                  ),
                                }}
                                InputProps={{
                                  readOnly: true,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <Button
                                        sx={{ color: "GrayText" }}
                                        onClick={() => {
                                          if (inputLogoRef.current) {
                                            inputLogoRef.current.click();
                                          }
                                        }}
                                      >
                                        อัปโหลด
                                      </Button>
                                    </InputAdornment>
                                  ),
                                }}
                                error={errors?.displayVersionDetail?.logoName}
                              />
                              <FormHelperText
                                error={errors?.displayVersionDetail?.logoName}
                              >
                                {
                                  errors?.displayVersionDetail?.logoName
                                    ?.message
                                }
                              </FormHelperText>
                            </Grid>
                            <Grid item xs={6} md={4}>
                              <Controller
                                control={control}
                                name="displayVersionDetail.scale"
                                render={({ field }) => {
                                  const { name, onChange, ...otherProps } =
                                    field;
                                  return (
                                    <>
                                      <AppAutocomplete
                                        id={name}
                                        name={name}
                                        disablePortal
                                        fullWidth
                                        required
                                        disabled={detailMode === "view"}
                                        label="อัตราส่วน"
                                        options={APPLICATION_LOGO_ASPECT}
                                        onChange={(event, value) => {
                                          onChange(value);
                                        }}
                                        {...otherProps}
                                        error={
                                          errors?.displayVersionDetail?.scale
                                        }
                                      />
                                      <FormHelperText
                                        error={
                                          errors?.displayVersionDetail?.scale
                                        }
                                      >
                                        {
                                          errors?.displayVersionDetail?.scale
                                            ?.message
                                        }
                                      </FormHelperText>
                                    </>
                                  );
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} mt={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <TextField
                                fullWidth
                                disabled
                                label="ชื่อโปรไฟล์"
                                margin="dense"
                                size="small"
                                value={watch("displayVersionDetail.name") ?? ""}
                                inputProps={{ maxLength: 100 }}
                                InputLabelProps={{
                                  shrink: watch("displayVersionDetail.name"),
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </AppCard>
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <AppCard
                      title={`แบนเนอร์`}
                      cardstyle={{
                        border: "1px solid",
                        borderColor: "#e7e7e7",
                      }}
                    >
                      <Grid container>
                        {detailMode === "view" ? null : (
                          <Grid item xs={12} textAlign={"end"}>
                            <Button
                              onClick={() => setOpenManageBanner(true)}
                              variant="contained"
                            >
                              เพิ่ม
                            </Button>
                          </Grid>
                        )}
                        <Grid item xs={12} sx={{ height: "auto" }} mt={1}>
                          <AppReOrderDatagrid
                            rows={bannerDisplay}
                            rowCount={bannerDisplay.length}
                            columns={bannerColumns}
                            hiddenColumn={hiddenColumn}
                            hideFooter
                            handleUpdateRow={(reOrderedRow) => {
                              setBannerReOrder(true);
                              setValue(
                                "displayVersionDetail.bannerTemp",
                                reOrderedRow
                              );
                            }}
                          />
                        </Grid>
                      </Grid>
                    </AppCard>
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <AppCard
                      title={`กลุ่มแบบประกัน`}
                      cardstyle={{
                        border: "1px solid",
                        borderColor: "#e7e7e7",
                      }}
                    >
                      {detailMode !== "view" && (
                        <Grid container>
                          <Grid
                            item
                            xs={12}
                            sx={{ display: "flex", justifyContent: "end" }}
                            mb={2}
                          >
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={() => {
                                appendInsuranceGroup({
                                  title: null,
                                  status: 1,
                                  statusText: "แบบร่าง",
                                  icon1: null,
                                  name1: null,
                                  description1: null,
                                  icon2: null,
                                  name2: null,
                                  description2: null,
                                  icon3: null,
                                  name3: null,
                                  description3: null,
                                  product: [],
                                });

                                trigger(
                                  `insuranceGroup.${
                                    fieldsInsuranceGroup.length - 1
                                  }`
                                );
                              }}
                            >
                              เพิ่ม
                            </Button>
                          </Grid>
                        </Grid>
                      )}

                      <Grid container spacing={1}>
                        {fieldsInsuranceGroup.map((value, index) => {
                          const insuranceGroupName = `displayVersionDetail.insuranceGroup.${index}`;
                          const insuranceGroupIndexErrors =
                            errors?.displayVersionDetail?.insuranceGroup?.[
                              index
                            ];
                          const icon1Ref = createRef();
                          const icon2Ref = createRef();
                          const icon3Ref = createRef();

                          return (
                            <Grid item xs={12} key={index}>
                              <Accordion
                                defaultExpanded={detailMode !== "view"}
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
                                <AccordionSummary
                                  expandIcon={<ArrowDropDown />}
                                >
                                  <Grid container spacing={2}>
                                    <Grid item xs={5}>
                                      <TextField
                                        fullWidth
                                        margin="dense"
                                        size="small"
                                        inputProps={{ maxLength: 100 }}
                                        disabled={detailMode === "view"}
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                        {...register(
                                          `${insuranceGroupName}.name1`
                                        )}
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.name1
                                        )}
                                      />
                                    </Grid>
                                    <Grid item xs></Grid>
                                    {detailMode !== "view" && (
                                      <>
                                        <Grid item xs="auto">
                                          <Button
                                            variant="outlined"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleNotificationHook(
                                                "คุณต้องการยกเลิกรายการนี้หรือไม่",
                                                () =>
                                                  removeInsuranceGroup(index),
                                                null,
                                                "question"
                                              );
                                            }}
                                          >
                                            ยกเลิก
                                          </Button>
                                        </Grid>
                                        <Grid item xs="auto">
                                          <Button
                                            variant="contained"
                                            onClick={(e) => {
                                              trigger(`${insuranceGroupName}`);
                                            }}
                                          >
                                            บันทึก
                                          </Button>
                                        </Grid>
                                      </>
                                    )}
                                  </Grid>
                                </AccordionSummary>
                                <AccordionDetails
                                  sx={{
                                    borderTop: "1px solid",
                                    borderColor: "#e7e7e7",
                                  }}
                                >
                                  {/* <Grid container>
                                    <Grid item xs={12}>
                                      <AppStatus
                                        type="2"
                                        status={watch(
                                          "displayVersion.profile_status"
                                        )}
                                        statusText={watch(
                                          "displayVersion.name_status"
                                        )}
                                      />
                                    </Grid>
                                  </Grid> */}
                                  <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                      <input
                                        ref={icon1Ref}
                                        accept="image/*"
                                        type="file"
                                        id="upload-input"
                                        style={{ display: "none" }}
                                        onChange={(e) =>
                                          handleImageChange(
                                            e,
                                            icon1Ref,
                                            `${insuranceGroupName}`,
                                            "icon1ImageName",
                                            "icon1ImageString",
                                            "icon1",
                                            "icon1ImageUrlPreview"
                                          )
                                        }
                                      />
                                      <TextField
                                        required
                                        fullWidth
                                        margin="dense"
                                        size="small"
                                        disabled={detailMode === "view"}
                                        label="ไอคอน 1 (700 x 800 px)"
                                        inputProps={{ maxLength: 100 }}
                                        InputProps={{
                                          readOnly: true,
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              <Button
                                                disabled={detailMode === "view"}
                                                sx={{ color: "GrayText" }}
                                                onClick={() => {
                                                  if (icon1Ref.current) {
                                                    icon1Ref.current.click();
                                                  }
                                                }}
                                              >
                                                อัปโหลด
                                              </Button>
                                            </InputAdornment>
                                          ),
                                        }}
                                        {...register(
                                          `${insuranceGroupName}.icon1ImageName`
                                        )}
                                        InputLabelProps={{
                                          shrink: watch(
                                            `${insuranceGroupName}.icon1ImageName`
                                          ),
                                        }}
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.icon1ImageName
                                        )}
                                      />
                                      <FormHelperText
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.icon1ImageName
                                        )}
                                      >
                                        {
                                          insuranceGroupIndexErrors
                                            ?.icon1ImageName?.message
                                        }
                                      </FormHelperText>
                                    </Grid>
                                    <Grid item xs={4}>
                                      <TextField
                                        required
                                        fullWidth
                                        margin="dense"
                                        size="small"
                                        label="ชื่อ 1"
                                        disabled={detailMode === "view"}
                                        inputProps={{ maxLength: 250 }}
                                        InputProps={{
                                          readOnly: detailMode === "view",
                                        }}
                                        InputLabelProps={{
                                          shrink: watch(
                                            `${insuranceGroupName}.name1`
                                          ),
                                        }}
                                        {...register(
                                          `${insuranceGroupName}.name1`
                                        )}
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.name1
                                        )}
                                      />
                                      <FormHelperText
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.name1
                                        )}
                                      >
                                        {
                                          insuranceGroupIndexErrors?.name1
                                            ?.message
                                        }
                                      </FormHelperText>
                                    </Grid>
                                    <Grid item xs={4}>
                                      <TextField
                                        required
                                        fullWidth
                                        margin="dense"
                                        size="small"
                                        label="คำอธิบาย 1"
                                        disabled={detailMode === "view"}
                                        inputProps={{ maxLength: 250 }}
                                        InputProps={{
                                          readOnly: detailMode === "view",
                                        }}
                                        InputLabelProps={{
                                          shrink: watch(
                                            `${insuranceGroupName}.description1`
                                          ),
                                        }}
                                        {...register(
                                          `${insuranceGroupName}.description1`
                                        )}
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.description1
                                        )}
                                      />
                                      <FormHelperText
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.description1
                                        )}
                                      >
                                        {
                                          insuranceGroupIndexErrors
                                            ?.description1?.message
                                        }
                                      </FormHelperText>
                                    </Grid>
                                  </Grid>

                                  <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                      <input
                                        ref={icon2Ref}
                                        accept="image/*"
                                        type="file"
                                        id="upload-input"
                                        style={{ display: "none" }}
                                        onChange={(e) =>
                                          handleImageChange(
                                            e,
                                            icon2Ref,
                                            `${insuranceGroupName}`,
                                            "icon2ImageName",
                                            "icon2ImageString",
                                            "icon2",
                                            "icon2ImageUrlPreview"
                                          )
                                        }
                                      />
                                      <TextField
                                        required
                                        fullWidth
                                        margin="dense"
                                        size="small"
                                        disabled={detailMode === "view"}
                                        label="ไอคอน 2 (500 x 500 px)"
                                        inputProps={{ maxLength: 250 }}
                                        InputProps={{
                                          readOnly: true,
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              <Button
                                                disabled={detailMode === "view"}
                                                sx={{ color: "GrayText" }}
                                                onClick={() => {
                                                  if (icon2Ref.current) {
                                                    icon2Ref.current.click();
                                                  }
                                                }}
                                              >
                                                อัปโหลด
                                              </Button>
                                            </InputAdornment>
                                          ),
                                        }}
                                        {...register(
                                          `${insuranceGroupName}.icon2ImageName`
                                        )} //ขาด icon name
                                        InputLabelProps={{
                                          shrink: watch(
                                            `${insuranceGroupName}.icon2ImageName`
                                          ),
                                        }}
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.icon2ImageName
                                        )}
                                      />
                                      <FormHelperText
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.icon2ImageName
                                        )}
                                      >
                                        {
                                          insuranceGroupIndexErrors
                                            ?.icon2ImageName?.message
                                        }
                                      </FormHelperText>
                                    </Grid>
                                    <Grid item xs={4}>
                                      <TextField
                                        required
                                        fullWidth
                                        margin="dense"
                                        size="small"
                                        label="ชื่อ 2"
                                        disabled={detailMode === "view"}
                                        inputProps={{ maxLength: 250 }}
                                        InputProps={{
                                          readOnly: detailMode === "view",
                                        }}
                                        InputLabelProps={{
                                          shrink: watch(
                                            `${insuranceGroupName}.name2`
                                          ),
                                        }}
                                        {...register(
                                          `${insuranceGroupName}.name2`
                                        )}
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.name2
                                        )}
                                      />
                                      <FormHelperText
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.name2
                                        )}
                                      >
                                        {
                                          insuranceGroupIndexErrors?.name2
                                            ?.message
                                        }
                                      </FormHelperText>
                                    </Grid>
                                    <Grid item xs={4}>
                                      <TextField
                                        required
                                        fullWidth
                                        margin="dense"
                                        size="small"
                                        label="คำอธิบาย 2"
                                        disabled={detailMode === "view"}
                                        inputProps={{ maxLength: 250 }}
                                        InputProps={{
                                          readOnly: detailMode === "view",
                                        }}
                                        InputLabelProps={{
                                          shrink: watch(
                                            `${insuranceGroupName}.description2`
                                          ),
                                        }}
                                        {...register(
                                          `${insuranceGroupName}.description2`
                                        )}
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.description2
                                        )}
                                      />
                                      <FormHelperText
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.description2
                                        )}
                                      >
                                        {
                                          insuranceGroupIndexErrors
                                            ?.description2?.message
                                        }
                                      </FormHelperText>
                                    </Grid>
                                  </Grid>

                                  <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                      <Grid container>
                                        <Grid item xs={12}>
                                          <>
                                            <input
                                              ref={icon3Ref}
                                              accept="image/*"
                                              type="file"
                                              id="upload-input"
                                              style={{ display: "none" }}
                                              onChange={(e) =>
                                                handleImageChange(
                                                  e,
                                                  icon3Ref,
                                                  `${insuranceGroupName}`,
                                                  "icon3ImageName",
                                                  "icon3ImageString",
                                                  "icon3",
                                                  "icon3ImageUrlPreview"
                                                )
                                              }
                                            />
                                            <TextField
                                              required
                                              fullWidth
                                              margin="dense"
                                              size="small"
                                              disabled={detailMode === "view"}
                                              label="ไอคอน 3 (500 x 500 px)"
                                              inputProps={{ maxLength: 250 }}
                                              InputProps={{
                                                readOnly: true,
                                                endAdornment: (
                                                  <InputAdornment position="end">
                                                    <Button
                                                      disabled={
                                                        detailMode === "view"
                                                      }
                                                      sx={{ color: "GrayText" }}
                                                      onClick={() => {
                                                        if (icon3Ref.current) {
                                                          icon3Ref.current.click();
                                                        }
                                                      }}
                                                    >
                                                      อัปโหลด
                                                    </Button>
                                                  </InputAdornment>
                                                ),
                                              }}
                                              {...register(
                                                `${insuranceGroupName}.icon3ImageName`
                                              )} //ขาด icon name
                                              InputLabelProps={{
                                                shrink: watch(
                                                  `${insuranceGroupName}.icon3ImageName`
                                                ),
                                              }}
                                              error={Boolean(
                                                insuranceGroupIndexErrors?.icon3ImageName
                                              )}
                                            />
                                            <FormHelperText
                                              error={Boolean(
                                                insuranceGroupIndexErrors?.icon3ImageName
                                              )}
                                            >
                                              {
                                                insuranceGroupIndexErrors
                                                  ?.icon3ImageName?.message
                                              }
                                            </FormHelperText>
                                          </>
                                        </Grid>
                                        <Grid item xs={12}>
                                          <TextField
                                            required={
                                              watch(
                                                `${insuranceGroupName}.descriptionSize`
                                              )?.value !== 12
                                            }
                                            fullWidth
                                            margin="dense"
                                            size="small"
                                            label="ชื่อ 3"
                                            disabled={detailMode === "view"}
                                            inputProps={{ maxLength: 250 }}
                                            InputProps={{
                                              readOnly: detailMode === "view",
                                            }}
                                            InputLabelProps={{
                                              shrink: watch(
                                                `${insuranceGroupName}.name3`
                                              ),
                                            }}
                                            {...register(
                                              `${insuranceGroupName}.name3`
                                            )}
                                            error={Boolean(
                                              insuranceGroupIndexErrors?.name3
                                            )}
                                          />
                                          <FormHelperText
                                            error={Boolean(
                                              insuranceGroupIndexErrors?.name3
                                            )}
                                          >
                                            {
                                              insuranceGroupIndexErrors?.name3
                                                ?.message
                                            }
                                          </FormHelperText>
                                          <Grid item xs={12}>
                                            <Controller
                                              control={control}
                                              name={`${insuranceGroupName}.descriptionSize`}
                                              render={({ field }) => {
                                                const {
                                                  name,
                                                  onChange,
                                                  ...otherProps
                                                } = field;

                                                return (
                                                  <>
                                                    <AppAutocomplete
                                                      id={name}
                                                      name={name}
                                                      disablePortal
                                                      fullWidth
                                                      required
                                                      disabled={
                                                        detailMode === "view"
                                                      }
                                                      label="ขนาดช่องคำอธิบาย 3"
                                                      options={
                                                        APPLICATION_DESCRIPTION_SIZE
                                                      }
                                                      onChange={(e, v) => {
                                                        if (
                                                          v &&
                                                          v.value === 12
                                                        ) {
                                                          setValue(
                                                            `${insuranceGroupName}.descriptionPosition`,
                                                            APPLICATION_DESCRIPTION_POSITION.find(
                                                              (positionItem) =>
                                                                positionItem.id ===
                                                                "3"
                                                            )
                                                          );
                                                        } else {
                                                          setValue(
                                                            `${insuranceGroupName}.descriptionPosition`,
                                                            null
                                                          );
                                                        }
                                                        onChange(v);
                                                      }}
                                                      {...otherProps}
                                                      error={Boolean(
                                                        insuranceGroupIndexErrors?.descriptionSize
                                                      )}
                                                    />
                                                    <FormHelperText
                                                      error={Boolean(
                                                        insuranceGroupIndexErrors?.descriptionSize
                                                      )}
                                                    >
                                                      {
                                                        insuranceGroupIndexErrors
                                                          ?.descriptionSize
                                                          ?.message
                                                      }
                                                    </FormHelperText>
                                                  </>
                                                );
                                              }}
                                            />
                                          </Grid>
                                          <Grid item xs={12}>
                                            <Controller
                                              control={control}
                                              name={`${insuranceGroupName}.descriptionPosition`}
                                              render={({ field }) => {
                                                const {
                                                  name,
                                                  onChange,
                                                  ...otherProps
                                                } = field;

                                                return (
                                                  <>
                                                    <AppAutocomplete
                                                      id={name}
                                                      name={name}
                                                      disablePortal
                                                      fullWidth
                                                      required
                                                      disabled={
                                                        detailMode === "view" ||
                                                        watch(
                                                          `${insuranceGroupName}.descriptionSize`
                                                        )?.value === 12
                                                      }
                                                      label="ตำแหน่งแสดงคำอธิบาย 3"
                                                      options={
                                                        watch(
                                                          `${insuranceGroupName}.descriptionSize`
                                                        )?.value === 12
                                                          ? APPLICATION_DESCRIPTION_POSITION
                                                          : APPLICATION_DESCRIPTION_POSITION.filter(
                                                              (positionItem) =>
                                                                positionItem.id !==
                                                                "3"
                                                            )
                                                      }
                                                      onChange={(e, v) => {
                                                        onChange(v);
                                                      }}
                                                      {...otherProps}
                                                      error={Boolean(
                                                        insuranceGroupIndexErrors?.descriptionPosition
                                                      )}
                                                    />
                                                    <FormHelperText
                                                      error={Boolean(
                                                        insuranceGroupIndexErrors?.descriptionPosition
                                                      )}
                                                    >
                                                      {
                                                        insuranceGroupIndexErrors
                                                          ?.descriptionPosition
                                                          ?.message
                                                      }
                                                    </FormHelperText>
                                                  </>
                                                );
                                              }}
                                            />
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                    <Grid item xs>
                                      <TextField
                                        required={
                                          watch(
                                            `${insuranceGroupName}.descriptionSize`
                                          )?.value !== 12
                                        }
                                        fullWidth
                                        margin="dense"
                                        size="small"
                                        label="คำอธิบาย 3"
                                        multiline
                                        rows={8}
                                        disabled={detailMode === "view"}
                                        inputProps={{ maxLength: 250 }}
                                        InputProps={{
                                          readOnly: detailMode === "view",
                                        }}
                                        InputLabelProps={{
                                          shrink: watch(
                                            `${insuranceGroupName}.description3`
                                          ),
                                        }}
                                        {...register(
                                          `${insuranceGroupName}.description3`
                                        )}
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.description3
                                        )}
                                      />
                                      <FormHelperText
                                        error={Boolean(
                                          insuranceGroupIndexErrors?.description3
                                        )}
                                      >
                                        {
                                          insuranceGroupIndexErrors
                                            ?.description3?.message
                                        }
                                      </FormHelperText>
                                    </Grid>
                                  </Grid>
                                  <Grid container spacing={2} mt={2}>
                                    <Grid item xs={3.5}>
                                      <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 900 }}
                                      >
                                        ผลิตภัณฑ์
                                      </Typography>
                                    </Grid>
                                    {detailMode !== "view" && (
                                      <Grid item xs="auto">
                                        <Button
                                          variant="contained"
                                          onClick={() => {
                                            const currentProduct = watch(
                                              "displayVersionDetail.insuranceGroup"
                                            );
                                            setOpenManageInsuranceGroupProduct(
                                              true
                                            );
                                            setOpenManageInsuranceGroupProductInitialData(
                                              currentProduct
                                            );
                                          }}
                                          // onClick={() => {
                                          //   handleSnackAlert({
                                          //     open: true,
                                          //     message: "ทำรายการไม่สำเร็จ",
                                          //   });
                                          // }}
                                        >
                                          เพิ่ม
                                        </Button>
                                      </Grid>
                                    )}
                                  </Grid>
                                  <Grid container mt={2}>
                                    <Grid item xs={4}>
                                      <AppReOrderDatagrid
                                        rowCount={
                                          watch(`${insuranceGroupName}.product`)
                                            ?.length ?? 0
                                        }
                                        rows={
                                          watch(
                                            `${insuranceGroupName}.product`
                                          ) ?? []
                                        }
                                        columns={productColumns}
                                        hiddenColumn={hiddenColumn}
                                        hideFooter
                                      />
                                    </Grid>
                                  </Grid>
                                </AccordionDetails>
                              </Accordion>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </AppCard>
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <AppCard
                      title={`สอบถามข้อมูลเพิ่มเติม`}
                      cardstyle={{
                        border: "1px solid",
                        borderColor: "#e7e7e7",
                      }}
                    >
                      <Grid container>
                        <Grid item xs={12}>
                          <Grid container justifyContent={"space-between"}>
                            <Grid item xs={12} md={4}>
                              <TextField
                                required
                                fullWidth
                                margin="dense"
                                size="small"
                                label="เบอร์โทร"
                                disabled={detailMode === "view"}
                                inputProps={{ maxLength: 100 }}
                                InputLabelProps={{
                                  shrink: !!watch(
                                    `displayVersionDetail.additionalInfo.phone`
                                  ),
                                }}
                                {...register(
                                  `displayVersionDetail.additionalInfo.phone`
                                )}
                                error={Boolean(
                                  errors?.displayVersionDetail?.additionalInfo
                                    ?.phone
                                )}
                              />
                              <FormHelperText
                                error={Boolean(
                                  errors?.displayVersionDetail?.additionalInfo
                                    ?.phone
                                )}
                              >
                                {
                                  errors?.displayVersionDetail?.additionalInfo
                                    ?.phone?.message
                                }
                              </FormHelperText>
                            </Grid>
                            {detailMode !== "view" && (
                              <Grid item xs={12} md="auto" mt={0.5}>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    setOpenManageSocialMode("create");
                                    setOpenManageSocialInitialData(null);
                                    setOpenManageSocial(true);
                                  }}
                                >
                                  เพิ่ม
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                          <Grid container>
                            <Grid item xs={12} sx={{ height: "auto" }} mt={1}>
                              <AppDataGrid
                                rows={rowSocial}
                                rowCount={rowSocial.length}
                                columns={socialColumns}
                                hiddenColumn={hiddenColumn}
                                hideFooter
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </AppCard>
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <AppCard
                      title={`ติดต่อเรา`}
                      cardstyle={{
                        border: "1px solid",
                        borderColor: "#e7e7e7",
                      }}
                    >
                      <Grid container>
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <TextField
                                required
                                fullWidth
                                margin="dense"
                                size="small"
                                label="เบอร์โทร"
                                disabled={detailMode === "view"}
                                inputProps={{ maxLength: 100 }}
                                InputLabelProps={{
                                  shrink: !!watch(
                                    `displayVersionDetail.contactUs.phone`
                                  ),
                                }}
                                {...register(
                                  `displayVersionDetail.contactUs.phone`
                                )}
                                error={Boolean(
                                  errors?.displayVersionDetail?.contactUs?.phone
                                )}
                              />
                              <FormHelperText
                                error={Boolean(
                                  errors?.displayVersionDetail?.contactUs?.phone
                                )}
                              >
                                {
                                  errors?.displayVersionDetail?.contactUs?.phone
                                    ?.message
                                }
                              </FormHelperText>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                required
                                fullWidth
                                margin="dense"
                                size="small"
                                label="อีเมล"
                                disabled={detailMode === "view"}
                                inputProps={{ maxLength: 100 }}
                                InputLabelProps={{
                                  shrink: !!watch(
                                    `displayVersionDetail.contactUs.email`
                                  ),
                                }}
                                {...register(
                                  `displayVersionDetail.contactUs.email`
                                )}
                                error={Boolean(
                                  errors?.displayVersionDetail?.contactUs?.email
                                )}
                              />
                              <FormHelperText
                                error={Boolean(
                                  errors?.displayVersionDetail?.contactUs?.email
                                )}
                              >
                                {
                                  errors?.displayVersionDetail?.contactUs?.email
                                    ?.message
                                }
                              </FormHelperText>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                              <TextField
                                required
                                fullWidth
                                margin="dense"
                                size="small"
                                label="เวลาทำการ"
                                multiline
                                rows={5}
                                disabled={detailMode === "view"}
                                inputProps={{ maxLength: 250 }}
                                InputLabelProps={{
                                  shrink: !!watch(
                                    `displayVersionDetail.contactUs.description`
                                  ),
                                }}
                                {...register(
                                  `displayVersionDetail.contactUs.description`
                                )}
                                error={Boolean(
                                  errors?.displayVersionDetail?.contactUs
                                    ?.description
                                )}
                              />
                              <FormHelperText
                                error={Boolean(
                                  errors?.displayVersionDetail?.contactUs
                                    ?.description
                                )}
                              >
                                {
                                  errors?.displayVersionDetail?.contactUs
                                    ?.description?.message
                                }
                              </FormHelperText>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </AppCard>
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
          </Grid>

          <Grid container justifyContent={"center"} my={2}>
            <Grid item xs={12}>
              <Grid container justifyContent={"center"} mt={0}>
                <Grid item xs={12}>
                  <Grid container justifyContent={"end"} spacing={1}>
                    {showOperationButton && (
                      <>
                        <Grid item xs={12} md="auto">
                          <Button
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                              handleNotificationHook(
                                "ท่านต้องการล้างค่าเปลี่ยนแปลงหรือไม่ ?",
                                () => reset(),
                                null,
                                "question"
                              );
                            }}
                          >
                            ล้างค่า
                          </Button>
                        </Grid>
                        <Grid item xs={12} md="auto">
                          <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                          >
                            บันทึกแบบร่าง
                          </Button>
                        </Grid>
                      </>
                    )}
                    {/* <Grid item xs={12} md="auto">
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
                      <Grid item xs={12} md="auto">
                        <Button
                          variant="outlined"
                          onClick={() => {
                            handleNotificationHook(
                              "ท่านต้องการล้างค่าเปลี่ยนแปลงหรือไม่ ?",
                              () => reset(),
                              null,
                              "question"
                            );
                          }}
                        >
                          ล้างค่า
                        </Button>
                      </Grid>
                      {grantRequest && (
                        <Grid item xs={12} md="auto">
                          <Button
                            color="info"
                            variant="contained"
                            onClick={() => {
                              handleNotificationHook(
                                "ท่านต้องการขออนุมัติหรือไม่ ?",
                                () => {},
                                null,
                                "question"
                              );
                            }}
                          >
                            ขออนุมัติ
                          </Button>
                        </Grid>
                      )} */}

                    {/* <Grid item xs={12} md="auto">
                        <Button
                          variant="contained"
                          sx={{
                            color: theme.palette.common.white,
                            backgroundColor: theme.palette.primary.main,
                          }}
                        >
                          ดูตัวอย่าง
                        </Button>
                      </Grid> */}
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid container justifyContent={"center"} my={2}>
                  <Grid item xs={11.3}>
                    <Grid container spacing={2} justifyContent={"end"}>
                      <Grid item xs={12} md="auto">
                        <AppApproveProfile
                          open={openApproveProfile}
                          setOpen={setOpenApproveProfile}
                        />
                        <Button
                          variant="contained"
                          sx={{
                            color: "white",
                            backgroundColor: theme.palette.error.dark,
                          }}
                          onClick={() => setOpenApproveProfile(true)}
                        >
                          ไม่อนุมัติ
                        </Button>
                      </Grid>
                      <Grid item xs={12} md="auto">
                        <Button
                          variant="contained"
                          sx={{
                            color: "white",
                            background: "green",
                          }}
                          onClick={() => {
                            handleNotificationHook(
                              "ท่านต้องการยืนยันเพื่ออนุมัติหรือไม่ ?",
                              () => {},
                              null,
                              "question"
                            );
                          }}
                        >
                          อนุมัติ
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AppProfile;
