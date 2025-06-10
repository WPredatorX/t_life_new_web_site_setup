import {
  render,
  renderHook,
  renderAfterHook,
  act,
  screen,
  fireEvent,
} from "@utilities/jest";
import { useAppDialog } from "@hooks";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer } from "@stores/slices";

describe("useAppDialog", () => {
  it("should dispatch setDialog type question correctly click confirm with callback ", async () => {
    const confirmCallback = jest.fn();
    const mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });
    const { result } = renderHook(() => useAppDialog(), {
      mockStore,
    });

    act(() => {
      result.current.handleNotification("ทดสอบ", confirmCallback);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;

    await act(async () => {
      await renderAfterHook(renderAction(), {
        mockStore,
      });
    });
    const confirmButton = await screen.findByTestId("dialogConfirm");
    fireEvent.click(confirmButton);

    expect(currentState.global.dialog.title).toBe("ทดสอบ");
    expect(confirmCallback).toHaveBeenCalledTimes(1);
  });

  it("should dispatch setDialog type question correctly click cancel", async () => {
    const confirmCallback = jest.fn();
    const mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });
    const { result } = renderHook(() => useAppDialog(), {
      mockStore,
    });

    act(() => {
      result.current.handleNotification("ทดสอบ", confirmCallback);
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;

    await act(async () => {
      await renderAfterHook(renderAction(), {
        mockStore,
      });
    });
    const button = await screen.findByText("ยกเลิก");
    fireEvent.click(button);

    expect(currentState.global.dialog.title).toBe("ทดสอบ");
    expect(currentState.global.dialog.open).toBe(true);
  });

  it("should dispatch setDialog type question correctly with content", async () => {
    const contentFn = () => <>mock-content-fn</>;
    const mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });
    const { result } = renderHook(() => useAppDialog(), {
      mockStore,
    });

    act(() => {
      result.current.handleNotification("ทดสอบ", null, contentFn);
    });

    const currentState = mockStore.getState();
    const renderContent = currentState.global.dialog.renderContent;

    await act(async () => {
      await renderAfterHook(renderContent(), {
        mockStore,
      });
    });
    const content = await screen.findByText("mock-content-fn");

    expect(currentState.global.dialog.title).toBe("ทดสอบ");
    expect(content).toBeDefined();
  });

  it("should dispatch setDialog type info correctly click confirm with callback ", async () => {
    const callback = jest.fn();
    const mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });
    const { result } = renderHook(() => useAppDialog(), {
      mockStore,
    });

    act(() => {
      result.current.handleNotification(
        "ทดสอบ",
        callback,
        null,
        "info",
        "button-message"
      );
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;

    await act(async () => {
      await renderAfterHook(renderAction(), {
        mockStore,
      });
    });
    const button = await screen.findByText("button-message");
    fireEvent.click(button);

    expect(currentState.global.dialog.title).toBe("ทดสอบ");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should dispatch setDialog type error correctly click confirm with callback ", async () => {
    const callback = jest.fn();
    const mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });
    const { result } = renderHook(() => useAppDialog(), {
      mockStore,
    });

    act(() => {
      result.current.handleNotification("ทดสอบ", callback, null, "error");
    });

    const currentState = mockStore.getState();
    const renderAction = currentState.global.dialog.renderAction;

    await act(async () => {
      await renderAfterHook(renderAction(), {
        mockStore,
      });
    });
    const button = await screen.findByText("ตกลง");
    fireEvent.click(button);

    expect(currentState.global.dialog.title).toBe("ทดสอบ");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should dispatch setDialog show content", async () => {
    const mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });
    const { result } = renderHook(() => useAppDialog(), {
      mockStore,
    });

    act(() => {
      result.current.handleNotificationContent(() => <>mock-content</>);
    });

    const currentState = mockStore.getState();
    const renderContent = currentState.global.dialog.renderContent;

    await act(async () => {
      await renderAfterHook(renderContent(), {
        mockStore,
      });
    });
    const content = await screen.findByText("mock-content");

    expect(content).toBeDefined();
  });
});
