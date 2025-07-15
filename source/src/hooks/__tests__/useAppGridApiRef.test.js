import { renderHook } from "@utilities/jest";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer } from "@stores/slices";
import useAppGridApiRef from "../useAppGridApiRef";

describe("useAppGridApiRef", () => {
  it("should render default", () => {
    const mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });

    const { result } = renderHook(() => useAppGridApiRef(), {
      mockStore,
    });

    expect(result.current).toBeDefined();
  });
});
