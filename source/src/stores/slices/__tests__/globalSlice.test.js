import {
  globalSliceReducer as reducer,
  globalInitialState as initialState,
  setSnackBar,
  setDialog,
  setLanguage,
  resetLanguage,
  setActiveMenu,
  resetActiveMenu,
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
  });
});
