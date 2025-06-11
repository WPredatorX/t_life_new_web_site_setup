import { render } from "@testing-library/react";
import { StoreProvider } from "@providers";
import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer, globalInitialState } from "@stores/slices";

describe("StoreProvider", () => {
  let defaultGlobalState = {
    ...globalInitialState,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render without crashing", () => {
    // arrange
    const component = <StoreProvider></StoreProvider>;

    // act
    render(component);

    // assert
    expect(component).toBeDefined();
  });

  it("should render with mockStore", () => {
    // arrange
    const mockStore = () => {
      return configureStore({
        reducer: {
          global: globalSliceReducer,
        },
        preloadedState: {
          global: defaultGlobalState,
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({ serializableCheck: false }).concat([]),
      });
    };

    const component = <StoreProvider mockStore={mockStore}></StoreProvider>;

    // act
    render(component);

    // assert
    expect(component).toBeDefined();
  });
});
