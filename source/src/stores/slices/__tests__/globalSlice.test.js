import {
  globalSliceReducer as reducer,
  globalInitialState as initialState,
  setSnackBar,
  setDialog,
  setLanguage,
  resetLanguage,
  setActiveMenu,
  resetActiveMenu,
  resetSnackBar,
  resetDialog,
  setAuth,
  setOpenDrawer,
  closeDialog,
  setBrokerId,
  setUserProfile,
  setSasToken,
  setActivator,
  setTabIndex,
  setPromotionCode,
} from "@stores/slices";
import { APPLICATION_DEFAULT } from "@constants";

describe("Reducer : globalSlice", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("Action", () => {
    it("should set snackbar successfully", () => {
      const newSnackBar = { ...APPLICATION_DEFAULT.snackBar, open: true };
      const action = { type: setSnackBar.type, payload: newSnackBar };
      const nextState = reducer(initialState, action);

      expect(nextState.snackBar).toEqual(newSnackBar);
    });

    it("should set dialog successfully", () => {
      const newDialog = { ...APPLICATION_DEFAULT.dialog, open: true };
      const action = { type: setDialog.type, payload: newDialog };
      const nextState = reducer(initialState, action);

      expect(nextState.dialog).toEqual(newDialog);
    });

    it("should set language successfully", () => {
      const newLanguage = { ...APPLICATION_DEFAULT.language };
      const action = { type: setLanguage.type, payload: newLanguage };
      const nextState = reducer(initialState, action);

      expect(nextState.language).toEqual(newLanguage);
    });

    it("should reset language successfully", () => {
      const newLanguage = "en";
      const action = { type: resetLanguage.type, payload: newLanguage };
      const nextState = reducer(initialState, action);

      expect(nextState.language).toEqual(APPLICATION_DEFAULT.language);
    });

    it("should set active menu successfully", () => {
      const newActiveMenu = { ...APPLICATION_DEFAULT.activeMenu };
      const action = { type: setActiveMenu.type, payload: newActiveMenu };
      const nextState = reducer(initialState, action);

      expect(nextState.activeMenu).toEqual(newActiveMenu);
    });

    it("should reset active menu successfully", () => {
      const newActiveMenu = { ...APPLICATION_DEFAULT.activeMenu };
      const action = { type: resetActiveMenu.type, payload: newActiveMenu };
      const nextState = reducer(initialState, action);

      expect(nextState.activeMenu).toEqual(newActiveMenu);
    });

    it("should resetSnackBar successfully", () => {
      const newState = { ...APPLICATION_DEFAULT.snackBar };
      const action = { type: resetSnackBar.type, payload: newState };
      const nextState = reducer(initialState, action);

      expect(nextState.snackBar).toEqual(newState);
    });

    it("should resetDialog successfully", () => {
      const newState = { ...APPLICATION_DEFAULT.dialog };
      const action = { type: resetDialog.type, payload: newState };
      const nextState = reducer(initialState, action);

      expect(nextState.dialog).toEqual(newState);
    });

    it("should setAuth successfully", () => {
      const newState = {};
      const action = { type: setAuth.type, payload: newState };
      const nextState = reducer(initialState, action);

      expect(nextState.auth).toEqual(newState);
    });

    it("should setOpenDrawer successfully", () => {
      const newState = false;
      const action = { type: setOpenDrawer.type, payload: newState };
      const nextState = reducer(initialState, action);

      expect(nextState.openDrawer).toEqual(newState);
    });

    it("should closeDialog successfully", () => {
      const action = { type: closeDialog.type };
      const nextState = reducer(initialState, action);

      expect(nextState.dialog).toEqual({
        ...nextState.dialog,
        open: false,
      });
    });

    it("should setBrokerId successfully", () => {
      const newState = "";
      const action = { type: setBrokerId.type, payload: newState };
      const nextState = reducer(initialState, action);

      expect(nextState.brokerId).toEqual(newState);
    });

    it("should setUserProfile successfully", () => {
      const newState = {};
      const action = { type: setUserProfile.type, payload: newState };
      const nextState = reducer(initialState, action);

      expect(nextState.userProfile).toEqual(newState);
    });

    it("should setSasToken successfully", () => {
      const newState = "";
      const action = { type: setSasToken.type, payload: newState };
      const nextState = reducer(initialState, action);

      expect(nextState.sasToken).toEqual(newState);
    });

    it("should setActivator successfully", () => {
      const newState = "";
      const action = { type: setActivator.type, payload: newState };
      const nextState = reducer(initialState, action);

      expect(nextState.activator).toEqual(newState);
    });

    it("should setTabIndex successfully", () => {
      const newState = 0;
      const action = { type: setTabIndex.type, payload: newState };
      const nextState = reducer(initialState, action);

      expect(nextState.tabIndex).toEqual(newState);
    });

    it("should setPromotionCode successfully", () => {
      const newState = "";
      const action = { type: setPromotionCode.type, payload: newState };
      const nextState = reducer(initialState, action);

      expect(nextState.promotionCode).toEqual(newState);
    });
  });
});
