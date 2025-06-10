jest.unmock("@hooks/useAppSearchParams");

import { renderHook } from "@utilities/jest";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer } from "@stores/slices";
import useAppSearchParams from "../useAppSearchParams";

describe("useAppSearchParams", () => {
  it("should render default", () => {
    const mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });

    const { result } = renderHook(() => useAppSearchParams(), {
      mockStore,
    });

    expect(result.current).toBeDefined();
  });
});
