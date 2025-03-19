import globalSliceReducer, {
  setSnackBar,
  resetSnackBar,
  setDialog,
  resetDialog,
  setLanguage,
  resetLanguage,
  initialState as globalInitialState,
  setActiveMenu,
  resetActiveMenu,
  setAuth,
  setOpenDrawer,
  closeDialog,
} from "./globalSlice";

export {
  // #region global slice
  globalInitialState,
  globalSliceReducer,
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
  // #endregion
};
