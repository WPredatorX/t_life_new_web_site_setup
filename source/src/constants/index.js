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

export { menuItem } from "./menu";
