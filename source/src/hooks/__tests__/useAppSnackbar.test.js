import { renderHook, act } from "@utilities/jest";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer } from "@stores/slices";
import useAppSnackbar from "../useAppSnackbar";

describe("useAppSnackbar", () => {
  const mockStore = configureStore({
    reducer: {
      global: globalSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat([]),
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("should render default", () => {
    const { result } = renderHook(() => useAppSnackbar(), { mockStore });

    act(() => {
      result.current.handleSnackAlert({
        open: true,
      });
    });

    const currentState = mockStore.getState();
    expect(currentState.global.snackBar).toStrictEqual({
      action: null,
      anchorOrigin: {
        horizontal: "left",
        vertical: "bottom",
      },
      autoHideDuration: 5000,
      message: "Message",
      onClose: null,
      open: true,
      severity: "error",
    });
  });

  it("should render open", () => {
    const { result } = renderHook(() => useAppSnackbar(), { mockStore });

    act(() => {
      result.current.handleSnackAlert({
        open: true,
        severity: "success",
        message: "Test message",
        severity: "success",
      });
    });

    const currentState = mockStore.getState();
    expect(currentState.global.snackBar).toStrictEqual({
      action: null,
      anchorOrigin: {
        horizontal: "left",
        vertical: "bottom",
      },
      autoHideDuration: 5000,
      message: "Test message",
      onClose: null,
      open: true,
      severity: "success",
    });
  });
});
