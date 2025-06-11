jest.unmock("@hooks/useAppRouter");

import { renderHook } from "@utilities/jest";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer } from "@stores/slices";
import useAppRouter from "../useAppRouter";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
}));

describe("useAppRouter", () => {
  it("should render default", () => {
    const mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });

    const { result } = renderHook(() => useAppRouter(), {
      mockStore,
    });

    expect(result.current).toBeDefined();
  });
});
