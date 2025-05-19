export const APPLICATION_DEFAULT = {
  language: "th",
  snackBar: {
    open: false,
    autoHideDuration: 5000,

    /** @type {Function} */
    onClose: null,
    message: "Message",

    /** @type {Node} */
    action: null,

    /** @type {import("@mui/material").SnackbarOrigin} */
    anchorOrigin: {
      horizontal: "left",
      vertical: "bottom",
    },
  },
  dialog: {
    title: "",
    open: false,

    /** @type {Function} */
    onClose: null,

    /** @type {Function} */
    renderContent: null,

    /** @type {Function} */
    renderAction: null,
    useDefaultBehavior: true,
    draggable: false,
  },
  activeMenu: { id: 0 },
  drawerWidth: 240,
  dataGrid: {
    pageNumber: 0,
    pageSize: 5,
    pageSizeOption: [5, 25, 50, 100],
  },
};

export const APPLICATION_CONFIGURATION = {
  defaultFileAccept: [".png", ".jpg", ".jpeg"],
  defaultFileExtension: ["image/png", "image/jpg", "image/jpeg"],
  defaultFileSize: 3145728, // 3 Mb.
  documentFileAccept: [".pdf"],
  documentFileExtension: ["application/pdf"],
};

export const APPLICATION_MSAL_CONFIG = {
  auth: {
    clientId: "bddb5a59-306b-4312-ad00-79977dad74f6",
    authority:
      "https://login.microsoftonline.com/94938d1e-e3a9-4d2f-8c63-d7fa99b2e6da",
    redirectUri: process.env.NEXT_PUBLIC_APPLICATION_URL,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const APPLICATION_LOGIN_REQUEST = {
  scopes: [
    "api://f90f719e-1fd5-47bb-8300-243bd6d981c5/OnlineSale.back.Read.SC",
  ],
};

export const APPLICATION_RECORD_STATUS = [
  {
    id: "0",
    label: "ทั้งหมด",
    value: "0",
  },
  { id: "1", label: "แบบร่าง", value: "1" },
  { id: "2", label: "เปิดใช้งาน", value: "2" },
  { id: "3", label: "ยกเลิกใช้งาน", value: "3" },
];

export const APPLICATION_RECORD_PRODUCT_CHANNEL_STATUS = [
  {
    id: "0",
    label: "ทั้งหมด",
    value: "0",
  },
  { id: "1", label: "แบบร่าง", value: "1" },
  { id: "2", label: "รออนุมัติ", value: "2" },
  { id: "3", label: "เปิดใช้งาน", value: "3" },
  { id: "4", label: "ยกเลิกใช้งาน", value: "4" },
];

export const APPLICATION_RECORD_PRODUCT_DISPLAY_CHANNEL_STATUS = [
  {
    id: "0",
    label: "ทั้งหมด",
    value: "0",
  },
  { id: "1", label: "แบบร่าง", value: "1" },
  { id: "2", label: "รออนุมัติ", value: "2" },
  { id: "3", label: "เปิดใช้งาน", value: "3" },
  { id: "4", label: "ยกเลิกใช้งาน", value: "4" },
];

export const APPLICATION_RECORD_PRODUCT_CHANNEL_DETAIL_STATUS = [
  {
    id: "0",
    label: "ทั้งหมด",
    value: "0",
  },
  { id: "1", label: "รออนุมัติ", value: "1" },
  { id: "2", label: "เปิดใช้งาน", value: "2" },
  { id: "3", label: "ยกเลิกใช้งาน", value: "3" },
];

export const APPLICATION_RECORD_BROKER_STATUS = [
  {
    id: "0",
    label: "ทั้งหมด",
    value: "0",
  },
  { id: "1", label: "แบบร่าง", value: "1" },
  { id: "2", label: "เปิดใช้งาน", value: "2" },
  { id: "3", label: "ยกเลิกใช้งาน", value: "3" },
];

export const APPLICATION_CONTENT_FILE_TYPE = [
  {
    id: "0",
    label: "รูปภาพ",
    value: "0",
  },
  { id: "1", label: "ลิ้งค์ยูทูป", value: "1" },
  {
    id: "2",
    label: "ข้อความ",
    value: "2",
  },
];

export const APPLICATION_LOGO_ASPECT = [
  {
    id: "0",
    label: "1:1",
    value: 1,
  },
  {
    id: "1",
    label: "16:9",
    value: 1.777777,
  },
];

export const APPLICATION_BANNER_TYPE = [
  {
    id: "0",
    label: "รูปภาพ",
    description: "Image",
    value: 0,
  },
];

export const APPLICATION_DESCRIPTION_SIZE = [
  {
    id: "1",
    label: "แบบเล็ก",
    value: 8,
  },
  {
    id: "2",
    label: "แบบครึ่ง",
    value: 6,
  },
  {
    id: "3",
    label: "ไม่แสดง",
    value: 12,
  },
];

export const APPLICATION_DESCRIPTION_POSITION = [
  {
    id: "1",
    label: "ซ้าย",
    value: "left",
  },
  {
    id: "2",
    label: "ขวา",
    value: "right",
  },
  {
    id: "3",
    label: "ไม่แสดง",
    value: null,
  },
];

export const APPLICATION_PROMOTION_STATUS = [
  {
    id: "0",
    label: "ทั้งหมด",
    value: null,
  },
  {
    id: "1",
    label: "แบบร่าง",
    value: "1",
  },
  {
    id: "2",
    label: "รออนุมัติ",
    value: "2",
  },
  {
    id: "3",
    label: "เปิดใช้งาน",
    value: "3",
  },
  {
    id: "4",
    label: "ยกเลิกการใช้งาน",
    value: "4",
  },
  {
    id: "5",
    label: "ไม่อนุมัติ",
    value: "5",
  },
];

export const APPLICATION_PROMOTION_TYPE = [
  {
    id: "1",
    label: "ส่วนลดเบี้ยเป็นเปอร์เซ็น",
    disabled: true,
    value: "1",
  },
  {
    id: "2",
    label: "ส่วนลดเบี้ยเป็นจำนวน",
    disabled: true,
    value: "2",
  },
  {
    id: "3",
    label: "ของขวัญของกำนัล",
    disabled: false,
    value: "3",
  },
];

export { menuItem } from "./menu";
