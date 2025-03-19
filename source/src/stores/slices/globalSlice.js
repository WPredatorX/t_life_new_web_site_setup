import { createSlice } from "@reduxjs/toolkit";
import { APPLICATION_DEFAULT } from "@constants";

export const initialState = {
  language: APPLICATION_DEFAULT.language,
  snackBar: APPLICATION_DEFAULT.snackBar,
  dialog: APPLICATION_DEFAULT.dialog,
  activeMenu: APPLICATION_DEFAULT.activeMenu,
  auth: null,
  openDrawer: true,
};

const globalSlice = createSlice({
  initialState,
  name: "globalSlice",
  reducers: {
    setSnackBar: (state, action) => {
      state.snackBar = action.payload;
    },
    resetSnackBar: (state) => {
      state.snackBar = APPLICATION_DEFAULT.snackBar;
    },
    setDialog: (state, action) => {
      state.dialog = action.payload;
    },
    resetDialog: (state) => {
      state.dialog = APPLICATION_DEFAULT.dialog;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    resetLanguage: (state) => {
      state.language = APPLICATION_DEFAULT.language;
    },
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload;
    },
    resetActiveMenu: (state) => {
      state.activeMenu = APPLICATION_DEFAULT.activeMenu;
    },
    setAuth: (state, action) => {
      state.auth = action.payload;
    },
    setOpenDrawer: (state) => {
      state.openDrawer = !Boolean(state.openDrawer);
    },
    closeDialog: (state) => {
      state.dialog = { ...state.dialog, open: false };
    },
  },
});

export default globalSlice.reducer;
export const {
  setSnackBar,
  resetSnackBar,
  setDialog,
  resetDialog,
  setLanguage,
  resetLanguage,
  setActiveMenu,
  resetActiveMenu,
  setAuth,
  setOpenDrawer,
  closeDialog,
} = globalSlice.actions;
