jest.unmock("@hooks/useAppPathname");

import { renderHook } from "@utilities/jest";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer } from "@stores/slices";
import useAppPathname from "@hooks/useAppPathname";

describe("useAppPathname", () => {
  it("should render default", () => {
    const mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });

    const { result } = renderHook(() => useAppPathname(), {
      mockStore,
    });

    expect(result.current).toBe(null);
  });
});
