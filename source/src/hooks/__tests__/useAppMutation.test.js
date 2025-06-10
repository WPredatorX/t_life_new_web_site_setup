import { renderHook } from "@utilities/jest";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer } from "@stores/slices";
import useAppMutation from "../useAppMutation";

describe("useAppMutation", () => {
  it("should render default", () => {
    const mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });

    const { result } = renderHook(() => useAppMutation(), {
      mockStore,
    });

    expect(result.current).toBeDefined();
  });
});
