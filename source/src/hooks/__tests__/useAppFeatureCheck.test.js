import { renderHook } from "@utilities/jest";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer, globalInitialState } from "@stores/slices";
import useAppFeatureCheck from "../useAppFeatureCheck";

describe("useAppFeatureCheck", () => {
  let mockStore = null;

  beforeEach(() => {
    mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render default", () => {
    // arrange
    const expected = { validFeature: false };

    // act
    const { result } = renderHook(() => useAppFeatureCheck(), {
      mockStore,
    });

    // assert
    expect(result.current).toStrictEqual(expected);
  });

  it("should render with auth empty array", () => {
    // arrange
    const expected = { validFeature: true };
    mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      preloadedState: {
        global: { ...globalInitialState, auth: {} },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });

    // act
    const { result } = renderHook(() => useAppFeatureCheck([]), {
      mockStore,
    });

    // assert
    expect(result.current).toStrictEqual(expected);
  });

  it("should render with auth and roles array", () => {
    // arrange
    const expected = { validFeature: true };
    mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      preloadedState: {
        global: {
          ...globalInitialState,
          auth: {
            roles: [
              {
                menus: [
                  {
                    feature: [
                      {
                        code: "feature-01",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });

    // act
    const { result } = renderHook(() => useAppFeatureCheck(["feature-01"]), {
      mockStore,
    });

    // assert
    expect(result.current).toStrictEqual(expected);
  });

  it("should render with auth and null role", () => {
    // arrange
    const expected = { validFeature: false };
    mockStore = configureStore({
      reducer: {
        global: globalSliceReducer,
      },
      preloadedState: {
        global: {
          ...globalInitialState,
          auth: {
            roles: null,
          },
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([]),
    });

    // act
    const { result } = renderHook(() => useAppFeatureCheck(["feature-01"]), {
      mockStore,
    });

    // assert
    expect(result.current).toStrictEqual(expected);
  });
});
